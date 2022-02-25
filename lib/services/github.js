import axios from 'axios';
export const fetchReposFromGithub = async query =>
    axios.get(
        `https://api.github.com/search/repositories?q=${query}&per_page=2`
    );
