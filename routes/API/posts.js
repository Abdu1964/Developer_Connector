const express = require('express');
const router= express.Router();
const passport = require('passport');
const Post = require('../../models/post');
//load post validation
const validatePostInput = require('../../validation/post');
 
//load profle model
const Profile = require('../../models/Profile')
// Load User model
const User = require('../../models/User');
// @route   GET api/posts
// @desc    Get posts
// @access  Private and get all private posts
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.find({user: req.user.id})
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostsfound: 'No posts found'}));
});
// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});


 
//@route GET api/posts/test
//@desc tests posts route
//@access public
router.get('/test',(req , res) => res.json({msg: 'posts works'})
);


// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

if(!isValid) {
  return res.status(400).json(errors);
}

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save()
    .then(post => res.json(post));

});
// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check if post exists
      if (!post) {
        return res.status(404).json({ postnotfound: 'No post found' });
      }

      // Check if the current user is the owner of the post
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: 'User not authorized' });
      }

      // Delete the post
      post.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});
// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' });
          }

          // Add user ID to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //this means if  they are not there
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          
            return res.status(400).json({ notliked: 'You have not yet liked this post' });
          }

          // Get the remove index
          const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save the post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});


// @route   POST api/posts/comment/:id
// @desc    Add a comment to a post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      // Add to comments array
      post.comments.unshift(newComment);

      // Save the post
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});
module.exports = router;