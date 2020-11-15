import { Controller, HttpRequest, HttpResponse, EmailValidator } from "../../protocols";
import { badRequest, serverError } from "../../helpers";
import { MissingParamError, InvalidParamError } from "../../errors";

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle(HttpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']
            const { body } = HttpRequest
            const { email, password } = body
            for (const field of requiredFields) {
                if (!body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const isValidEmailFormat = this.emailValidator.isValid(email)
            if (!isValidEmailFormat) {
                return badRequest(new InvalidParamError('email'))
            }

        }
        catch (error) {
            return serverError(error)
        }
    }
}