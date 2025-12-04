// Simple craco config for testing
const path = require("path");

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
};
