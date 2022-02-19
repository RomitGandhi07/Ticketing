import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';


it('Returns a 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .expect(404);
})

it('Returns a ticket if ticket is found', async () => {
    const title = 'concert', price = 20;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(200);

    // console.log(response);
    

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .expect(200);
    
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})