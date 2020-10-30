const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');

router.post('/', async (req, res) => {
  try {
    // Data validation
    const { error } = registerValidation(req.body);
    error && res.status(400).send(error.details[0].message);

    // Check if the user alredy exists in database
    const emailExist = await User.findOne({ email: req.body.email });
    emailExist && res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;