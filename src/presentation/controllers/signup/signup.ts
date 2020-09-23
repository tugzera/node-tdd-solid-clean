import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest } from '../../helpers'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(request: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'confirm_password']
        const { body } = request
        const { name, email, password, confirm_password } = body
        for (const field of requiredFields) {
            if (!body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
        if (email !== confirm_password) {
            return badRequest(new InvalidParamError('confirm_password'))
        }
        const emailIsValid = this.emailValidator.isValid(body.email)
        if (!emailIsValid) {
            return badRequest(new InvalidParamError('email'))
        }
    }
}