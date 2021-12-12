const router = require('express').Router();

const { AuthController, ChatController, GigController } = require('../controller/')

router.get('/', (req, res) => {
    res.status(200).send('hello it\s me I was wondering');
});

// Auth Routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/token', AuthController.token);
router.post('/logout', AuthController.logout);
router.post('/me', AuthController.me);

// Gig Routes
router.get('/gigs', GigController.get);
router.post('/gigs/:id', GigController.create);
router.put('/gigs/:id', GigController.update);
router.delete('/gigs/:id', GigController.delete);
router.post('/bids/:id', GigController.createBid);
router.delete('/bids/:id', GigController.deleteBid);

// Chat Routes
router.get('/inbox', ChatController.inbox);
router.post('/inbox/:username', ChatController.chatting);

module.exports = router;