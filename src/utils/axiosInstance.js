import axios from 'axios';
import config from './config.js'
const axiosInstance = axios.create({
    baseURL: config.randommerApiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': config.randommerApiKey
    }
});

export default axiosInstance;
