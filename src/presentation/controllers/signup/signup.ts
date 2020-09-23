import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest } from '../../helpers'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
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

        } catch (error) {
            return {
                statusCode: 500,
                body: ''
            }
        }
    }
}