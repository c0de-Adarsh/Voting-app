const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const {jwtAuthMiddleware , generateToken} =require('./../jwt');



router.post('/signup',async(req,res)=>{
    try {
        const data = req.body;

        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload ={
            id:response.id
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is:',token)
        res.status(200).json({response: response, token: token})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server error'})
    }
})

router.post('/login', async(req,res)=>{
  try {
    const {aadharCarNumber , password} = req.body;

    const user = await User.findOne({aadharCarNumber: aadharCarNumber})

    if(!user || !(await user.comparePassword(password))){
        
        return res.status(401).json({error:'Invalid username or password'});
    }

    const payload = {
        id: user.id,
        
    }

    const token = generateToken(payload);
    res.json({token})
  } catch (error) {
     console.log(error);
     res.status(500).json({error:'Internal server error'})
  }
});



router.get('/profile', async (req , res)=>{
    try {
        const userdata = req.user;
        const userId = userdata.id;
        const user = await User.findById(userId);

        res.status(200).json({user});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'})
    }
 })


 router.put('/profile/password',async(req,res)=>{
    try {
        const userId = req.user.id; //extract the id from the token
        const {currentPassword , newPassword} = req.body; // extract current and new password from request body
           
        //find the user by userId
        const user = await User.findById(userId);
        //if password does not match return error
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:"Invalid username or password"});
        }

        //if true

        //update the users password
        user.password = newPassword
        await user.save()
        console.log('password updated');

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
 })

 module.exports = router;