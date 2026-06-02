import express from 'express';
import axios from 'axios';

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

router.post('/', async (req, res) => {
    try {
        const { message, patientId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`[Chat] Forwarding to AI service: ${message}`);

        // Call Python AI Service
        // The Python service accepts form data: text, patient_id
        const formData = new URLSearchParams();
        formData.append('text', message);
        if (patientId) formData.append('patient_id', patientId);

        const aiResponse = await axios.post(`${AI_SERVICE_URL}/answer`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        res.json(aiResponse.data);
    } catch (error) {
        console.error('[Chat] Error communicating with AI service:', error.message);
        if (error.response) {
            console.error('[Chat] AI Service Response:', error.response.data);
        }
        res.status(502).json({
            error: 'Failed to get response from AI service',
            details: error.message
        });
    }
});

export default router;
