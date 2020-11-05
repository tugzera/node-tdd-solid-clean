import request from 'supertest'
import app from '../../config/app'

describe('Signup Route', () => {
    test('Should return account on success', async () => {
        await request(app).post('/api/signup').send({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
            confirm_password: 'any_password'
        }).expect(200)
    });
});