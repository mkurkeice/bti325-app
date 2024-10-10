const express = require('express'); //express module
const path = require('path');
const app = express();

const HTTP_PORT = process.env.PORT || 8080; //server listening on PORT 8080

app.use(express.static(path.join(__dirname, 'public'))); //static middleware to return /css/main.css

app.get('/about', (req, res) => { //redirect user to about.html
    res.redirect('/views/about.html');
});


app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
