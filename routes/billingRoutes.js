const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 20000,
      currency: 'usd',
      description: '$200 for 200 credits',
      source: req.body.id
    });

    req.user.credits += 200;
    const user = await req.user.save();

    res.send(user);
  });
};
