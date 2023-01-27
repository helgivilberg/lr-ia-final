import 'reflect-metadata'

import { Types } from '../Core/Types';
import { AppTestHarness } from '../TestTools/AppTestHarness';
import { GetSuccessfulBookAddedStub } from '../TestTools/GetSuccessfulBookAddedStub';
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub';
import { SingleBooksResultStub } from '../TestTools/SingleBooksResultStub';
import { BookListPresenter } from './BookList/BookListPresenter';
import { BooksPresenter } from './BooksPresenter';
import { BooksRepository } from './BooksRepository';

let appTestHarness = null
let dataGateway = null
let booksPresenter = null
let bookListPresenter = null
let booksRepository = null


describe('books', () => {
    beforeEach(async () => {
        // in here you instantiate the black box
        // (for anything that you add into this file)
        appTestHarness = new AppTestHarness()
        appTestHarness.init()
        // router = appTestHarness.container.get(Router)
        // routerRepository = appTestHarness.container.get(RouterRepository)
        // routerGateway = appTestHarness.container.get(Types.IRouterGateway)
        dataGateway = appTestHarness.container.get(Types.IDataGateway)
        // userModel = appTestHarness.container.get(UserModel)
        let onRouteChanged = () => {}
        appTestHarness.bootStrap(onRouteChanged)

        booksRepository = appTestHarness.container.get(BooksRepository)
        booksPresenter = appTestHarness.container.get(BooksPresenter)
        bookListPresenter = appTestHarness.container.get(BookListPresenter)

        await appTestHarness.setupLogin(GetSuccessfulRegistrationStub, 'login')

        // dataGateway.get = jest.fn().mockImplementation((path) => {
        //     return Promise.resolve(SingleBooksResultStub())
        // })
    })

    describe('loading',  () => {
        it('should show book list', async () => {
            await booksPresenter.load() // I feel like this should be booksPresenter

            expect(dataGateway.get).toHaveBeenCalled()
            expect(bookListPresenter.viewModel.length).toBeGreaterThan(0)
        })
    })

    describe('saving (add book)', () => {
        beforeEach(async () => {
            //
            dataGateway.post = jest.fn().mockImplementation((path, requestDto) => {
                return Promise.resolve(GetSuccessfulBookAddedStub(undefined))
            })
            // add book
            await booksRepository.load()
            expect(bookListPresenter.viewModel.length).toBe(4)
            booksPresenter.newBookName = 'The Dark Forest' //

            // pivot (return a list of +1 books)
            dataGateway.get = jest.fn().mockImplementation((path, requestDto) => {
                const books = SingleBooksResultStub()
                books.result.push({
                    bookId: 999,
                    name: 'The Dark Forest',
                    emailOwnerId: 'a@b.com',
                    devOwnerId: 'pete@logicroom.co'
                  }
                )
                return Promise.resolve(books)
            })
            await booksPresenter.addBook()
        })

        it('should reload books list', async () => {
            // look at books list, see 1 added
            expect(dataGateway.get).toHaveBeenCalledWith('/books?emailOwnerId=a@b.com')
            expect(bookListPresenter.viewModel.length).toBe(5)
        })

        it('should update books message', async () => {
            expect(booksPresenter.messages).toEqual(["Book added"])
        })

        it('should show the last added book', async () => {
            expect(booksPresenter.lastAddedBook.visibleName).toBe('The Dark Forest')
        })

        // it('cannot add a book with no name', async () => {
            // oh, it's validated only in the React Component
        //     booksPresenter.newBookName = ''
        //     booksPresenter.addBook()
        //     expect(booksPresenter.messages).toEqual('No book name')
        // })
    })
})