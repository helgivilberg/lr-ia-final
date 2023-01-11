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
    UserModel

    @inject(Config)
    config

    messagePm = 'UNSET'

    constructor() {
        makeObservable(this, { messagePm: observable })
    }

    load = () => {
        setTimeout(() => {
            this.messagePm = 'LOADED'
        }, 2000)
    }

    reset = () => {
        this.messagePm = 'RESET'
    }

}