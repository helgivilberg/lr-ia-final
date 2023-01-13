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
    bookList = []

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            bookList: observable
         })
    }

    load = async () => { // this gets called by the router onEnter
        // setTimeout(() => {
        //     this.messagePm = 'LOADED'
        //     this.bookList = [
        //         {
        //             name: "foo 1"
        //         },
        //         {
        //             name: "foo 2"
        //         }
        //     ]
        // }, 2000)

        // getBooks
        const ownerId = this.userModel.email
        const booksDto = await this.dataGateway.get('/books?emailOwnerId='+ownerId)

        if (booksDto.success) {
            this.bookList = booksDto.result
            this.messagePm = 'Loaded'
        } else {
            this.messagePm = 'Error' // maybe not?
        }

        return MessagePacking.unpackServerDtoToPm(booksDto)


    }

    reset = () => {
        this.messagePm = 'RESET'
    }

    addBook = async (bookName) => {
        const responseDto = await this.dataGateway.post('/books', {
            name: bookName,
            emailOwnerId: this.userModel.email
        })

        return responseDto

    }

}