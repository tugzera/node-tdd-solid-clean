import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
    test('Body Parser', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send(req.body)
        })
        await request(app).post('/test_body_parser').send({ name: "bruno" }).expect({ name: "bruno" })
    })
});