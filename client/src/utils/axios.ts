import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://us-central1-home-search-244507.cloudfunctions.net/api',
  withCredentials: true,
});

export default axios;
