import bcrypt from 'bcrypt'

export class BcryptAdapter {
    private readonly salt

    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        const hashed = await bcrypt.hash(value, this.salt)
        return hashed
    }
}