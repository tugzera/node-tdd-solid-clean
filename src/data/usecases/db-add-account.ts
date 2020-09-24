import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Account } from '../../domain/models/account'
import { Encrypter } from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter

    constructor(encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    add(data: AddAccountModel): Promise<Account> {
        this.encrypter.hash(data.password)
        return Promise.resolve(null)
    }

}