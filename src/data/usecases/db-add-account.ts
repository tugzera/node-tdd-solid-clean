import { AddAccount, AddAccountModel, Account, Encrypter, AddAccountRepository } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    private readonly addAccount: AddAccountRepository

    constructor(encrypter: Encrypter, addAccount: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccount = addAccount
    }

    async add(data: AddAccountModel): Promise<Account> {
        const hashedPassword = await this.encrypter.hash(data.password)
        const dataWithHashedPassword = {...data, password: hashedPassword}
        await this.addAccount.add(data)
        return Promise.resolve(null)
    }

}