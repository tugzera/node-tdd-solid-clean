export interface Encrypter {
    hash(password: string): Promise<string>
}