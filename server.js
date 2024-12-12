const contentService = require('./content-service');
const express = require('express');
const path = require('path');
const app = express();
const port = 3243;
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// configure views directory
app.set('views', path.join(__dirname, 'views'));

// Cloudinary configuration for img upload
cloudinary.config({
    cloud_name: 'dibrnuuwn',
    api_key: '816567135627426',
    api_secret: 'mtl9EjbZE9nXbey0WZFHD_tO9XU',
    secure: true
});

// Configure multer for in-memory file upload
const upload = multer();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize content service before setting up routes
contentService.initialize()
    .then(() => {
        console.log("Content service initialized");

        // Route for About ('/about')
        app.get('/about', (req, res) => {
            res.render('about', { title: "About Me" });
        });

        // Route for Home ('/')
        app.get('/', (req, res) => {
            res.render('about', { title: "About Me" });
        });

        // Edit the articles: 
        
        app.get('/articles/edit', (req, res) =>
            {res.render('edit', {Title: "edit or delete file"});
            });
    
            app.get('/articles/edit/:id', async (req, res) => {
                try {
                    const article = await contentService.getArticleById(req.params.id);
                    if (!article) {
                        return res.status(404).render('404', { message: "Article Missing." });
                    }
                    res.render('edit', { article: article, title: "Edit Article" });
                } catch (error) {
                    res.status(500).render('error', { message: "Error fetching article." });
                }
            });

        // Path for fetching all articles ('/articles')
        app.get('/articles', (req, res) => {
            if (req.query.category) {
                contentService.getArticlesByCategory(req.query.category)
                    .then((data) => res.render('articles', { articles: data, error: null }))
                    .catch((err) => res.render('articles', { articles: [], error: err }));
            } else if (req.query.minDate) {
                contentService.getArticlesByMinDate(req.query.minDate)
                    .then((data) => res.render('articles', { articles: data, error: null }))
                    .catch((err) => res.render('articles', { articles: [], error: err }));
            } else {
                contentService.getAllArticles()
                    .then((data) => res.render('articles', { articles: data, error: null }))
                    .catch((err) => res.render('articles', { articles: [], error: err }));
            }
        });

        
          // Path for "Add Article" page
          app.get('/articles/add', (req, res) => {
            res.render('addArticle', { title: "Add a New Article" });
        });
        
        // Path for fetching all categories ('/categories')
        app.get('/categories', (req, res) => {
            contentService.getCategories()
                .then((data) => res.render('categories', { categories: data, error: null }))
                .catch((err) => res.render('categories', { categories: [], error: err }));
        });

      

        // Handle the submission of a new article
        app.post('/articles/add', upload.single("featureImage"), (req, res) => {
            if (req.file) {
                const streamUpload = (req) => {
                    return new Promise((resolve, reject) => {
                        let stream = cloudinary.uploader.upload_stream((error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        });
                        streamifier.createReadStream(req.file.buffer).pipe(stream);
                    });
                };

                async function upload(req) {
                    let result = await streamUpload(req);
                    return result;
                }

                upload(req)
                    .then((uploaded) => processArticle(uploaded.url))
                    .catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
            } else {
                processArticle("");
            }

            function processArticle(imageUrl) {
                req.body.featureImage = imageUrl;

                contentService.addArticle(req.body)
                    .then(() => res.redirect('/articles'))
                    .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
            }
        });

        // Path for fetching a specific article by ID
        app.get('/article', (req, res) => {
            const articleId = req.query.id;

            contentService.getArticleById(articleId)
                .then((article) => res.render('articles', { articles: [article], error: null }))
                .catch((err) => res.render('articles', { articles: [], error: "Article not found!" }));
        });

        // Path to display a single article by ID
        app.get('/article/:id', (req, res) => {
            const articleId = req.params.id;
        
            console.log("Article ID Requested: ", articleId); 
        
            contentService.getArticleById(articleId)
                .then((article) => {
                    if (!article.published) {
                        console.log("Article is not published."); 
                        return res.status(404).render('404', { message: "Article not found or not published." });
                    }
                    console.log("Article Found: ", article); 
                    res.render('article', { article });
                })
                .catch((err) => {
                    console.log("Error: ", err); 
                    res.status(404).render('404', { message: "Article not found." });
                });
        });
        
        
        
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

    })
    .catch((err) => {
        console.error(`Failed to initialize content service: ${err}`);
    });
