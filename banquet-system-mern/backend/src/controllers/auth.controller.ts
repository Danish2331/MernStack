import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

// 1. INTEGRITY SYNC: MATCHING SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'LA_GRACE_SECRET_2026';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hashing done by pre-save hook or manual here? 
        // User model usually handles it, but let's be explicit if we use insertOne, 
        // but for standard Register we use .save() which uses pre-save.
        // HOWEVER, previous conversation stabilized on bcryptjs usage.

        user = new User({ name, email, password });
        await user.save(); // Assuming pre-save hook handles hashing if password is modified

        // Payload
        const payload = {
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error("Register Error:", error);
        res.status(500).send('Server Error');
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        console.log(`Login Attempt: ${email}`);

        // 1. Check User
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Check Password
        // Use bcrypt.compare since we standardized on bcryptjs
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Generate Token with SYNCHRONIZED Secret
        const payload = {
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        console.log("Login Success, Token Generated");

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(500).send('Server Error');
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        res.json(user);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
