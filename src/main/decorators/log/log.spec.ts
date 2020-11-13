import { LogControllerDecorator } from './log'
import { Controller } from '../../../presentation/protocols';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'
import { LogErrorRepository } from '../../../data/protocols/log-error-repository'
import { serverError, successRequest } from '../../../presentation/helpers/http-helper'

class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
            statusCode: 200,
            body: {},
        }
        return Promise.resolve(httpResponse)
    }
}

const makeControllerStub = (): Controller => {
    return new ControllerStub()
}

const makeLogRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return Promise.resolve()
        }
    }
    return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {}
})

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: ControllerStub,
    logErrorRepositoryStub: LogErrorRepository,
}

const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const logErrorRepositoryStub = makeLogRepositoryStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('Log Decorator', () => {
    test('Should call controller with the correct values', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(handleSpy).toBeCalledWith(httpRequest)
    });

    test('Should returns the same content of controller', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(successRequest({}))
    });

    test('Should call LogErrorRepository if controller throws a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        jest.spyOn(controllerStub, 'handle').mockReturnValue(Promise.resolve(error))
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    });
});