import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://randommer.io/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': '97a73343a39c4d9faa9b466df9078d42'
    }
});

export default axiosInstance;
