const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto'); //to generate JWT

//Generate a random 32 byte secret key
const generateSecretKey= () => {
    return crypto.randomBytes(32).toString('hex');
};
//Call the fn
const secretKey = generateSecretKey();
console.log('Generated Secret Key: ', secretKey);

// Route: POST /api/users/register
// Description: Register a new user
router.post('/register', async (req,res) => {
    const { username, email, password } = req.body;

    try{
        //check if username or email exists already
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(existingUser){
            return res.status(400).json({ message: 'Username or email already exists'});
        }
        //Hash password before saving it in db
        const hashedPassword = await bcrypt.hash(password, 10);
        //create the new user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        //save user to db
        await newUser.save();

        res.status(201).json({ message:'User Registered Successfully'});
    } catch(error){
        console.error(error);
        res.status(500).json({message: 'An error occurred while registering'});
    }
});

// Route: POST /api/users/login
// Description: Login user
router.post('/login', async(req,res)=> {
    const { username, password } = req.body;

    try{
        //find user by username
        const user = await User.findOne({ username});
        if(!user){
            return res.status(404).json({ message:"User not found" })
        }
        //password matches?
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(401).json({ message: "Invalid credentials"})
        }
        //generate JWT token
        const token = jwt.sign({userID: user._id}, 'secretKey'); 

        res.status(200).json({token});
    }catch (err) {
        res.status(500).json({message: 'An error occurred while logging in'});
    }
});

// Route: GET /api/users/:id
// Description: Get user profile by ID
router.get("/:id", async(req,res)=>{
    const userId=req.params.id;

    try{
        //Find the user by ID
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        //Exclude sensitive info
        const UserProfile = {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
        };
        
        res.status(200).json(UserProfile);
    }catch (error){
        res.status(500).json({message: 'An error occurred'});
    }
});

// Route: PUT /api/users/:id/follow
// Description: Follow a user
router.put('/:id/follow',async(req,res)=>{
    const userId=req.params.id;
    const {userIdToFollow} = req.body;

    try{
        //Check if both users exists
        const currentUser = await User.findById(userId);
        const userToFollow = await User.findById(userIdToFollow);

        if (!currentUser || !userToFollow){
            return res.status(404).json({message: 'User(s) not found'});
        }
        //Add the userToFollow's Id to currentUser's followers array
        currentUser.followers.push(userIdToFollow);
        await currentUser.save();

        res.status(200).json({message:'User followed successfully'});
    }catch (err) {
        res.status(500).json({message: 'An error occurred'});
    }
});

// Route: PUT /api/users/:id/unfollow
// Description: Unfollow a user
router.put('/:id/unfollow', async (req,res)=>{
    const userId=req.params.id;
    const {userIdToUnfollow}=req.body;

    try{
        // Check if both users exist 
        const currentUser = await User.findById(currentUserId);
        const userToUnfollow = await User.findById(userIdToUnfollow);

        if(!currentUser || !userToUnfollow){
            return res.status(404).json({ message :'User(s) Not Found'}) ;
        }

        //Check if the currentUser is following the userToUnfollow
        if(!currentUser.following.includes(userIdToUnfollow)){
            return res.status(400).json({ message: 'You are not following this user'});
        }

        // Remove the userIdToUnfollow from the currentUser's following array
        currentUser.following = currentUser.following.filter((followedUser) => followedUser.toString() !== userIdToUnfollow);
        await currentUser.save();

        res.status(200).json({message: 'User unfollowed successfully'});
    } catch (error) {
        res.status(500).json({message: ' An error occurred'});
    }
});

// Route: PUT /api/users/:id/profile
// Description: Update user profile
router.put(':/id/profile', async (req, res) => {
    const userId = req.params.id;
    const { username, email, fullName, bio, profilePicture } = req.body;

    try{
        //check if user exists
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        // Update the user's profile information
        user.username = username || user.username; // If provided, update the username; otherwise, keep the existing value
        user.email = email || user.email; // If provided, update the email; otherwise, keep the existing value
        user.fullName = fullName || user.fullName; // If provided, update the fullName; otherwise, keep the existing value
        user.bio = bio || user.bio; // If provided, update the bio; otherwise, keep the existing value
        user.profilePicture = profilePicture || user.profilePicture; // If provided, update the profilePicture; otherwise, keep the existing value

        await user.save();

        res.status(200).json({ message:'User profile updated successfully '});
        }catch(err){
            res.status(500).json({ message: ' An error occurred'});
    }
});

module.exports = router;