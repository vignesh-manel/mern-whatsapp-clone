import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.44.187:9000'
});

export default instance;
