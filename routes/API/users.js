const express = require('express');
const router= express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');//for web token JWT
const keys = require('../../config/keys');//to access the secret key
// Load User model
const User = require('../../models/User');//for regster****************
const { secret } = require('../../config/keys');


//load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

//******testing  ******************************************************
//**********************************************************************/
//@route GET api/users/test
//@desc tests users route
//@access public
router.get('/test',(req , res) => res.json({msg: 'user  works'})
);
//******************************************************************
// for registering a user in to my database
// **i need  const User = require('../../models/User');
//******************************************************************** */
// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body)
//check validation
  if (!isValid){
    return  res.status(400).json(errors)
  }
//use mongoose to first find if the email exist and also load the User   const User = require('../../models/User');
 User.findOne({email: req.body.email}).then(user =>{
if(user){
  return res.status(400).json({email: 'email already exist'});
}else {
  const avatar = gravatar.url(req.body.email,{
   s:'200', //size
   r:'pg',//rating
   d:'mm', //default
  });
  const newUser = new User({
    name: req.body.name,
    email:req.body.email,
    avatar,
    password: req.body.password
  });
  bcrypt.genSalt(10,(err, salt) =>{
bcrypt.hash(newUser.password, salt,(err, hash)=>{
  if(err) throw err;
  newUser.password = hash;
  newUser
   .save()
   .then(user => res.json(user))
   .catch(err => console.log(err));
});
  });
}
    } );
});
//************ registration finished */



//  *******************************************
// email and password checking during  loging part -11
//**************************************** */
// @route   GET api/users/login  part--11
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body)
  //check validation
    if (!isValid){
      return  res.status(400).json(errors)}


  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email })
  .then(user => {
    // checking for the user
    if (!user) {
       errors.email ='user not found'
      //return res.status(404).json({email: 'user not found'});
      return res.status(404).json(errors);
    }
    // Check Password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (isMatch) {
       // res.json({msg : 'Success'});
       //*************/
       //JWT 
       //****************
       //user match
       const payload = {id:user.id,name:user.name,avatar:user.avatar}
       //sign token
       jwt.sign(
         payload,
         keys.secret,
        {expiresIn: 3600},
        (err,token)=> {
         res.json({ 
  success: true,
  token: 'Bearer ' + token
});
        }
        );

      }else {
        errors.password ='password incorrect'
        return res.status(400).json( errors);
      }
  });
  });
});
//****************************finished pwd and email chaking for loging****/
//***********************/
//Protected Route
//********************** */
//@route GET api/users/current
//@desc return current user
//@access private

const passport = require ('passport');
const { json } = require('body-parser');
router.get ('/current',passport.authenticate('jwt',{session:false}),
(req,res)=>{
  
 // res.json({msg : 'success'}) //res.json(200).send('success')
 //res.json(req.user) //i shouldn't use this as a resposnse because i don want to show all my private information
 res.json({
  id: req.user.id,
  name:req.user.name,
  email:req.user.email
 })

}
)

module.exports = router;