import { LogErrorRepository } from "../../../../../data/protocols/log-error-repository";
import { MongoHelper } from '../../../mongodb/helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const collection = await MongoHelper.getCollection('errors')
        await collection.insertOne({
            stack,
            date: new Date()
        })
    }
}