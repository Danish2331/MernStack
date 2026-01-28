import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Strict export matching the user request to fix TypeErrors
export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'LA_GRACE_SECRET_2026');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
};

// Aliases for compatibility just in case other files use 'protect' or 'checkRole'
export const protect = verifyToken;
export const checkRole = authorizeRoles;
