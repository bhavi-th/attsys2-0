import express from 'express';
import Attendance from '../models/Attendance.js';
import { Session } from '../models/Session.js';
import { ClassSession } from '../models/ClassSession.js';
import User from '../models/User.js';
import {
    attendanceForClassSession,
    classSessionWindow,
    findActiveClassSession,
} from '../utils/classSession.js';

const router = express.Router();

// 1. Verify and Mark Attendance
router.post('/verify', async (req, res) => {
    // Added semester to destructuring
    const { passkey, studentId, branch, subject, section, semester } = req.body;
    const sectionNum = Number(section);
    const semesterNum = Number(semester);

    try {
        const activeSession = await Session.findOne({
            passkey,
            branch,
            subject,
            section: sectionNum,
            semester: semesterNum,
        });

        if (!activeSession) {
            return res.status(400).json({ error: 'Invalid QR code or context mismatch' });
        }

        if (new Date() > activeSession.expiresAt) {
            return res.status(410).json({ error: 'QR Code has expired!' });
        }

        if (!activeSession.classSessionId) {
            return res.status(400).json({ error: 'Invalid QR code or context mismatch' });
        }

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Validation including semester check
        const isCorrectBranch = student.branch === branch;
        const isCorrectSection = Number(student.section) === sectionNum;
        // Assuming student model also stores their current semester
        // const isCorrectSemester = student.semester === Number(semester);

        if (!isCorrectBranch || !isCorrectSection) {
            return res.status(403).json({
                error: `Access denied: Target ${branch}-${section}, but you are ${student.branch}-${student.section}`,
            });
        }

        const classSession = await ClassSession.findById(activeSession.classSessionId);
        if (!classSession) {
            return res.status(400).json({ error: 'Invalid QR code or context mismatch' });
        }

        const alreadyMarked = await Attendance.findOne(
            attendanceForClassSession(classSession, {
                studentId,
                subject,
                section: sectionNum,
            }),
        );

        if (alreadyMarked) {
            return res
                .status(400)
                .json({ error: 'Attendance already recorded for this session' });
        }

        try {
            await Attendance.create({
                studentId,
                usn: student.usn,
                studentName: student.name,
                teacherId: activeSession.teacherId,
                classSessionId: classSession._id,
                subject,
                section: sectionNum,
                branch,
                semester: semesterNum,
                status: 'Present',
                date: new Date(),
            });
        } catch (createErr) {
            if (createErr.code === 11000) {
                return res
                    .status(400)
                    .json({ error: 'Attendance already recorded for this session' });
            }
            throw createErr;
        }

        console.log(
            `Attendance marked: ${student.name} (${student.usn}) for ${subject} session ${classSession._id}`,
        );
        res.status(200).json({ message: 'Attendance marked successfully!' });
    } catch (err) {
        console.error('VERIFY ERROR:', err);
        res.status(500).json({ error: 'Server error during verification' });
    }
});

// 2. Fetch Attendance List (Added :semester to the URL params)
router.get('/list/:teacherId/:branch/:subject/:section/:semester', async (req, res) => {
    try {
        const { teacherId, branch, subject, semester, section } = req.params;

        const sectionNum = parseInt(section, 10);
        const semesterNum = parseInt(semester, 10);

        // Validation: If either is NaN, return a clean error instead of crashing
        if (isNaN(sectionNum) || isNaN(semesterNum)) {
            return res.status(400).json({
                error: `Invalid parameters. Received Section: ${section}, Semester: ${semester}`,
            });
        }

        const allStudents = await User.find({
            role: 'student',
            section: sectionNum,
            branch,
        });

        const classSessionContext = {
            teacherId,
            branch,
            subject,
            section: sectionNum,
            semester: semesterNum,
        };

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const classSession =
            (await findActiveClassSession(classSessionContext)) ||
            (await ClassSession.findOne({
                ...classSessionContext,
                startedAt: { $gte: todayStart },
            }).sort({ startedAt: -1 }));

        const attendanceRecords = classSession
            ? await Attendance.find(
                attendanceForClassSession(classSession, {
                    teacherId,
                    branch,
                    subject,
                    section: sectionNum,
                }),
            )
            : [];

        const presentStudentIds = new Set(
            attendanceRecords.map((rec) => rec.studentId.toString()),
        );

        let combinedData = allStudents.map((student) => {
            const isPresent = presentStudentIds.has(student._id.toString());
            return {
                Name: student.name || 'N/A',
                USN: student.usn || 'N/A',
                Status: isPresent ? 'Present' : 'Absent',
            };
        });

        combinedData.sort((a, b) =>
            a.USN.localeCompare(b.USN, undefined, {
                numeric: true,
                sensitivity: 'base',
            }),
        );

        const finalFormattedData = combinedData.map((item, index) => ({
            Sno: (index + 1).toString().padStart(2, '0'),
            ...item,
        }));

        res.status(200).json(finalFormattedData);
    } catch (err) {
        console.error('Fetch List Error:', err);
        res.status(500).json({ error: 'Failed to fetch list' });
    }
});

