const mongoose = require('mongoose');

const postSchema = new Schema({
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    imageURL: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
    },
    ],
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
