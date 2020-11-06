import { LogControllerDecorator } from './log'
import { Controller } from '../../../presentation/protocols';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'

describe('Log Decorator', () => {
    test('Should call controller with the correct values', async () => {
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
        const controllerStub = new ControllerStub()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                confirm_password: 'any_password'
            }
        }
        const sut = new LogControllerDecorator(controllerStub)
        await sut.handle(httpRequest)
        expect(handleSpy).toBeCalledWith(httpRequest)
    });
});