const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

module.exports = app => {
  app.post('/api/stripe', async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 20000,
      currency: 'usd',
      description: '$200 for 200 credits',
      source: req.body.id
    });
    console.log(charge);
  });
};
