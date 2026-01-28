import mongoose, { Schema, Document } from 'mongoose';

export interface ITemporaryHold extends Document {
    userId: mongoose.Types.ObjectId;
    hallId: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    slotIndices: number[]; // e.g. [20, 21, 22]
    expiresAt: Date;
    createdAt: Date;
}

const TemporaryHoldSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hallId: { type: Schema.Types.ObjectId, ref: 'Hall', required: true },
    date: { type: String, required: true },
    slotIndices: [{ type: Number, required: true }],
    expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL Index: Auto-delete when Date is reached
}, {
    timestamps: true
});

export default mongoose.model<ITemporaryHold>('TemporaryHold', TemporaryHoldSchema);
