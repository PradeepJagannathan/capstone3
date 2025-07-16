// Middleware to check the API Key
require('dotenv').config(); // Load environment variables from .env file

function checkApiKey(req, res, next) {
    const apiKeyHeader = req.headers['x-api-key'];
    // get the key from environment variable or hardcoded for simplicity
    // In production, you should use environment variables for sensitive data
    const apiKey = process.env.API_KEY;

    if (!apiKeyHeader){
        res.status(401).send("API Key is missing");
        return;
    }

    if (apiKeyHeader!== apiKey){
        res.status(403).send("API Key is invalid");
        return;
    }

    next();
};

module.exports = { checkApiKey };