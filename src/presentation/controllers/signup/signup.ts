import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest, successRequest } from '../../helpers'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }


    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['name', 'email', 'password', 'confirm_password']
            const { body } = httpRequest
            const { name, email, password, confirm_password } = body
            for (const field of requiredFields) {
                if (!body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const isValid = this.emailValidator.isValid(body.email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            if (password !== confirm_password) {
                return badRequest(new InvalidParamError('confirm_password'))
            }
            const data = await this.addAccount.add({ name, email, password })
            return Promise.resolve(successRequest(data))
        } catch (error) {
            return {
                statusCode: 500,
                body: new ServerError(null)
            }
        }
    }
}