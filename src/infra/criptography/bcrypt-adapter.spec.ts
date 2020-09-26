import bcrypt from 'bcrypt'
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
    test('Should calls Bcrypt with the correct values', async () => {
        const sut = makeSut(salt)
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
    });

    test('Should Bcrypt returns the correct hashed value', async () => {
        const sut = makeSut(salt)
        const hash = await sut.hash('any_value')
        await sut.hash('any_value')
        expect(hash).toBe('hashed_value')
    });

    test('Should throws if Bcrypt throws', async () => {
        const sut = makeSut(salt)
        sut.hash('any_value')
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow(new Error())
    });
});