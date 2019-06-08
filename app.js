const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Post = require('./models/Post');


const app = express();

//body parser middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//database
const db = require('./config/keys').mongoURI;


//connection to database
mongoose
    .connect(db, { useNewUrlParser: true,  })
    .then(() => console.log("Connected to the mongoose"))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

//Homepage
app.get('/', (req, res) => {
    res.json({msg: "Success"});
});

//add posts
app.post('/add-post', (req, res) => {
    const newPost = new Post({
        postText: req.body.postText
    });

    // console.log(newPost);
    newPost.save()
    .then(post => res.json(post))
    .catch(err => console.log(err));

});

//like post
app.post('/like', (req, res) => {
    // console.log(req.body);
    Post.findByIdAndUpdate(req.body.postId, {$inc:{likesCount: 1}})
    .then(post => post._id)
    .then(_id => Post.findById(_id))
    .then(post => res.json(post))
    .catch(err => console.log(err));
});

//comment on post
app.post('/comment', (req, res) => {
    console.log("")
    Post.findByIdAndUpdate(req.body.postId, {$push:{comments: req.body.commentValue}})
    .then(post => post._id)
    .then(_id => Post.findById(_id))
    .then(post => res.json(post))
    .catch(err => console.log(err));
});

//get all post
app.get('/get-all-posts', (req, res) => {
    Post.find()
    .then(allPosts => {
        res.json(allPosts);
    })
    .catch(err => console.log(err));
});



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));

