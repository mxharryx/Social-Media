const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String }, // URL or file path of the media (e.g., image or video)
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
    commenter: { type: String, required: true }, // Name of the commenter
    content: { type: String, required: true }, // Comment content
    date: { type: Date, default: Date.now } // Date of the comment
}],
date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
