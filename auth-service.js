const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
});

let User;

initialize = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://mkurkeice:<db_password>@cluster0.6yvay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        db.on('error', (err) => {
            reject(err); 
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
        } else {
            bcrypt.hash(userData.password, 10)
                .then(hash => {
                    userData.password = hash; // Replace the password with the hashed version
                    let newUser = new User(userData);
                    newUser.save()
                        .then(() => {
                            resolve();
                        }).catch(err => {
                            if (err.code === 11000) {
                                reject("User Name already taken");
                            } else {
                                reject("There was an error creating the user: " + err);
                            }
                        });
                }).catch(err => {
                    reject("There was an error encrypting the password");
            });
        }
    });
}



function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName })
            .then(users => {
                if (users.length === 0) {
                    reject("Unable to find user: " + userData.userName);
                } else {
                    bcrypt.compare(userData.password, users[0].password)
                        .then(result => {
                            if (result === true) {
                                users[0].loginHistory.push({
                                    dateTime: (new Date()).toString(),
                                    userAgent: userData.userAgent
                                });
                                User.updateOne(
                                    { userName: users[0].userName },
                                    { $set: { loginHistory: users[0].loginHistory } }
                                ).then(() => {
                                    resolve(users[0]);
                                }).catch(err => {
                                    reject("There was an error verifying the user: " + err);
                                });
                            } else {
                                reject("Incorrect Password for user: " + userData.userName);
                            }
                        }).catch(err => {
                            reject("Unable to compare passwords: " + err);
                        });
                }
        }).catch(err => {
            reject("Unable to find user: " + userData.userName);
        });
    });
}


module.exports = {
    initialize,
    registerUser,
    checkUser
};