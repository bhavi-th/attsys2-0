import { ClassSession } from '../models/ClassSession.js';

export const CLASS_DURATION_MS = 30 * 60 * 1000;

const classSessionFilter = ({ teacherId, branch, subject, section, semester }) => ({
    teacherId,
    branch,
    subject,
    section: Number(section),
    semester: Number(semester),
});

export async function findActiveClassSession(context) {
    return ClassSession.findOne({
        ...classSessionFilter(context),
        startedAt: { $gt: new Date(Date.now() - CLASS_DURATION_MS) },
    }).sort({ startedAt: -1 });
}

export async function getOrCreateClassSession(context) {
    const existing = await findActiveClassSession(context);
    if (existing) {
        return existing;
    }

    return ClassSession.create({
        ...classSessionFilter(context),
        startedAt: new Date(),
    });
}

export function classSessionWindow(startedAt) {
    const start = new Date(startedAt);
    const end = new Date(start.getTime() + CLASS_DURATION_MS);
    return { start, end };
}

export function attendanceForClassSession(classSession, extra = {}) {
    const { start, end } = classSessionWindow(classSession.startedAt);
    return {
        ...extra,
        $or: [{ classSessionId: classSession._id }, { date: { $gte: start, $lt: end } }],
    };
}
