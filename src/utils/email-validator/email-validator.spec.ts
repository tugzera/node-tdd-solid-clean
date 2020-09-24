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
    test('Should return false if EmailValidator returns false', () => {
        const sut = makeSut();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const response = sut.isValid('any_mail')
        expect(response).toBe(false)
    });

    test('Should return true if EmailValidator returns true', () => {
        const sut = makeSut();
        const response = sut.isValid('any_mail@mail.com')
        expect(response).toBe(true)
    });

    test('Should call EmailValidator with correct email', () => {
        const sut = makeSut()
        const emailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_mail@mail.com')
        expect(emailSpy).toBeCalledWith('any_mail@mail.com')
    });
});