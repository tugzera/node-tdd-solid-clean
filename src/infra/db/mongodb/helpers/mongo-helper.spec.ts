import { MongoHelper as sut } from '../helpers/mongo-helper'

describe('Mongodb Reconnect', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await sut.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('Should reconnect mongodb if connection is down', async () => {
        let accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
        await sut.disconnect()
        accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
    });
});