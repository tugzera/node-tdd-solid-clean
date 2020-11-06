import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator'
import { DbAddAccount } from '../../data/usecases/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account/account'
import { LogControllerDecorator } from '../decorators/log/log'
import { Controller } from '../../presentation/protocols'

export const makeSignupController = (): Controller => {
    const emailValidator = new EmailValidatorAdapter()
    const salt = 12
    const account = new AccountMongoRepository()
    const encrypter = new BcryptAdapter(salt)
    const addAccount = new DbAddAccount(encrypter, account)
    const controller = new SignUpController(emailValidator, addAccount)
    return new LogControllerDecorator(controller)
}