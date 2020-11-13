import { AddAccount, AddAccountModel } from '../../../../../domain/usecases/add-account'
import { Account } from '../../../../../domain/models/account'
import { MongoHelper } from '../../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccount {
    async add(data: AddAccountModel): Promise<Account> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(data)
        const account = result.ops[0]
        return Promise.resolve(MongoHelper.map(account))
    }
}