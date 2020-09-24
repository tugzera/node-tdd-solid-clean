import { AddAccountModel } from '../../domain/usecases/add-account'
import { Account } from '../../domain/models/account'

export interface AddAccountRepository {
    add(data: AddAccountModel): Promise<Account>
}