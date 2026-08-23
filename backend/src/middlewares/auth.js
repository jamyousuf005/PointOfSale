const jwt = require('jsonwebtoken')

const ensureAuthenticated = (req,res,next)=>{
         console.log('ensureAuthenticated called'); const auth = req.headers['authorization']
         if(!auth){
            return res.status(403)
            .json({msg:'Unauthorized, jwt token required'})
         }

           const token = auth.split(' ')[1];
           try{
             const decoded = jwt.verify(token,process.env.JWT_SECRET)
             req.user=decoded
             next()
           }catch(err){
             return res.status(403)
             .json({msg:'Unauthorized,JWT token is required'})
           }
}

module.exports=ensureAuthenticated