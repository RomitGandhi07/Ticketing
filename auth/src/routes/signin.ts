import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email').
            isEmail()
            .withMessage('Email must be valid'),
        body('password').
            trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;
    
        // Check whether user is exist or not if is not exist then throw BadRequestError
        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }
        
        // Match password
        const passwordMatch = await Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid Credentials');
        }

        // Generate JWT (kubectl create secret generic jwt-secret --from-literal=jwt=asdf)
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: email
        }, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: userJWT
        }

        res.status(201).json(existingUser);

    });


export { router as signinRouter }