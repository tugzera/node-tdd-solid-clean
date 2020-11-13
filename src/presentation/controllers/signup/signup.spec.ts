import { EmailValidator, AddAccount, AddAccountModel, Account } from './signup-protocols'
import { SignUpController } from './signup'
import { ServerError, InvalidParamError, MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { successRequest, badRequest } from '../../../presentation/helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccount implements AddAccount {
        async add(data: AddAccountModel): Promise<Account> {
            return Promise.resolve(makeFakeAccount())
        }
    }
    return new AddAccount()
}

const makeFakeAccount = (): Account => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirm_password: 'any_password'
    }
})

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return {
        sut, emailValidatorStub, addAccountStub
    }
}

describe('SignUp Controller', () => {
    test('Should return error 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                password: "any_password",
                confirm_password: "any_password"
            }
        }
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new MissingParamError('name')))
    });

    test('Should return error 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: "any_password",
                confirm_password: "any_password"
            }
        }
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new MissingParamError('email')))
    });

    test('Should return error 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                name: 'any_name',
                confirm_password: "any_password"
            }
        }
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new MissingParamError('password')))
    });

    test('Should return error 400 if no password confirm is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                name: 'any_name',
                password: "any_password"
            }
        }
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new MissingParamError('confirm_password')))
    });

    test('Should return error 400 if confirm password is different of password provided ', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "invalid_email@mail.com",
                password: "any_password",
                confirm_password: "different_password"
            }
        }
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new InvalidParamError('confirm_password')))
    });

    test('Should return error 400 if an invalid email is provided ', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = makeFakeRequest()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new InvalidParamError('email')))
    });

    test('Should return error 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new ServerError(null)
        })
        const httpRequest = makeFakeRequest()
        const response = await sut.handle(httpRequest)
        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual(new ServerError(null))
    });

    test('Should call AddAccount with correct values ', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toBeCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    });

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(successRequest(makeFakeAccount()))
    });
});