import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://propane-forge-277123.firebaseio.com/'
});

export default instance;