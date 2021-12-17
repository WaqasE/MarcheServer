const router = require('express').Router();

const { AuthController, ChatController, GigController } = require('../controller/');
const { auth } = require('../middlewares/')

router.get('/', (req, res) => {
    res.status(200).send('hello it\s me I was wondering');
});

// Auth Routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/token', AuthController.token);
router.post('/logout', AuthController.logout);
router.post('/skills/:id', AuthController.skills);
router.post('/profilePicture/:id', AuthController.profilePicture);
router.post('/me', AuthController.me);

// Gig Routes
router.post('/gigs/recomendation', GigController.get);
router.post('/gigs', GigController.create);
router.put('/gigs/tags', GigController.addTags);
router.put('/gigs/:id', GigController.update);
router.delete('/gigs/:id', GigController.delete);
router.post('/bids/:id', GigController.createBid);
router.delete('/bids/:id', GigController.deleteBid);

// Chat Routes
router.get('/inbox', ChatController.inbox);
router.post('/inbox/:username', ChatController.chatting);

module.exports = router;