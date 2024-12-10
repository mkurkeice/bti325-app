/*********************************************************************************
*  BTI325 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Manualla Kurkeice__ Student ID: __163009228__ Date: ___11/15/2024___
*
*  Online (Vercel) Link: https://bti325-rwcl0u6q7-manualla-kurkeices-projects.vercel.app
*
********************************************************************************/ 
//updates made with assignment 4 solution***

const express = require('express'); //express module
const path = require('path');
let blogData = require('./blog-service') //require blog-service.js modulef
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');
const stripJs = require('strip-js');

const app = express();

const HTTP_PORT = process.env.PORT || 8080; //server listening on PORT 8080

module.exports = app;

cloudinary.config({
    cloud_name: 'ddszqifml',
    api_key: '414579164121834',
    api_secret: 'cjVJ1snC---W_cPsh7IRZyP77nE',
    secure: true
});

const upload = multer(); //no { storage : storage } because not using disk storage

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
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }          
    }
}));

app.set('view engine', '.hbs');

app.use(express.static('public')); //static middleware to return /css/main.css

app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/,"") : route.replace(/\/(.*)/,""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.get('/', (req, res) => { 
    res.redirect('/blog');    
});

app.get('/about', (req, res) => { //redirect user to about.html
    res.render('about');
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

app.get('/posts', (req, res) => {
    let queryPromise = null;
    if (req.query.category) {
        queryPromise = blogData.getPostsByCategory(req.query.category);
    } else if (req.query.minDate) {
        queryPromise = blogData.getPostsByMinDate(req.query.minDate);
    } else {
        queryPromise = blogData.getAllPosts()
    }
    queryPromise.then(data => {
        (data.length > 0) ? res.render("posts", {posts: data}) : res.render("posts",{ message: "no results" });
    }).catch(err => {
        res.render("posts", {message: "no results"});
    })
});


app.post('/posts/add', upload.single('featureImage'), (req, res) =>{
    if(req.file){
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
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }

    function processPost(imageUrl){
        req.body.featureImage = imageUrl;

        blogData.addPost(req.body).then(post=>{
            res.redirect("/posts");
        }).catch(err=>{
            res.status(500).send(err);
        })
    }  
});

app.get('/posts/add', (req, res) => {
    blogData.getCategories().then((data)=>{
        res.render("addPost", {categories: data});
     }).catch((err) => {
       // set category list to empty array
       res.render("addPost", {categories: [] });
    });
});

app.get('/posts/delete/:id', (req, res) =>{
    blogData.deletePostById(req.params.id).then(()=>{
        res.redirect("/posts");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Post / Post Not Found");
    });
});


app.get('/post/:id', (req,res)=>{
    blogData.getPostById(req.params.id).then(data=>{
        res.json(data);
    }).catch(err=>{
        res.json({message: err});
    });
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

app.get('/categories', (req, res) => {
    blogData.getCategories().then((data => {
        (data.length > 0) ? res.render("categories", {categories: data}) : res.render("categories",{ message: "no results" });
    })).catch(err => {
        res.render("categories", {message: "no results"});
    });
});


app.get('/categories/add', (req, res) =>{
    res.render('addCategory');
});

app.post('/categories/add', (req, res) => {
    blogData.addCategory(req.body).then(category=>{
        res.redirect("/categories");
    }).catch(err=>{
        res.status(500).send(err.message);
    })
});

app.get('/categories/delete/:id', (req, res) =>{
    blogData.deleteCategoryById(req.params.id).then(()=>{
        res.redirect("/categories");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Category / Category Not Found");
    });
});



app.get((req, res) => {
    res.status(404).render("404"); // render 404.hbs
});

blogData.initialize() //server starts if .json files successfully parse
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`); //initialization successful, server starts
        });
    })
    .catch(err => {    
        console.error(`Failed to initialize data: ${err}`); //log error, server does not start
    });
