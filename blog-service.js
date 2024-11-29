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
        sequelize.sync().then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database")
        })
    });
}

function getAllPosts(){
    return new Promise((resolve, reject) => {
        Post.findAll().then((data) => {
            resolve(data);
        }).catch((err) =>{
            reject("no results returned");
        })
    });
}

function getPublishedPosts(){
    return new Promise((resolve, reject) => { 
        Post.findAll({ 
            where: { 
                published: true 
            } 
        }).then((data) => { 
            resolve(data);         
        }).catch((err) => { 
            reject("no results returned"); 
        }); 
    });
}

function getCategories() {
    return new Promise((resolve, reject) => { 
        Category.findAll().then((data) => { 
            resolve(data); 
        }).catch((err) => { 
            reject("no results returned"); 
        }); 
    });
}

function addPost(postData){
    return new Promise((resolve, reject) => {         
        postData.published = (postData.published) ? true : false; 
        for (let prop in postData) { //replace blank values with null 
            if (postData[prop] === "") { 
                postData[prop] = null; 
            } 
        } 
        postData.postDate = new Date(); //set postDate to current date 
        Post.create(postData).then(() => { //new post 
            resolve(); 
        }).catch((err) => { 
            reject("unable to create post"); 
        }); 
    });
}

function getPostsByCategory(category) {
    return new Promise((resolve, reject) => { 
        Post.findAll({ 
            where: { 
                category: category 
            } 
        }).then((data) => { 
            resolve(data); 
        }).catch((err) => { 
            reject("no results returned");
        })
    });
}

function getPostsByMinDate(minDateStr) { 
    return new Promise((resolve, reject) => { 
        const { gte } = Sequelize.Op; 
        Post.findAll({ 
            where: { 
                postDate: { 
                    [gte]: new Date(minDateStr) 
                } 
            } 
        }).then((data) => { 
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
        }).then((data) => { 
            if (data.length > 0) { 
                resolve(data[0]); 
            } else { reject("no results returned"); } 
        }).catch((err) => { 
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
        }).then((data) => { 
            resolve(data); 
        }).catch((err) => { 
            reject("no results returned"); 
        }); 
    });
}

const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
});

const Category = sequelize.define('Category', {
    category: Sequelize.STRING,    
});

Post.belongsTo(Category, {foreignKey: 'category'});

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