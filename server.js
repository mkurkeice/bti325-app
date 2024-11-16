/*********************************************************************************
*  BTI325 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Manualla Kurkeice__ Student ID: __163009228__ Date: ___11/15/2024___
*
*  Online (Vercel) Link: https://bti325-hb4orti76-manualla-kurkeices-projects.vercel.app
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
const exphbs = require('express-handlebars');
const stripJs = require('strip-js');

cloudinary.config({
    cloud_name: 'ddszqifml',
    api_key: '414579164121834',
    api_secret: 'cjVJ1snC---W_cPsh7IRZyP77nE',
    secure: true
});

app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/,"") : route.replace(/\/(.*)/,""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        }        
    }
}));

app.set('view engine', '.hbs');

const upload = multer(); //no { storage : storage } because not using disk storage

app.set('views', __dirname + '/views');

app.use(express.static('public')); //static middleware to return /css/main.css

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/', (req, res) => { //redirect user to about.html
    res.redirect('/about');    
});

app.get('/blog', async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};
    try{
        // declare empty array to hold "post" objects
        let posts = [];
        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }
        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 
        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;
    }catch(err){
        viewData.message = "no results";
    }
    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get('/blog/:id', async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};
    try{
        // declare empty array to hold "post" objects
        let posts = [];
        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }
        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
    }catch(err){
        viewData.message = "no results";
    }
    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get('/posts', (req, res) => {
    const category = req.query.category;
    const minDate = req.query.minDate;
    if (category) {
        blogService.getPostsByCategory(category)
            .then(data => {
                res.render("posts", {posts: data});
            })
            .catch(err => {
                res.render("posts", {message: "no results"});
            });
    } else if (minDate) {
        blogService.getPostsByMinDate(minDate)
            .then(data => {
                res.render("posts", {posts: data});
            })
            .catch(err => {
                res.render("posts", {message: "no results"});
            });
    } else {
        blogService.getAllPosts()
            .then(data => {
                res.render("posts", {posts: data});
            })
            .catch(err => {
                res.render("posts", {message: "no results"});
            });
    }
});

app.get('/categories', (req, res) => {
    blogService.getCategories()
        .then(data => {
            res.render("categories", {categories: data});
        })
        .catch(err =>{
            res.render("categories", {message: "no results"});
        })
});

app.get('/posts/add', (req, res) => {
    res.render('addPost'); 
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
