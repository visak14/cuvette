
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://cuvette-backend-eh4r.onrender.com/api', 
});

export default axiosInstance;
