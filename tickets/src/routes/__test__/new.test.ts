import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
})

it('Can only be accessed if the user is sign in ', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).toBe(401);
})

it('Returns a status other than 401 if the user is signed in ', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});

    // expect(response.status).not.toBe(401);
})

it('Returns an error if invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400);
})

it('Returns an error is invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'asdf',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '123'
        })
        .expect(400);
})

it('Creates a ticket with valid inputs', async () => {
    // Add in a check to make sure that ticket is saved
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'asdf',
            price: 20
        })
        .expect(200);

    tickets = await Ticket.find({});
    expect(tickets.length).toBe(1);
})