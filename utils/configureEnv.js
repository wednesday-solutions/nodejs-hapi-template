const dotenv = require('dotenv');

module.exports = () => {
    if (process.env.ENV === 'production') {
        dotenv.config();
    } else {
        dotenv.config({ path: `.env.${process.env.ENV}` });
    }
};
