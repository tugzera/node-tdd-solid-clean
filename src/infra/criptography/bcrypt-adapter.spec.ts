import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const makeSut = (salt: number): BcryptAdapter => {
    return new BcryptAdapter(salt);
}

describe('BcryptAdapter', () => {
    test('Should calls bcrypt with the correct values', () => {
        const salt = 12
        const sut = makeSut(salt)
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')
        sut.hash('any_value')
        expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
    });
});