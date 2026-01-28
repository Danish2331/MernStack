import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'CUSTOMER' | 'ADMIN1' | 'ADMIN2' | 'SUPERADMIN';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId; // For Admin hierarchy tracking
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['CUSTOMER', 'ADMIN1', 'ADMIN2', 'SUPERADMIN'],
        default: 'CUSTOMER'
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' } // Hierarchy enforcement
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt); // Cast to string as isModified check ensures it exists
        next();
    } catch (error: any) { // Type 'any' used to bypass TS checking for next(error)
        next(error);
    }
});

// Password Comparison Method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password as string);
};

export default mongoose.model<IUser>('User', UserSchema);
