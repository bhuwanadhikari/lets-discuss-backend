const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postText: {type:String, required: true},
    comments: [{
        type: String,
    }],
    likesCount: {type:Number, default: 0}
});

module.exports = mongoose.model('Post', PostSchema);