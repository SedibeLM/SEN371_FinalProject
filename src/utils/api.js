import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export async function loginUser(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('cl_auth_user', JSON.stringify(response.data));
    }
    return response.data;
}

export async function registerUser(name, email) {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email });
    if (response.data.token) {
        localStorage.setItem('cl_auth_user', JSON.stringify(response.data));
    }
    return response.data;
}

export async function getTopics() {
    const response = await axios.get(`${API_URL}/topics`);
    return response.data;
}
