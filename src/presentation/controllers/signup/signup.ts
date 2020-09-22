import { HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'

export class SignUpController {
    handle(request: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'confirm_password']
        const { body } = request
        for (const field of requiredFields) {
            if (!body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}