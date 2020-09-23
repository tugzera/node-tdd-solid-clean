import { Account } from '../model/account'

export interface AddAccount {
    add(data: AddAccountModel): Account
}

export interface AddAccountModel {
    name: string,
    email: string,
    password: string
}