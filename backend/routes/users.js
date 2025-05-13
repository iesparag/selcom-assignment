const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = new User({ name, email });
    await user.save();

    const wallet = new Wallet({ userId: user._id });
    await wallet.save();

    user.walletId = wallet._id;
    await user.save();

    res.status(201).json({ user, wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('walletId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
