import axios from 'axios';

const apiClient = axios.create({
	baseURL: process.env['VITE_API_BASE_URL'],
	headers: {
		'Content-Type': 'application/json',
	}
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: Error) => {
		console.error(`API error ${error.name}: ${error.message}`);
		return Promise.reject(error);
	}
);

export default apiClient;