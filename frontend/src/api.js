import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 60000, // 60 seconds
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const uploadCodeFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/review', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
