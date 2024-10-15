/****************************************************************************************************
Author : BHARGAVKUMAR JITENDRABHIA SENJALIYA
Student ID : 151964228
Course: WEB322
*********************************************************************************************************/

const fs = require('fs');
const path = require('path');

let articles = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        // Reads the data from the articles.json
        fs.readFile(path.join(__dirname, 'data', 'articles.json'), 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read articles.json");
                return;
            }

            try {
                articles = JSON.parse(data); // Parse the JSON into the articles array
            } catch (parseErr) {
                reject("Error parsing articles.json");
                return;
            }

            // Reads the data  from the categories.json

            fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read categories.json");
                    return;
                }

                try {
                    categories = JSON.parse(data); // Parse the JSON into the categories array
                } catch (parseErr) {
                    reject("Error parsing categories.json");
                    return;
                }

                // This reads and parsed Both files successfully
                resolve("Data successfully initialized");
            });
        });
    });
}

function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No articles found");
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
}

module.exports = {
    initialize,
    getAllArticles,
    getCategories
};
