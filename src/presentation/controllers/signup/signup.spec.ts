import {SignUpController} from './signup'

describe('SignUp Controller', () => {
    test('Should return error 400 if no name is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                email: "email@teste.com",
                password: "any_password",
                confirm_password: "any_password"

            }
        }
        const response = sut.handle(httpRequest)
        expect(response.statusCode).toBe(400)
    });
});