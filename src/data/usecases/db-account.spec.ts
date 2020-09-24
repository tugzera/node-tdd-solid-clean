import { DbAddAccount } from "./db-add-account";
import { Encrypter, AddAccountModel, Account, AddAccountRepository } from './db-account-protocols'

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async hash(password: string): Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub {
        add(data: AddAccountModel): Promise<Account> {
            const fakeAccount = {
                id: "valid_email",
                name: "valid_name",
                email: "valid_email",
                password: "valid_password"
            }
            return Promise.resolve(fakeAccount)
        }
    }
    return new AddAccountRepositoryStub()
}

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub();
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut, encrypterStub, addAccountRepositoryStub
    }
}

describe('DbAccount UseCases', () => {
    test('Should call Encrypter with the right value', async () => {
        const { sut, encrypterStub } = makeSut()
        const data = {
            email: 'any_email', name: 'any_name', password: 'any_password'
        }
        const emailSpy = jest.spyOn(encrypterStub, 'hash')
        await sut.add(data)
        expect(emailSpy).toHaveBeenCalledWith('any_password')
    })

    test('Should throws if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    });

    test('Should call AddAccountRepository with the right values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const data = {
            id: 'valid_id',
            email: 'valid_email',
            name: 'valid_name',
            password: 'hashed_password'
        }
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(data)
        expect(addSpy).toHaveBeenCalledWith(data)
    })
});