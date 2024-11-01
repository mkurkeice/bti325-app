/*********************************************************************************
*  BTI325 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Manualla Kurkeice__ Student ID: __163009228__ Date: ___10/11/2024___
*
*  Online (Vercel) Link: https://bti325-ozucq2an4-manualla-kurkeices-projects.vercel.app
*
********************************************************************************/ 


const express = require('express'); //express module
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 8080; //server listening on PORT 8080
let blogService = require('./blog-service') //require blog-service.js modulef
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: 'ddszqifml',
    api_key: '414579164121834',
    api_secret: 'cjVJ1snC---W_cPsh7IRZyP77nE',
    secure: true
});

const upload = multer(); //no { storage : storage } because not using disk storage

app.set('views', __dirname + '/views');

app.use(express.static('public')); //static middleware to return /css/main.css

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html')); 
});

app.get('/', (req, res) => { //redirect user to about.html
    res.redirect('/about');    
});

app.get('/blog', (req, res) => {
    blogService.getPublishedPosts()
        .then(publishedPosts => {
            res.json(publishedPosts); 
        })
        .catch(err =>{
            res.send({message: err});
        })
});

app.get('/posts', (req, res) => {
    const category = req.query.category;
    const minDate = req.query.minDate;
    if (category) {
        blogService.getPostsByCategory(category)
            .then(posts => {
                res.json(posts);
            })
            .catch(err => {
                res.status(404).send({ message: `Error retrieving posts by category: ${err}` });
            });
    } else if (minDate) {
        blogService.getPostsByMinDate(minDate)
            .then(posts => {
                res.json(posts);
            })
            .catch(err => {
                res.status(404).send({ message: `Error retrieving posts by minimum date: ${err}` });
            });
    }  else {
        blogService.getAllPosts()
            .then(posts => {
                res.json(posts);
            })
            .catch(err => {
                res.status(404).send({ message: `Error retrieving all posts: ${err}` });
            });
    }
});

app.get('/categories', (req, res) => {
    blogService.getCategories()
        .then(categories => {
            res.json(categories);
        })
        .catch(err =>{
            res.send({message: err});
        })
});

app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/addPost.html')); 
})

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/404.html')); // create a 404.html file
});

app.post('/posts/add', upload.single('featureImage'), (req, res)=> {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;    
        // TODO: Process the req.body and add it as a new Blog Post 
        // before redirecting to /posts        
        blogService.addPost(req.body)
            .then(() => {
                res.redirect('/posts'); //redirect to posts
            })
            .catch((err) =>{
                res.status(500).send({message: `Error adding post: ${err}`}); //if addpost fails
            })        
    }).catch((err) => {
        res.status(500).send({message: `Image upload failed: ${err}`}); //if image upload fails
    });    
})

blogService.initialize() //server starts if .json files successfully parse
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`); //initialization successful, server starts
        });
    })
    .catch(err => {    
        console.error(`Failed to initialize data: ${err}`); //log error, server does not start
    });
