/****************************************************************************************************
Author : BHARGAVKUMAR JITENDRABHAI SENJALIYA
Student ID : 151964228
Course: WEB322
MAIL ID :- bjsenjaliya@myseneca.ca
*********************************************************************************************************/
const { Pool } = require('pg');

// Configure PostgreSQL connection using Neon.tech credentials
const pool = new Pool({
    user: 'neondb_owner',             
    host: 'ep-holy-feather-a5uh8qd7.us-east-2.aws.neon.tech', 
    database: 'neondb',               
    password: 'Z8fqYV9wEosg',         
    port: 5432,                       
    ssl: { rejectUnauthorized: false } 
});

// Function to activate the service
function initialize() {
    return Promise.resolve("Database service initialized");
}

//To add a new article
function addArticle(articleData) {
    const { title, content, author, published, category_id, articleDate, featureImage } = articleData;

    return pool.query(
        'INSERT INTO articles (title, content, author, published, category_id, article_date, featureImage) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [title, content, author, published, category_id, articleDate, featureImage]
    )
    .then(() => Promise.resolve("Article added successfully"))
    .catch(err => Promise.reject("Unable to add article: " + err.message));
}

//To get all articles
function getAllArticles() {
    return pool.query('SELECT * FROM articles')
        .then(res => res.rows)
        .catch(err => Promise.reject("No articles found"));
}

//To get all categories
function getCategories() {
    return pool.query('SELECT * FROM categories')
        .then(res => res.rows)
        .catch(err => Promise.reject("No categories found"));
}

//To get articles by category
function getArticlesByCategory(category) {
    return pool.query(
        'SELECT * FROM articles WHERE category_id = (SELECT id FROM categories WHERE LOWER(name) = $1)',
        [category.toLowerCase()]
    )
    .then(res => res.rows)
    .catch(err => Promise.reject(`No articles found for category: ${category}`));
}

//To get articles by minimum date
function getArticlesByMinDate(minDateStr) {
    return pool.query('SELECT * FROM articles WHERE article_date >= $1', [minDateStr])
        .then(res => res.rows)
        .catch(err => Promise.reject("No results returned: " + err.message));
}

//To get an article by ID
function getArticleById(id) {
    return pool.query('SELECT * FROM articles WHERE id = $1', [id])
        .then((res) => res.rows[0])
        .catch((err) => Promise.reject("Unable to fetch article: " + err.message));
}


function updateArticle(id, updatedData) {
    const { title, content, author, published, category_id, articleDate } = updatedData;

    return pool.query(
        'UPDATE articles SET title = $1, content = $2, author = $3, published = $4, category_id = $5, article_date = $6 WHERE id = $7',
        [title, content, author, published, category_id, articleDate, id]
    )
    .then(() => Promise.resolve("Article updated successfully"))
    .catch(err => Promise.reject("Unable to update article: " + err.message));
}

function deleteArticle(id) {
    return pool.query('DELETE FROM articles WHERE id = $1', [id])
        .then(() => Promise.resolve("Article deleted successfully"))
        .catch(err => Promise.reject("Unable to delete article: " + err.message));
}

// Module exports
// Export all functions
module.exports = {
    initialize,
    getAllArticles,
    getCategories,
    getArticlesByCategory,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleById,
    getArticlesByMinDate
};
