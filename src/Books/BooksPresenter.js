import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed, action } from 'mobx'
import { BooksRepository } from './BooksRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
export class BooksPresenter extends MessagesPresenter {

    @inject(BooksRepository)
    booksRepository

    newBookName = '' // both in BooksPresenter and AuthorsPresenter
    lastAddedBook = null // <--

    constructor() {
        super()
        makeObservable(this, {
            newBookName: observable, // <--
            lastAddedBook: observable // <--
        })

        this.init() // for the MessagesPresenter
    }

    reset = () => {
        // reset form fields
        this.newBookName = ''
    }

    load = async () => {
        await this.booksRepository.load()
    }

    addBook = async () => {
        let addBookPm = await this.booksRepository.addBook(this.newBookName)
        await this.booksRepository.load()
        const lastAddedBookPm = this.booksRepository.books[this.booksRepository.books.length-1]
        this.lastAddedBook = {
            visibleName: lastAddedBookPm.name
        }
        this.unpackRepositoryPmToVm(addBookPm, 'Book added')
      }


}