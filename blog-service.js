const Sequelize = require('sequelize');
const pg = require('pg');
  
var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'ClcDSYyI3tE0', {
    host: 'ep-dawn-butterfly-a5afy8z7.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true },
    dialectModule: pg,
}); 


var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING,    
});

Post.belongsTo(Category, {foreignKey: 'category'});

function initialize() {    
    return sequelize.sync();
}

function getAllPosts(){
    return new Promise((resolve, reject) => {
        Post.findAll().then(data=>{
            resolve(data);
        }).catch( err =>{
            reject("no results returned");
        });
    });
}

function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

function getPostsByMinDate(minDateStr) {         
    const { gte } = Sequelize.Op;
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                  }
            }
        }).then( data => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

function getPostById(id) { 
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then( data => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

function addPost(postData){
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false;
        for (var prop in postData) {
            if (postData[prop] === '')
            postData[prop] = null;
        }
        postData.postDate = new Date();
        Post.create(postData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create post");
        });
    });
}

function deletePostById(id) { 
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve();
        }).catch(() => {
            reject("unable to delete post");
        });
    });
}

function getPublishedPosts(){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

function getPublishedPostsByCategory(category){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data=>{
            resolve(data);
        }).catch( err =>{
            reject("no results returned")
        });
    });
}

function addCategory(categoryData) { 
    return new Promise((resolve, reject) => {
        for (var prop in categoryData) {
            if (categoryData[prop] === '')
            categoryData[prop] = null;
        }
        Category.create(categoryData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create category");
        });
    });
}

function deleteCategoryById(id) { 
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve();
        }).catch(() => {
            reject("unable to delete category");
        });
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
    getPublishedPostsByCategory,
    addCategory,
    deleteCategoryById,
    deletePostById, 
    sequelize
};