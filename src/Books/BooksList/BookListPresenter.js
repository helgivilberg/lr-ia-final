import { computed, makeObservable } from "mobx";
import { injectable, inject } from 'inversify'
import { BooksRepository } from "../BooksRepository";

@injectable()
export class BookListPresenter {
    @inject(BooksRepository)
    booksRepository

    get viewModel() {
        return this.booksRepository.bookList.map(x => {
            return {
                visibleName: x.name
            }
        })
    }

    constructor() {
        makeObservable(this, {
            viewModel: computed
        })
    }
}