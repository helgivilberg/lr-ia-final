import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed, action } from 'mobx'
import { AuthorsRepository } from './AuthorsRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
export class AuthorsPresenter extends MessagesPresenter {

    @inject(AuthorsRepository)
    authorsRepository

    newAuthorName = ''
    newBookName = ''
    showList = false

    constructor() {
        super()
        makeObservable(this, {
            authors: computed,
            newAuthorName: observable,
            newBookName: observable,
            showList: observable,
            reset: action
        })

        this.init() // for the MessagesPresenter
    }

    get authors() {
        return this.authorsRepository.authors.map(x => {
            return {
                displayName: x.name,
                books: x.bookIds.map(bookId => {
                    return { id: bookId }
                })
            }
        })
    }

    toggleShowList = () => {
        this.showList = !this.showList
    }

    reset = () => {
        // reset form fields
        this.newAuthorName = ''
        this.newBookName = ''
    }

    load = async () => {
        await this.authorsRepository.load()
        this.showList = this.authors.length <= 4
    }


    addBook = async () => {
        await this.authorsRepository.addBookStaging(this.newBookName)
        this.newBookName = ''
    }

    addAuthorAndBooks = async () => {
        let authorAddedPm = await this.authorsRepository.addAuthorAndBooks(this.newAuthorName)
        this.reset()
        await this.load()
        this.unpackRepositoryPmToVm(authorAddedPm, 'Author added')
    }
}