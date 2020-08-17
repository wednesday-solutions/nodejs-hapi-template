const dotenv = require('dotenv');

module.exports = () => {
    if (process.env.ENV === 'development') {
        dotenv.config({ path: '.env.dev' });
    } else {
        dotenv.config();
    }
};
