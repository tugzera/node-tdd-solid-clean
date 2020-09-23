import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest } from '../../helpers'
import { AddAccount } from '../../../domain/usecases/add-account'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }


    handle(httpRequest: HttpRequest): HttpResponse {
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
            this.addAccount.add({ name, email, password })
        } catch (error) {
            return {
                statusCode: 500,
                body: new ServerError()
            }
        }
    }
}