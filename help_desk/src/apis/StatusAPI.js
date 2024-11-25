// src/api/statusService.js
import axios from 'axios';

export const fetchStatuses = async (token) => {
    try {
        const response = await axios.get('http://localhost:8080/api/status', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error; // Rethrow the error to handle it in the component
    }
};