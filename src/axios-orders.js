import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-react-app-b1db1.firebaseio.com/'
});

export default instance;