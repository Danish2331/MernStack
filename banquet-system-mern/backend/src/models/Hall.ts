import mongoose, { Schema, Document } from 'mongoose';

export interface IHall extends Document {
    name: string;
    type: 'Silver' | 'Gold' | 'Diamond';
    capacity: number;
    price: number;
    panoramaUrl: string;
    amenities: string[];
}

const HallSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Silver', 'Gold', 'Diamond'], required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    panoramaUrl: { type: String, required: true },
    amenities: [{ type: String }]
});

export default mongoose.model<IHall>('Hall', HallSchema);
