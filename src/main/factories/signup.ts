import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator'
import { DbAddAccount } from '../../data/usecases/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account/account'

export const makeSignupController = (): SignUpController => {
    const emailValidator = new EmailValidatorAdapter()
    const salt = 12
    const account = new AccountMongoRepository()
    const encrypter = new BcryptAdapter(salt)
    const addAccount = new DbAddAccount(encrypter, account)
    return new SignUpController(emailValidator, addAccount)
}