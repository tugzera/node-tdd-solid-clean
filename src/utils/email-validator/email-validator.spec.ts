import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock("validator", () => ({
    isEmail(): boolean {
        return true
    }
}))

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
    test('Should return false if email validator returns false ', () => {
        const sut = makeSut();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const response = sut.isValid('any_mail')
        expect(response).toBe(false)
    });

    test('Should return false if email validator returns false ', () => {
        const sut = makeSut();
        const response = sut.isValid('any_mail@mail.com')
        expect(response).toBe(true)
    });
});