import axios from 'axios';

const token = localStorage.getItem('token'); 

const axiosInstance = axios.create({
  baseURL: 'https://lib-hack-backend-production.up.railway.app',
  timeout: 30000,
  headers: {
    'Authorization': `${token}`
  },
});

export const updateAxiosToken = (newToken) => {
  axiosInstance.defaults.headers['Authorization'] = `${newToken}`;
};

export default axiosInstance