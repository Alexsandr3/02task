import request from 'supertest'

import {HTTP_STATUSES} from "../../src/const/HTTP response status codes";
import {
    dataForCreateUser_01,
} from "./testing_data";
import {client} from "../../src/routes/db";
import {app} from "../../src/app-config";



describe('auth', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    afterAll(async () => {
        await client.close()
    })
    describe(`Auth route`, () => {
        it('01 POST -> "auth/registration": should create new user and send confirmation email with code; status 204;', async () => {
            await request(app)
                .post(`auth/registration`)
                .send(dataForCreateUser_01)
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })
        it('02 POST -> "auth/registration": should return error if email or login already exist; status 400;', async () => {
            await request(app)
                .post(`auth/registration`)
                .send(dataForCreateUser_01)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        })
        it('03 POST -> "auth/registration-email-resending": should send email with new code if user exists but not confirmed yet; status 204;', async () => {
            await request(app)
                .post(`auth/registration-email-resending`)
                .send({email: "Oooooo@com.com"})
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        })
        it('04 POST -> "auth/registration-confirmation": should confirm registration by email; status 204;', async () => {
            await request(app)
                .post(`auth/registration-confirmation`)
                .send({code: '---'})
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })


    })
})








