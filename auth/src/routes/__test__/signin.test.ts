import request from 'supertest';
import { app } from '../../app';

it('Returns 400 when a email that does not exist is supplied', async () => {
    await  request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});


it('Returns 400 when a incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(400)
});

it('Responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response =  request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
});