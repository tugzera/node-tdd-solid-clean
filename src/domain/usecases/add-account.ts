import { Account } from '../models/account'

export interface AddAccount {
    add(data: AddAccountModel): Promise<Account>
}

export interface AddAccountModel {
    name: string,
    email: string,
    password: string
}