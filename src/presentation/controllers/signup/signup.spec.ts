import { SignUpController } from './signup'
import { EmailValidator } from '../../protocols'
import { ServerError } from '../../errors'

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    return {
        sut, emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    test('Should return error 400 if no name is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                password: "any_password",
                confirm_password: "any_password"

            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 400 if no email is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: "any_password",
                confirm_password: "any_password"

            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 400 if no password is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                name: 'any_name',
                confirm_password: "any_password"

            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 400 if no password confirm is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                name: 'any_name',
                password: "any_password"
            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 400 if confirm password is different of password provided ', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "invalid_email@mail.com",
                password: "any_password",
                confirm_password: "different_password"
            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 400 if an invalid email is provided ', () => {
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "invalid_email@mail.com",
                password: "any_password",
                confirm_password: "any_password"
            }
        }
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 500 if EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new ServerError()
        })
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                confirm_password: 'any_password'
            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual(new ServerError())
    });
});