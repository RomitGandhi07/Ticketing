import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';


const router = express.Router();

router.post('/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 & 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Verify that user already exist
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already exist')
    }

    // 

    // Create new user and save them in DB
    const user = User.build({
      email: email,
      password: password
    });

    await user.save();

    // Generate JWT (kubectl create secret generic jwt-secret --from-literal=jwt=asdf)
    const userJWT = jwt.sign({
      id: user.id,
      email: email
    }, process.env.JWT_KEY!);

    // Store it on session object
    req.session = {
      jwt: userJWT
    }

    res.status(201).json(user);

  });


export { router as signupRouter }