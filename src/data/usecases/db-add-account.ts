import { AddAccount, AddAccountModel, Account, Encrypter } from './db-account-protocols'

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