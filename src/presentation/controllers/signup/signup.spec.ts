import { EmailValidator, AddAccount, AddAccountModel, Account } from './signup-protocols'
import { SignUpController } from './signup'
import { ServerError } from '../../errors'

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
}

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
            const fakeAccount = {
                id: "valid_id",
                email: "valid_email",
                password: "valid_password",
                name: "valid_name"
            }
            return Promise.resolve(fakeAccount)
        }
    }
    return new AddAccount()
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
        expect(response.statusCode).toBe(400)
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
        expect(response.statusCode).toBe(400)
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
        expect(response.statusCode).toBe(400)
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
        expect(response.statusCode).toBe(400)
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
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 400 if an invalid email is provided ', async () => {
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
        const response = await sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });

    test('Should return error 500 if EmailValidator throws', async () => {
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
        const response = await sut.handle(httpRequest)
        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual(new ServerError())
    });

    test('Should call AddAccount with correct values ', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                confirm_password: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(addSpy).toBeCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    });
});