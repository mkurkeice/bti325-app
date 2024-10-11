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

export function initialize() {
    const getAllPosts = new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, postData) => {
            if (err) throw err;
            console.log(data);
            posts = JSON.parse(data)      
        });
    })

    const getCategories = new Promise((resolve, reject) => {
        fs.readFile('./data/categories.json', 'utf8', (err, categoryData) => {
            if (err) throw err;
            console.log(data);
            categories = JSON.parse(data);
        });
    })

    return new Promise((resolve, reject) => {
        Promise.all([promise1, promise2]).then(() => {
            resolve()
        }).catch(err => {
            reject(err)
        });
    });
}

export function getAllPosts(){
    return new Promise((resolve, reject) => {
        if(posts.length === 0){
            reject('no results returned')
        }
        resolve(posts);
    });
}

export function getPublishedPosts(){
    return new Promise((resolve,  reject) =>{
        const publishedPosts = posts.filter(post => post.published === true);
        if (publishedPosts.length === 0) {
            reject('no results returned');
        }
        resolve(publishedPosts);
    });
}

export function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0){
            reject('no results returned');
        }
        resolve(categories);
    });
}