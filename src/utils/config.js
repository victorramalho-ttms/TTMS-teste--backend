import dotenv from 'dotenv';
dotenv.config();

export default {
    randommerApiUrl: process.env.RANDOMMER_API_URL,
    randommerApiKey: process.env.RANDOMMER_API_KEY
};