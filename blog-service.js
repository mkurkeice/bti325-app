const Sequelize = require('sequelize');

var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'ClcDSYyI3tE0', {
    host: 'ep-dawn-butterfly-a5afy8z7.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


function initialize() {
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getAllPosts(){
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getPublishedPosts(){
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        reject();
    });
}

function addPost(postData){
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getPostById(id) {
    return new Promise((resolve, reject) => {
        reject();
    });
}

function getPublishedPostsByCategory(category){
    return new Promise((resolve, reject) => {
        reject();
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
    getPostById,
    getPublishedPostsByCategory
};