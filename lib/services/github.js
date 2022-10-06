import axios from 'axios';

const fetchReposFromGithub = async (query) =>
  axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=2`);

export default fetchReposFromGithub;
