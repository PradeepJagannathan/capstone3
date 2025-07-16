const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config(); // Load environment variables from .env file
const port = process.env.PORT || 4000;

const da = require("./data-access");

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// Middleware to check the API Key

function checkAPIKey(req, res, next) {
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


app.get("/customers", checkAPIKey, async (req, res) => {
     const [cust, err] = await da.getCustomers();
     if(cust){
         res.send(cust);
     }else{
         res.status(500);
         res.send(err);
     }   
});

app.get("/reset", checkAPIKey, async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }   
});

app.post('/customers', checkAPIKey,async (req, res) => {
    const newCustomer = req.body;
    if (newCustomer === null || req.body == {}) {
        res.status(400);
        res.send("missing request body");
    } else {
        // return array format [status, id, errMessage]
        const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status === "success") {
            res.status(201);
            let response = { ...newCustomer };
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.get("/customers/:id", checkAPIKey,async (req, res) => {
     const id = req.params.id;
     // return array [customer, errMessage]
     const [cust, err] = await da.getCustomerById(id);
     if(cust){
         res.send(cust);
     }else{
         res.status(404);
         res.send(err);
     }   
});

app.put('/customers/:id', checkAPIKey,async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null || req.body == {}) {
        res.status(400);
        res.send("missing request body");
    } else {
        delete updatedCustomer._id;
        // return array format [message, errMessage]
        const [message, errMessage] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.delete("/customers/:id", checkAPIKey,async (req, res) => {
    const id = req.params.id;
    // return array [message, errMessage]
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
});
