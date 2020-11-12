const axios = require('axios');
axios.interceptors.response.use(function (response) {
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    return response.data;
});

exports.get  = axios.get;
exports.post  = axios.post;

