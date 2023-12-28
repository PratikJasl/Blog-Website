const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: String, 
    author_id: String
},{
    timestamps: true //to know when a post is created.
});

const postModel = mongoose.model('postData', postSchema);

module.exports = postModel;