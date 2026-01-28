import mongoose, { Schema, Document } from 'mongoose';

export enum BookingStatus {
    SUBMITTED = 'SUBMITTED',
    CHANGE_REQUESTED = 'CHANGE_REQUESTED',
    ADMIN1_APPROVED = 'ADMIN1_APPROVED',
    PAYMENT_REQUESTED = 'PAYMENT_REQUESTED',
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
    FORWARDED_TO_SUPERADMIN = 'FORWARDED_TO_SUPERADMIN',
    BOOKED = 'BOOKED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export interface IBooking extends Document {
    customerId: mongoose.Types.ObjectId;
    halls: mongoose.Types.ObjectId[];
    eventDate: Date;
    eventTime: string;
    documents: {
        data: Buffer;
        contentType: string;
    };
    status: string;
    paymentProof?: {
        data: Buffer;
        contentType: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    halls: [{ type: Schema.Types.ObjectId, ref: 'Hall', required: true }],
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    documents: {
        data: Buffer,
        contentType: String
    },
    status: {
        type: String,
        enum: Object.values(BookingStatus),
        default: BookingStatus.SUBMITTED,
        required: true
    },
    paymentProof: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);
