/* const getAllPosts = () => { 
    return new Promise((resolve) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            resolve(JSON.parse(data)); //parse data to JSON 
        });
    });
}

const getPublishedPosts = () => {
    return getAllPosts()
        .then(posts => posts.filter(post => post.published === true)); //get only published posts
};

const getCategories = () => {
    return new Promise((resolve) => {
        fs.readFile('./data/categories.json', 'utf8', (err, data) => {
            resolve(JSON.parse(data)); 
        });
    });
}; */
const fs = require("fs");

let posts = [];
let categories = [];

function initialize() {
    const getAllPosts = new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, postData) => {
            if (err) throw err;            
            posts = JSON.parse(postData);   
            console.log(posts);  
            resolve();
        });
    })

    const getCategories = new Promise((resolve, reject) => {
        fs.readFile('./data/categories.json', 'utf8', (err, categoryData) => {
            if (err) throw err;            
            categories = JSON.parse(categoryData);
            console.log(categories);
            resolve();            
        });
    })

    return new Promise((resolve, reject) => {
        Promise.all([getAllPosts, getCategories]).then(() => {
            resolve()
        }).catch(err => {
            reject(err)
        });
    });
}

function getAllPosts(){
    return new Promise((resolve, reject) => {
        if(posts.length === 0){
            reject('no results returned')
        }
        resolve(posts);
    });
}

function getPublishedPosts(){
    return new Promise((resolve,  reject) =>{
        const publishedPosts = posts.filter(post => post.published === true);
        if (publishedPosts.length === 0) {
            reject('no results returned');
        }
        resolve(publishedPosts);
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0){
            reject('no results returned');
        }
        resolve(categories);
    });
}

function addPost(postData){
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false; //set status falsse if undefined
        postData.id = posts.length + 1; //length of post array + 1 
        posts.push(postData); //push data into array
        resolve(postData);
    })
}

function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredPosts = post.filter(post => post.category == category); //check category if matched with category param
        if(filteredPosts.length === 0) {
            reject("no results returned.")
        } else {
            resolve(filteredPosts);
        }
    });
}

function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
       const minDate = new Date(minDateStr);
       const filteredPosts = posts.filter(post => new Date(post.postDate) >= minDate); //check if post date is greater than or equal to minDateStr value
       if (filteredPosts.length === 0) {
            reject("no results returned.")
       } else {
            resolve(filteredPosts);
       }
    });
}

function getPostById(id) {
    return new Promise((resolve, reject) => {
        const post = posts.find(post => post.id == id);
        if(post) {
            resolve(post);
        } else {
            reject("no results returned.");
        }
    });
}

module.exports = {
    initialize,
    getAllPosts,
    getPublishedPosts,
    getCategories,
    addPost,
    getPostsByCategory,
    getPostsByMinDate,
    getPostById
};