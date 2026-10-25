import express from 'express';
import qrcode from 'qrcode';
import crypto from 'crypto';
import { Session } from '../models/Session.js';
import { getOrCreateClassSession } from '../utils/classSession.js';

const router = express.Router();

router.get('/qr', async (req, res) => {
    try {
        const { teacherId, branch, section, subject: encodedSubject, semester } = req.query;
        const subject = decodeURIComponent(encodedSubject);

        if (!teacherId || !section || !subject || !branch || !semester) {
            return res.status(400).send('Missing teacherId, branch, section, semester or subject');
        }

        const passkey = crypto.randomBytes(16).toString('hex');

        // UPDATED: Added semester into the pipe-separated payload
        // This allows the QRScanner to extract it using .split("|")
        const complexPayload = `${branch}|${subject}|${section}|${passkey}|${semester}|${Date.now()}`;

        const classSession = await getOrCreateClassSession({
            teacherId,
            branch,
            subject,
            section,
            semester,
        });

        await Session.create({
            passkey,
            teacherId,
            subject,
            section: Number(section), // Ensure it's a number for DB consistency
            semester: Number(semester), // Ensure it's a number for DB consistency
            branch,
            classSessionId: classSession._id,
            expiresAt: new Date(Date.now() + 60 * 1000), // 1 minute QR expiry
        });

        res.setHeader('Content-Type', 'image/png');

        await qrcode.toFileStream(res, complexPayload, {
            errorCorrectionLevel: 'H',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });

        console.log(`Successfully generated QR for: ${teacherId} - ${subject} (Sem: ${semester})`);
    } catch (err) {
        console.error('Internal Server Error Detail:', err);
        res.status(500).send(err.message);
    }
});

export default router;
