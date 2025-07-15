const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

const da = require("./data-access");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/customers", async (req, res) => {
     const [cust, err] = await da.getCustomers();
     if(cust){
         res.send(cust);
     }else{
         res.status(500);
         res.send(err);
     }   
});

app.get("/reset", async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }   
});