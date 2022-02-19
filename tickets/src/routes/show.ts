import { NotFoundError } from '@rtgtickets/common';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }

    res.json(ticket);
})

export {router as ShowTicketRouter}