const express = require('express'); //express module
const path = require('path');
const app = express();
let blogService = require('./blog-service') //require blog-service.js modulef

const HTTP_PORT = process.env.PORT || 8080; //server listening on PORT 8080

app.use(express.static('public')); //static middleware to return /css/main.css

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html')); 
});

app.get('/', (req, res) => { //redirect user to about.html
    res.redirect('/about');    
});

app.get('/blog', (req, res) => {
    res.send('TODO: get all posts who have published==true');
});

app.get('/posts', (req, res) => {
    res.send('TODO: get all posts');
});

app.get('/categories', (req, res) => {
    res.send('TODO: get all categories');
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/404.html')); // create a 404.html file
});


app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
