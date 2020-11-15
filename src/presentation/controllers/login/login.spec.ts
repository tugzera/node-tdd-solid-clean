import { HttpRequest, EmailValidator } from "../../protocols";
import { badRequest, serverError } from "../../helpers";
import { MissingParamError, InvalidParamError } from "../../errors";
import { LoginController } from './login'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

interface SutTypes {
    sut: LoginController,
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return { sut, emailValidatorStub }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password'
    }
})

describe('Login Controller', () => {
    test('Should return error 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const data = {
            body: { password: 'any_password' }
        }
        const response = await sut.handle(data)
        expect(response).toEqual(badRequest(new MissingParamError('email')))
    });

    test('Should return error 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const data = {
            body: { email: 'any_email' }
        }
        const response = await sut.handle(data)
        expect(response).toEqual(badRequest(new MissingParamError('password')))
    });

    test('Should return error if no valid email format is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const data = makeFakeRequest()
        const response = await sut.handle(data)
        expect(response).toEqual(badRequest(new InvalidParamError('email')))
    });

    test('Should call email validator with the correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const data = makeFakeRequest()
        await sut.handle(data)
        expect(emailValidatorSpy).toHaveBeenCalledWith('any_email@email.com')
    });

    test('Should returns error 500 if emailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const data = makeFakeRequest()
        const response = await sut.handle(data)
        expect(response).toEqual(serverError(new Error()))
    });
});