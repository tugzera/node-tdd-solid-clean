import { LogControllerDecorator } from './log'
import { Controller } from '../../../presentation/protocols';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'

const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {

                },
            }
            return Promise.resolve(httpResponse)
        }
    }
    return new ControllerStub()
}

describe('Log Decorator', () => {
    test('Should call controller with the correct values', async () => {
        const controllerStub = makeControllerStub()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest: HttpRequest = {
            body: {}
        }
        const sut = new LogControllerDecorator(controllerStub)
        await sut.handle(httpRequest)
        expect(handleSpy).toBeCalledWith(httpRequest)
    });
});