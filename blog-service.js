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
