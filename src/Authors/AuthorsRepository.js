import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, action, toJS, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
export class AuthorsRepository {
    baseUrl

    @inject(Types.IDataGateway)
    dataGateway

    @inject(UserModel)
    userModel

    @inject(Config)
    config

    messagePm = 'UNSET'
    authors = []
    books = []

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            authors: observable,
            books: observable
         })
    }

    load = async () => { // this gets called by the router onEnter
        // setTimeout(() => {
        //     this.messagePm = 'LOADED'
        //     this.authors = [
        //         {
        //             name: "foo 1"
        //         },
        //         {
        //             name: "foo 2"
        //         }
        //     ]
        // }, 2000)

        // getAuthors
        const ownerId = this.userModel.email
        const authorsDto = await this.dataGateway.get('/authors?emailOwnerId='+ownerId)

        if (authorsDto.success) {
            this.authors = authorsDto.result // TODO
            this.messagePm = 'Loaded'
        } else {
            this.messagePm = 'Error' // maybe not?
        }

        return MessagePacking.unpackServerDtoToPm(authorsDto)


    }

    reset = () => {
        this.messagePm = 'RESET'
        this.books = []
        this.authors = []
    }

    // addBook = async (bookName) => {
    //     const responseDto = await this.dataGateway.post('/books', {
    //         name: bookName,
    //         emailOwnerId: this.userModel.email
    //     })

    //     return responseDto

    // }

    addBookStaging = async (name)  => {
        this.books.push(name)
    }

    addAuthorAndBooks = async (newAuthorName) => {

        // post each book
        let bookIds = []
        for (const bookName of this.books) {
            const responseDto = await this.dataGateway.post('/books', {
                name: bookName,
                emailOwnerId: this.userModel.email
            })

            if (responseDto.success) {
                bookIds.push(responseDto.result.bookId)
            } else {
                console.error("error", responseDto)
            }

            let addBookPm = MessagePacking.unpackServerDtoToPm(responseDto)
            addBookPm.bookId = responseDto.result.bookId
        }

        // then post the author, with book ids
        const responseDto = await this.dataGateway.post('/authors', {
            name: newAuthorName,
            emailOwnerId: this.userModel.email,
            bookIds: bookIds
        })


        return MessagePacking.unpackServerDtoToPm(responseDto)
    return responseDto

    }

}