// 3. Fetch Previous Attendance History grouped by date
router.get('/history/:teacherId/:branch/:subject/:section/:semester', async (req, res) => {
    try {
        const { teacherId, branch, subject, semester, section } = req.params;

        const sectionNum = parseInt(section, 10);
        const semesterNum = parseInt(semester, 10);

        if (isNaN(sectionNum) || isNaN(semesterNum)) {
            return res.status(400).json({
                error: `Invalid parameters. Received Section: ${section}, Semester: ${semester}`,
            });
        }

        const classSessions = await ClassSession.find({
            teacherId,
            branch,
            subject,
            semester: semesterNum,
            section: sectionNum,
        }).sort({ startedAt: -1 });

        const attendanceRecords = await Attendance.find({
            teacherId,
            branch,
            subject,
            semester: semesterNum,
            section: sectionNum,
        }).sort({ date: -1 });

        const recordsBySession = attendanceRecords.reduce((acc, record) => {
            const key = record.classSessionId
                ? record.classSessionId.toString()
                : `legacy-${new Date(record.date).toISOString().split('T')[0]}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                studentName: record.studentName,
                usn: record.usn,
                status: record.status,
                date: record.date,
            });
            return acc;
        }, {});

        const historyArray = classSessions.map((session) => {
            const records = (recordsBySession[session._id.toString()] || []).sort((a, b) =>
                a.usn.localeCompare(b.usn, undefined, { numeric: true }),
            );
            return {
                date: session.startedAt,
                sessionId: session._id,
                records,
                count: records.length,
            };
        });

        Object.entries(recordsBySession)
            .filter(([key]) => key.startsWith('legacy-'))
            .forEach(([key, records]) => {
                historyArray.push({
                    date: key.replace('legacy-', ''),
                    sessionId: null,
                    records: records.sort((a, b) =>
                        a.usn.localeCompare(b.usn, undefined, { numeric: true }),
                    ),
                    count: records.length,
                });
            });

        historyArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(historyArray);
    } catch (err) {
        console.error('Fetch History Error:', err);
        res.status(500).json({ error: 'Failed to fetch attendance history' });
    }
});

// 4. Fetch Student Attendance History grouped by subject with percentage
router.get('/student/attendance/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get student details
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const classSessions = await ClassSession.find({
            branch: student.branch,
            section: student.section,
        }).sort({ startedAt: -1 });

        if (classSessions.length === 0) {
            return res.status(200).json({ attendance: [] });
        }

        const attendanceRecords = await Attendance.find({
            studentId,
        });

        const groupedBySubject = classSessions.reduce((acc, session) => {
            const key = `${session.subject}`;
            if (!acc[key]) {
                acc[key] = {
                    subject: session.subject,
                    section: session.section,
                    semester: session.semester,
                    totalSessions: 0,
                    attendedSessions: 0,
                };
            }
            acc[key].totalSessions += 1;

            const { start, end } = classSessionWindow(session.startedAt);
            const attended = attendanceRecords.some((record) => {
                if (record.subject !== session.subject) {
                    return false;
                }
                if (record.classSessionId?.toString() === session._id.toString()) {
                    return true;
                }
                const markedAt = new Date(record.date).getTime();
                return markedAt >= start.getTime() && markedAt < end.getTime();
            });

            if (attended) {
                acc[key].attendedSessions += 1;
            }

            return acc;
        }, {});

        // Calculate percentage for each subject
        const attendanceArray = Object.values(groupedBySubject).map((subject) => ({
            subject: subject.subject,
            section: subject.section,
            semester: subject.semester,
            attended: subject.attendedSessions,
            total: subject.totalSessions,
            percentage: subject.totalSessions > 0 ? (subject.attendedSessions / subject.totalSessions) * 100 : 0,
        }));

        // Sort by subject name
        attendanceArray.sort((a, b) => a.subject.localeCompare(b.subject));

        res.status(200).json({ attendance: attendanceArray });
    } catch (err) {
        console.error('Fetch Student Attendance Error:', err);
        res.status(500).json({ error: 'Failed to fetch student attendance' });
    }
});

export default router;
