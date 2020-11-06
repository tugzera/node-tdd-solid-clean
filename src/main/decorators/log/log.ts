import { Controller } from "../../../presentation/protocols";
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller

    constructor(controller: Controller) {
        this.controller = controller
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(httpRequest)
        return Promise.resolve(response)
    }
}