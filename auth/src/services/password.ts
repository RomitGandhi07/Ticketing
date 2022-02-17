import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        // Generate random salt
        const salt = randomBytes(8).toString('hex');

        // Generate the buffer
        const buff = (await scryptAsync(password, salt, 64)) as Buffer;

        // Return buffer.salt
        return `${buff.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        // Get hashedpasword and salt by splitting storedPassword with .
        const [hashedPassword, salt] = storedPassword.split('.');

        // Generate buffer of suppliedPassword
        const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        // Compare the buffer with hashed password  
        return buff.toString('hex') === hashedPassword;
    }
}