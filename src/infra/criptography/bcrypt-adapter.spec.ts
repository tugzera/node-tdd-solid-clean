import bcrypt, { hash } from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const makeSut = (salt: number): BcryptAdapter => {
    return new BcryptAdapter(salt);
}

const salt = 12


jest.mock('bcrypt', () => ({
    async hash(value: string): Promise<string> {
        return Promise.resolve('hashed_value')
    }
}))

describe('BcryptAdapter', () => {
    test('Should calls BcryptAdapter with the correct values', async () => {
        const sut = makeSut(salt)
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
    });

    test('Should BcryptAdapter returns the correct hashed value', async () => {
        const sut = makeSut(salt)
        const hash = await sut.hash('any_value')
        await sut.hash('any_value')
        expect(hash).toBe('hashed_value')
    });
});