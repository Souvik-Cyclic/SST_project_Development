import axios from 'axios';

const token = localStorage.getItem('token');

export const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
    }
});
