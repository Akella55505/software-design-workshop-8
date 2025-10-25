import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env["VITE_API_BASE_URL"] as string,
	headers: {
		"Content-Type": "application/json",
	},
});

// TODO: implement login
const token = import.meta.env["VITE_API_AUTH_TOKEN"] as string;
if (token) {
	apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

apiClient.interceptors.response.use(
	(response) => response,
	(error: Error) => {
		console.error(`API error ${error.name}: ${error.message}`);
		return Promise.reject(error);
	}
);

export default apiClient;