const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const bodyParser = require('body-parser');

const Post = require('./models/Post');

const app = express();


app.use(cors())

//body parser middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//database
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true,  })
    .then(() => console.log("Connected to the mongoose"))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);


//starting point
app.get('/', (req, res) => {
    res.json({msg: "Success"})
});

//add posts
app.post('/add-post', (req, res) => {
    const newPost = new Post({
        postText: req.body.postText
    });

    // console.log(newPost);
    newPost.save()
    .then(post => {...post, message: "Your post has been added"})
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json(err));

});

//clap post
app.post('/clap', (req, res) => {
    // console.log(req.body);
    Post.findByIdAndUpdate(req.body.postId, {$inc:{clapsCount: 1}})
    .then(post => post._id)
    .then(_id => Post.findById(_id))
    .then(post => {...post, message: "Your clap has been submitted"})
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json(err));
});

//comment on post
app.post('/comment', (req, res) => {
    console.log("")
    Post.findByIdAndUpdate(req.body.postId, {$push:{comments: req.body.commentValue}})
    .then(post => post._id)
    .then(_id => Post.findById(_id))
    .then(post => {...post, message: "Your comment has been submitted"})
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json(err));
});

//get all post
app.get('/get-all-posts', (req, res) => {
    Post.find()
    .then(allPosts => {
        res.status(200).json(allPosts);
    })
    .catch(err => res.status(400).json(err));
});



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));

