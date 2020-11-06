import { LogControllerDecorator } from './log'
import { Controller } from '../../../presentation/protocols';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'


class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
            statusCode: 200,
            body: {},
        }
        return Promise.resolve(httpResponse)
    }
}

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: ControllerStub
}

const makeControllerStub = (): Controller => {

    return new ControllerStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    return {
        sut,
        controllerStub
    }
}

describe('Log Decorator', () => {
    test('Should call controller with the correct values', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest: HttpRequest = {
            body: {}
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toBeCalledWith(httpRequest)
    });

    test('Should returns the same content off controller', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {}
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {},
        })
    });
});