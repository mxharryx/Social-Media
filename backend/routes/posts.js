const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Route: POST /api/posts
// Description: Create a new post
router.post('/', async(req,res) => {
    const { content, userId } = req.body;

    try{
        // create the new post
        const newPost = new Post({
            content,
            user: userId,
            caption,
            imageURL,
            likes: [],
            comments: [],
        });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully'});
    }
    catch (error){
        res.status(500).json({ message: 'An error occurred while creating the post' });
    }
});

// Route: GET /api/posts
// Description: Fetch all posts
router.get('/', async(req,res)=>{
    try{
        //fetch all posts from db
        const allPosts = await Post.find().sort({createdAt: -1}); //Sort by createdAt in descending order (newest first)

        res.status(200).json(allPosts);
        }catch(err){
            res.status(500).json({message: 'An error occurred'});
        }
});

// Route: GET /api/posts/:postId
// Description: Fetch a single post by ID
router.get('/:postId', async (req,res) => {
    const postId= req.params.postId;

    try{
        //Find post by id in db
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }

        res.status(200).json(post);
        }catch(err){
            res.status(500).json({message:'An error occurred'});
    }
});

// Route: PUT /api/posts/:postId
// Description: Update a post
router.put('/:postId', async(req,res)=>{
    const postId = req.params.postId;
    const { content, caption, imageURL} = req.body;

    try{
        //Find post by id in db
        const post = await Post.findById(postId);
        
        if(!post){
            return res.status(404).json({ message :'Post Not Found'}) ;
        }

        //Update post fields
        post.content = content;
        post.caption = caption;
        post.imageURL = imageURL;

        //save
        await post.save();

        res.status(200).json({ message: 'Post updated successfully'});
        } catch(error){
            res.status(500).json({ message:'An error occurred'});
        }
});

// Route: DELETE /api/posts/:postId
// Description: Delete a post
router.delete('/:postId',async(req,res)=>{
    const postId = req.params.postId;

    try{
        //find post by id in db
        const post=await  Post.findById(postId);

        if(!post){
            return res.status(404).json({'Message':'Post not found.' });
        }

        //remove post
        await post.remove();

        res.status(200).json({message:'Post deleted'});
    } catch (error){
        res.status(500).json({message: 'An error occurred'});
    }
});

// Route: PUT /api/posts/:postId/like
// Description: Like a post
router.post('/:postId/like', async(req,res)=>{
    const postId = req.params.postId;
    const { userId } = req.body;

    try{
        //Find post by id
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }

        //Check if the user has already liked the post
        if(post.likes.includes(userId)) {
            return res.status(400).json({message:'You have already liked this post'});
        }

        //add user's id to likes array
        post.likes.push(userId);

        //save
        await post.save();

        res.status(200).json({message: 'Post liked successfully'});
    }catch (error){
        res.status(500).json({message: 'An error occurred'});
    }
});

// Route: POST /api/posts/:postId/comment
// Description: Comment on a post
router.post('/:postId/comments/',async(req,res) => {
    const postId = req.params.postId;
    const { userId, text } = req.body;

    try{
        //Find post by id in db
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }

        //create new comment object
        const newComment = {
            user: userId,
            text,
        };

        //Add comment to comment array
        post.comments.push(newComment);

        //Save
        await post.save();

        res.status(200).json({message: 'Comment added successfully'});
    }catch (error){
            res.status(500).json({message: 'An error occurred'});
    } 
});

// Route: GET /api/posts/user/:userId
// Description: Fetch posts by a specific user
router.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try{
        //fetch all posts by a specific user
        const userPosts = await Post.find({ user: userId }).sort({ createdAt: -1});

        res.status(200).json(userPosts);
    }catch (error){
            res.status(500).json({message: 'An error occurred'});
    }
});

// Route: GET /api/posts
// Description: Fetch all posts with pagination
router.get('/', async(req, res)=>{
    const { page =1, perPage=10 } = req.query;
    const pageNum = parseInt(page);
    const perPageNum = parseInt(perPage);

    try{
        if(pageNum<=0 || perPageNum<=0){
            return res.status(400).json({ message:'Invalid page number'})
        }
        
        //Calculate skip value based on the current page
        const skip = (pageNum - 1)* perPageNum;

        //Fetch posts from db
        const allPosts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPageNum);

        res.status(200).json(allPosts);
    }catch (error){
        res.status(500).json({message:'An error occurred'});
    }
});