import { DbAddAccount } from "./db-add-account";
import { Encrypter } from "../protocols/encrypter";

describe('DbAccount UseCases', () => {
    test('Should call Encrypter with the right value', async () => {
        class EncrypterStub {
            async hash(password: string): Promise<string> {
                return Promise.resolve('hashed_password')
            }
        }

        const encrypterStub = new EncrypterStub()
        const sut = new DbAddAccount(encrypterStub)
        const data = {
            email: 'any_email', name: 'any_name', password: 'any_password'
        }
        const emailSpy = jest.spyOn(encrypterStub, 'hash')
        await sut.add(data)
        expect(emailSpy).toHaveBeenCalledWith('any_password')
    })
});