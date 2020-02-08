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

router.post('/user/register', authMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.register);

router.get('/user/:id', authMiddleware.isAuthenticated, usersController.profile);

router.post('/login', authMiddleware.isNotAuthenticated, usersController.doLogin)
router.post('/logout', authMiddleware.isAuthenticated, usersController.logout)