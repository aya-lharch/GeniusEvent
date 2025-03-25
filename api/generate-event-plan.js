import OpenAI from 'openai'; // Correct import for the new version
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { budgetRange, colorScheme, entertainment, eventType, foodPreference, guestCount, theme } = req.body;

        const prompt = `
        You are an expert event planner. Based on the following details, create:
        - A creative event name
        - A fitting theme with decor ideas
        - A detailed checklist
        - A detailed budget breakdown

        Details:
        Event Type: ${eventType}
        Budget Range: $${budgetRange}
        Guest Count: ${guestCount} people
        Theme Preference: ${theme}
        Color Scheme: ${colorScheme}
        Entertainment Choice: ${entertainment}
        Food Preference: ${foodPreference}

        Format your response with clear headers and bullet points.
        `;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 250
            });

            const eventPlan = response.choices[0].message.content;
            res.status(200).json({ eventPlan });
        } catch (error) {
            console.error('Error generating event plan:', error);
            res.status(500).json({ error: 'Failed to generate event plan.' });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

