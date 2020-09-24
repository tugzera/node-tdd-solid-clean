import { DbAddAccount } from "./db-add-account";
import { Encrypter } from "../protocols/encrypter";

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async hash(password: string): Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }
    return new EncrypterStub()
}

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub();
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut, encrypterStub
    }
}

describe('DbAccount UseCases', () => {
    test('Should call Encrypter with the right value', async () => {
        const {sut, encrypterStub} = makeSut()
        const data = {
            email: 'any_email', name: 'any_name', password: 'any_password'
        }
        const emailSpy = jest.spyOn(encrypterStub, 'hash')
        await sut.add(data)
        expect(emailSpy).toHaveBeenCalledWith('any_password')
    })
});