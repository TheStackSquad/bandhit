import axios from 'axios';

export const deleteUserData = async () => {
    try {
        const response = await axios.post('/api/dataDelete'); // Adjust the API endpoint if needed
        return response.data; // Or handle the response as needed
    } catch (error) {
        console.error('Error calling data deletion API:', error);
        throw error; // Re-throw the error for the component to handle
    }
};