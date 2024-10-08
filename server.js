const express = require('express');
const path = require("path");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/about', (req, res) => {
    res.redirect('/views/about.html');
});
  

app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
