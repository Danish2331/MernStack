import { Request, Response } from 'express';
import Hall from '../models/Hall';

export const getAllHalls = async (req: Request, res: Response) => {
    try {
        const halls = await Hall.find();
        res.json(halls);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Add other exports just in case routes import them
export const getHallById = async (req: Request, res: Response) => {
    try {
        const hall = await Hall.findById(req.params.id);
        if (!hall) return res.status(404).json({ message: "Hall not found" });
        res.json(hall);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const createHall = async (req: Request, res: Response) => res.status(201).json({ message: "Stub" });
export const updateHall = async (req: Request, res: Response) => res.status(200).json({ message: "Stub" });
export const deleteHall = async (req: Request, res: Response) => res.status(200).json({ message: "Stub" });
