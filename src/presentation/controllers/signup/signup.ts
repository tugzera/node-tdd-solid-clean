import { HttpRequest, HttpResponse } from '../../protocols'

export class SignUpController {
    handle(request: HttpRequest): HttpResponse {
        if (!request.body.name) {
            return { statusCode: 400, body: new Error() }
        }
    }
}