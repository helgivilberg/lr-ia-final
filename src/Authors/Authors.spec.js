import 'reflect-metadata'

import { Types } from '../Core/Types'
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub'
import { GetSuccessfulBookAddedStub } from '../TestTools/GetSuccessfulBookAddedStub'
import { GetSuccessfulAuthorAddedStub } from '../TestTools/GetSuccessfulAuthorAddedStub'
import { SingleBookResultStub } from '../TestTools/SingleBookResultStub'
import { SingleAuthorsResultStub } from '../TestTools/SingleAuthorsResultStub'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { AuthorsPresenter } from './AuthorsPresenter'
import { BookListPresenter } from '../Books/BookList/BookListPresenter'
import { BooksRepository } from '../Books/BooksRepository'
import { BooksPresenter } from '../Books/BooksPresenter'

let appTestHarness = null
let dataGateway = null
let authorsPresenter = null
let bookListPresenter = null
let booksRepository = null
let dynamicBookNamesStack = null
let dynamicBookIdStack = null

describe('authors', () => {
  beforeEach(async () => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    appTestHarness.bootStrap(() => {})
    await appTestHarness.setupLogin(GetSuccessfulUserLoginStub, 'login')
    authorsPresenter = appTestHarness.container.get(AuthorsPresenter)
    bookListPresenter = appTestHarness.container.get(BookListPresenter)
    booksRepository = appTestHarness.container.get(BooksRepository)
    dataGateway = appTestHarness.container.get(Types.IDataGateway)
    dynamicBookNamesStack = ['bookA', 'bookB', 'bookC']
    dynamicBookIdStack = [5, 4, 3, 2, 1]

    dataGateway.post.mockImplementation((path) => {
      if (path.indexOf('/books') !== -1) {
        return Promise.resolve(GetSuccessfulBookAddedStub(dynamicBookIdStack.pop()))
      } else if (path.indexOf('/authors') !== -1) {
        return Promise.resolve(GetSuccessfulAuthorAddedStub())
      }
    })

    dataGateway.get.mockImplementation((path) => {
      if (path.indexOf('/authors') !== -1) {
        return Promise.resolve(SingleAuthorsResultStub())
      } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
        return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
      }
    })
  })

  describe('loading', async () => {


    it('should load list author and books into ViewModel', async () => {
        await authorsPresenter.load()

        expect(authorsPresenter.authors.length).toBeGreaterThan(0)
    })

    it('should show author list (toggle) when has authors', async () => {
        await authorsPresenter.load()
        expect(authorsPresenter.showList).toBe(true)
    })

    it('should hide author list (toggle) when has more than 4 authors', async () => {
        dataGateway.get.mockImplementation((path) => {
            const dto = SingleAuthorsResultStub()

            dto.result = [...dto.result, ...dto.result, ...dto.result, ...dto.result, ...dto.result] // fake more authors
            return Promise.resolve(dto)

        })

        await authorsPresenter.load() //
        expect(authorsPresenter.authors.length).toBeGreaterThan(4)
        expect(authorsPresenter.showList).toBe(false)
    })

    it('should show/hide author list when you  toggle manually', async () => {
        await authorsPresenter.load() //
        expect(authorsPresenter.showList).toBe(true)
        authorsPresenter.toggleShowList()
        expect(authorsPresenter.showList).toBe(false)
    })
  })


  // refactor together these pivots


  describe('saving', () => {

    beforeEach(() => {
        dataGateway.post.mockImplementation((path, body) => {
            if (path.indexOf('/books') !== -1) {
                if (body.name === "Foo 1") {
                    return Promise.resolve(GetSuccessfulBookAddedStub(91))
                }

                if (body.name === "Foo 2") {
                    return Promise.resolve(GetSuccessfulBookAddedStub(92))
                }
            }

            if (path.indexOf('/authors') !== -1) {
                return Promise.resolve(GetSuccessfulAuthorAddedStub());
            }
        })

    })
    it('should allow single author to be added and will reload authors list', async () => {

        authorsPresenter.newAuthorName = 'New Author Name'

        // pivot
        dataGateway.get.mockImplementation((path) => {
            if (path.indexOf('/authors') !== -1) {
                const dto = SingleAuthorsResultStub()
                dto.result.push({
                    authorId: 3,
                    name: 'New Author Name',
                    bookIds: [],
                })
              return Promise.resolve(dto)
            }
        })

        await authorsPresenter.addAuthorAndBooks()

        // We have to make sure our ui is calling the endpoint correctly
        expect(dataGateway.post).toHaveBeenCalledWith('/authors', {
            emailOwnerId: 'a@b.com', // TODO refactor
            bookIds: [],
            name: 'New Author Name'
        })

        // endpoint should be called
        expect(dataGateway.get).toHaveBeenCalledWith('/authors?emailOwnerId=a@b.com')

        expect(authorsPresenter.authors[2].displayName).toBe("New Author Name")
    })

    it('should allow books to be staged and then save authors and books to api', async () => {
        authorsPresenter.newBookName = 'Foo 1'
        await authorsPresenter.addBook()
        authorsPresenter.newBookName = 'Foo 2'
        await authorsPresenter.addBook()
        authorsPresenter.newAuthorName = 'New Author Name'

        // pivot
        dataGateway.get.mockImplementation((path) => {
            if (path.indexOf('/authors') !== -1) {
                const dto = SingleAuthorsResultStub()
                dto.result.push({
                    authorId: 3,
                    name: 'New Author Name',
                    bookIds: [91, 92],
                })
              return Promise.resolve(dto)
            }
        })


        await authorsPresenter.addAuthorAndBooks()

        expect(dataGateway.post).toHaveBeenCalledWith('/books', {
            emailOwnerId: 'a@b.com', // TODO refactor
            name: 'Foo 1'
        })

        expect(dataGateway.post).toHaveBeenCalledWith('/books', {
            emailOwnerId: 'a@b.com', // TODO refactor
            name: 'Foo 2'
        })

        expect(dataGateway.post).toHaveBeenCalledWith('/authors', {
            emailOwnerId: 'a@b.com', // TODO refactor
            bookIds: [91, 92],
            name: 'New Author Name'
        })



        // endpoint should be called
        expect(dataGateway.get).toHaveBeenCalledWith('/authors?emailOwnerId=a@b.com')

        // the author should be added to the authors list
        // and it should have references to books
        expect(authorsPresenter.authors[2].displayName).toBe("New Author Name")
        expect(authorsPresenter.authors[2].books[0].id).toEqual(91)
        expect(authorsPresenter.authors[2].books[1].id).toEqual(92)
        // expect(authorsPresenter.authors).toEqual([]) // for debugging
    })
  })
})