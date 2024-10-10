const express = require('express'); //express module
const app = express();

const HTTP_PORT = process.env.PORT || 8080; //server listening on PORT 8080

app.use(express.static('public')); //static middleware to return /css/main.css

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html')); 
});

app.get('/', (req, res) => { //redirect user to about.html
    res.redirect('/views/about.html');    
});


app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
