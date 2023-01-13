import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, action, toJS, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
export class BooksRepository {
    baseUrl

    @inject(Types.IDataGateway)
    dataGateway

    @inject(UserModel)
    userModel

    @inject(Config)
    config

    messagePm = 'UNSET'
    books = []

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            books: observable
         })
    }

    load = async () => { // this gets called by the router onEnter


        // getBooks
        const ownerId = this.userModel.email
        const booksDto = await this.dataGateway.get('/books?emailOwnerId='+ownerId)

        if (booksDto.success) {
            this.books = booksDto.result.map((bookDto) => {
                return { name: bookDto.name, id: bookDto.bookId }
            })
        } else {
            this.messagePm = 'Error' // maybe not?
        }

        return MessagePacking.unpackServerDtoToPm(booksDto)


    }

    reset = () => {
        this.messagePm = 'RESET'
        this.books = []
    }

    addBook = async (bookName) => {
        const responseDto = await this.dataGateway.post('/books', {
            name: bookName,
            emailOwnerId: this.userModel.email
        })

        let addBookPm = MessagePacking.unpackServerDtoToPm(responseDto)
        addBookPm.bookId = responseDto.result.bookId

        return addBookPm

    }

    addBookTempStaging = async (bookName) => {
        this.books.push({ name: bookName, id: null })
    }

    getBook = async (bookId) => {
        const ownerId = this.userModel.email

        const getBookDto = await this.dataGateway.get('/book?emailOwdnerId'+ownerId)
        let getBookPm = MessagePacking.unpackServerDtoToPm(getBookDto)
        getBookPm.name = getBookDto.result[0].name
        return getBookPm
    }

}