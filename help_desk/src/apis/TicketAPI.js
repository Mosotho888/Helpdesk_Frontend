
import axios from 'axios';

export const fetchTickets = async (token) => {
    try {
        const response = await axios.get('http://localhost:8080/api/tickets', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error; // Rethrow the error to handle it in the component
    }
};