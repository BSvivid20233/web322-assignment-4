const contentService = require('./content-service');
const express = require('express');
const path = require('path');
const app = express();
const port = 3243;
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dfbgxsrkv',
    api_key: '278244932557217',
    api_secret: '2qfdSAVVTr4U7eJwN-obuVZBwFs',
    secure: true
});

//setup for file upload (in-memory storage)
const upload = multer(); //files are stored in memory, No memory disk storage

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize content service before setting up routes
contentService.initialize()
    .then(() => {
        console.log("Content service initialized");

        // Path for Home ('/')
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        // Path for About ('/about')
        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        // Path for fetching all articles ('/articles')
        app.get('/articles', (req, res) => {
            contentService.getAllArticles()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    res.json({ message: err });
                });
        });

        // Path for fetching all categories ('/categories')
        app.get('/categories', (req, res) => {
            contentService.getCategories()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    res.json({ message: err });
                });
        });

        //Assig :- 3 content

        // Path for "Add Article" page
        app.get('/articles/add', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
        });

        // Post path to handle form submissions for adding a new article
        app.post('/articles/add', upload.single("featureImage"), (req, res) => {
             // Check if a file was uploaded
                 if (req.file) {
                 //To add image to Cloudinary
                      const streamUpload = (req) => {
                        return new Promise((resolve, reject) => {
                       // Create a Cloudinary upload stream
                         let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                               if (result) resolve(result);
                                  else reject(error);
                      },  
                );
                
                   streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

         // Asynchronous function to upload the image
          async function upload(req) {
            let result = await streamUpload(req);
            return result;
             }

            // Upload the image and handle the result
              upload(req)
            .then((uploaded) => {
                // Process the article with the uploaded image URL
                processArticle(uploaded.url);
            })
            .catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
          } else {
                  processArticle("");
          }

    // Function to process the article data and save it
    function processArticle(imageUrl) {
        // Assign the uploaded image URL (or empty string) to the featureImage property
        req.body.featureImage = imageUrl;

        // Add the article to content service
        contentService.addArticle(req.body)
            .then(() => res.redirect('/articles'))
            .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
          }
    });

    // Updated route for querying articles with optional filters
app.get('/articles', (req, res) => {
    // Check if 'category' filter is provided
    if (req.query.category) {
        contentService.getArticlesByCategory(req.query.category)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: err }));
    }
    // Check if 'minDate' filter is provided
    else if (req.query.minDate) {
        contentService.getArticlesByMinDate(req.query.minDate)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: err }));
    }
    // No filters, return all articles
    else {
        contentService.getAllArticles()
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: err }));
    }
});

// Path to get a single article by ID
app.get('/article/:id', (req, res) => {
    const articleId = req.params.id;

    contentService.getArticleById(articleId)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(404).json({ message: `Article with ID ${articleId} not found`, error: err });
        });
});


        // Start the server
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    })
    .catch((err) => {
        console.error(`Failed to initialize content service: ${err}`);
    });
