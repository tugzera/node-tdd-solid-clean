import { Controller } from "../../../presentation/protocols";
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'
import { LogErrorRepository } from '../../../data/protocols/log-error-repository'

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller
    private readonly logRepository: LogErrorRepository

    constructor(controller: Controller, logRepository: LogErrorRepository) {
        this.controller = controller
        this.logRepository = logRepository
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(httpRequest)
        if (response.statusCode === 500) {
            this.logRepository.log(response.body.stack)
        }
        return Promise.resolve(response)
    }
}