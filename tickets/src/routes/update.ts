import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError } from '@rtgtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be provided and  greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        // Check whether we found this ticket or not
        if (!ticket) {
            throw new NotFoundError();
        }

        // Check whether person authenticated owns this ticket or not
        if (ticket.userId != req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        // Update Ticket
        ticket.set({
            title: req.body.title,
            price: req.body.price
        });

        await ticket.save();

        res.json(ticket);
    })

export { router as UpdateTicketRouter }