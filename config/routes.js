const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('./cloudinary.config');

/** Controllers ---- */
const userController = require('../controllers/users.controller')
const propertiesController = require('../controllers/properties.controller')


module.exports = router;

router.get('/', propertiesController.index)