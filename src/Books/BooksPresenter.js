import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed, action } from 'mobx'
import { BooksRepository } from './BooksRepository'

@injectable()
export class BooksPresenter {

    @inject(BooksRepository)
    booksRepository

    newBookName = null

    get viewModel() {
        return this.booksRepository.messagePm
    }

    constructor() {
        makeObservable(this, {
            viewModel: computed
        })
    }

    reset = () => {
        // reset form fields
        this.newBookName = ''
    }
}