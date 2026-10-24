import mongoose from 'mongoose';

const classSessionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    branch: { type: String, required: true },
    subject: { type: String, required: true },
    section: { type: Number, required: true },
    semester: { type: Number, required: true },
    startedAt: { type: Date, required: true, default: Date.now },
});

classSessionSchema.index({
    teacherId: 1,
    branch: 1,
    subject: 1,
    section: 1,
    semester: 1,
    startedAt: -1,
});

export const ClassSession =
    mongoose.models.ClassSession || mongoose.model('ClassSession', classSessionSchema);
