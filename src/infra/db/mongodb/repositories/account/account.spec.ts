import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect()
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    }

    test('Should return Account on success', async () => {
        const sut = makeSut()
        const data = {
            name: "any_name",
            email: "any_email",
            password: "any_password"
        }
        const response = await sut.add(data)
        expect(response).toBeTruthy()
        expect(response.id).toBeTruthy()
        expect(response.name).toEqual(data.name)
        expect(response.email).toEqual(data.email)
        expect(response.password).toEqual(data.password)
    });
});