const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('./cloudinary.config');

/** Controllers ---- */
const controller = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')
const propertiesController = require('../controllers/properties.controller')


module.exports = router;

router.get('/', controller.base);

//create property
router.post('/become-a-hauser', propertiesController.create);

//registro usuario
router.post('/user/register', authMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.register);

//login
router.post('/login', authMiddleware.isNotAuthenticated, usersController.doLogin);
//logout
router.post('/logout', authMiddleware.isAuthenticated, usersController.logout);

//contacto usuario property
router.post('/contact_hauser/:id', propertiesController.contact)

//reservar
router.post('/booking_id/:id', authMiddleware.isAuthenticated, propertiesController.booking)

//get user messages
router.get('/user/inbox/:id', usersController.inbox);

//user profile
router.get('/user/:id', usersController.profile);

//comentario a usuario
router.post('/user/:id/comments', usersController.addComment)

//detail property
router.get('/home/:id', propertiesController.detail);
//list property by location
router.get('/:location/homes', propertiesController.list);
