import mongoose, { Schema, Document } from 'mongoose';

export type SlotStatus = 'AVAILABLE' | 'HELD' | 'BOOKED';

export interface ISlot {
    index: number; // 0-47 (00:00 - 23:30)
    status: SlotStatus;
    lockedBy?: mongoose.Types.ObjectId; // Reference to TemporaryHold or Booking ID
}

export interface IHallDayInventory extends Document {
    hallId: mongoose.Types.ObjectId;
    date: string; // ISO Date String YYYY-MM-DD
    slots: ISlot[]; // Fixed array of 48 slots
    version: number; // For optimistic concurrency if needed
}

const SlotSchema = new Schema({
    index: { type: Number, required: true },
    status: {
        type: String,
        enum: ['AVAILABLE', 'HELD', 'BOOKED'],
        default: 'AVAILABLE'
    },
    lockedBy: { type: Schema.Types.ObjectId, ref: 'User' } // Can map to Hold or Booking
}, { _id: false });

const HallDayInventorySchema: Schema = new Schema({
    hallId: { type: Schema.Types.ObjectId, ref: 'Hall', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    slots: {
        type: [SlotSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 48']
    },
    version: { type: Number, default: 0 }
}, { timestamps: true });

function arrayLimit(val: any[]) {
    return val.length === 48;
}

// Compound Index: One inventory doc per Hall per Day
HallDayInventorySchema.index({ hallId: 1, date: 1 }, { unique: true });

export default mongoose.model<IHallDayInventory>('HallDayInventory', HallDayInventorySchema);
