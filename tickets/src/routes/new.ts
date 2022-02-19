import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@rtgtickets/common'
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets',
    requireAuth,
    [
        body('title')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: String(req.currentUser!.id)
        })

        await ticket.save();

        res.json(ticket);
    });

export { router as CreateTicketRouter }