
const jwt = require('jsonwebtoken');
 
const jwAuthMiddleware = (req , res , next) =>{
    
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error:'Token not found'});

    const toekn = req.headers.authorization.split('')[1];
    if(!toekn) return res.status(401).json({error:'Unauthorized'})

        try {
            //verify the jwt token
            const decode = jwt.verify(toekn,process.env.JWT_SECRET);
            
            //attach user information to the request object
            req.user = decode;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({error:'Ivalid token'})
        }
}

    //generate jwt token

    const generateToken = (userdata) =>{
        //generate new jwt token using user data 
        return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:3000});

    }

    module.exports = {jwAuthMiddleware, generateToken};