/****************************************************************************************************
Author : BHARGAVKUMAR JITENDRABHAI SENJALIYA
Student ID : 151964228
Course: WEB322
*********************************************************************************************************/

const fs = require('fs');
const path = require('path');

let articles = [];
let categories = [];

// Function to activate the service
function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'articles.json'), 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read articles.json");
                return;
            }

            try {
                articles = JSON.parse(data);
            } catch (parseErr) {
                reject("Error parsing articles.json");
                return;
            }

            fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read categories.json");
                    return;
                }

                try {
                    categories = JSON.parse(data);
                } catch (parseErr) {
                    reject("Error parsing categories.json");
                    return;
                }

                resolve("Data successfully initialized");
            });
        });
    });
}

//To add a new article
module.exports.addArticle = (articleData) => {
    return new Promise((resolve, reject) => {
        articleData.published = articleData.published ? true : false;
        articleData.id = articles.length + 1;
        articles.push(articleData);
        resolve(articleData);
    });
};

//To get all articles
function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No articles found");
        }
    });
}

//To get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
}

//To get articles by category
module.exports.getArticlesByCategory = (category) => {
    return new Promise((resolve, reject) => {
        const filteredArticles = articles.filter(article => article.category === category);
        if (filteredArticles.length > 0) {
            resolve(filteredArticles);
        } else {
            reject("No results returned");
        }
    });
};

//To get articles by minimum date
module.exports.getArticlesByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        if (isNaN(minDate)) {
            return reject("Invalid date format");
        }

        const filteredArticles = articles.filter(article => new Date(article.articleDate) >= minDate);
        if (filteredArticles.length > 0) {
            resolve(filteredArticles);
        } else {
            reject("No results returned");
        }
    });
};

//To get an article by ID
module.exports.getArticleById = (id) => {
    return new Promise((resolve, reject) => {
        const foundArticle = articles.find(article => article.id == id);
        if (foundArticle) {
            resolve(foundArticle);
        } else {
            reject("No result returned");
        }
    });
};

// Module exports
module.exports = {
    initialize: initialize,
    getAllArticles: getAllArticles,
    getCategories: getCategories,
    addArticle: module.exports.addArticle,
    getArticlesByCategory: module.exports.getArticlesByCategory,
    getArticlesByMinDate: module.exports.getArticlesByMinDate,
    getArticleById: module.exports.getArticleById
};

