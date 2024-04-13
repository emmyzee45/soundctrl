import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const stripe = new Stripe("sk_test_51OYl3MHuxvfPN8eLlMGK4S72J9F16ieEZuxUStXliKDjyr8grX8WxU7P1CYaRhiQ8fD2dNGCIma9jr87tvG353N100CuTazu83");


  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    // await stripe.
  });

  const newOrder = new Order({
    type: req.body.type,
    buyerId: req.userId,
    sellerId: req.body.artistId,
    price: req.body.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
    // result: "success"
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isArtist ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const subsEarnings = async(req, res, next) => {
  let totalEarnings = 0;
  try {
    const result = await Order.find({
      ...(req.isArtist ? {sellerId: req.userId} : {buyerId: req.userId}),
      isCompleted: true,
      type: "subscription"
    });

    result.forEach((subscrioption) => {
      totalEarnings += subscrioption.price;
    })

    return res.status(200).json(totalEarnings);
  }catch(err) {
    next(err)
  }
}

export const bookingEarning = async(req, res) => {
  let totalEarnings = 0;
  try {
    const  result = await Order.find({
      ...(req.isArtist ? { sellerId: req.userId }: { buyerId: req.userId}),
      isCompleted: true,
      type: "booking"
    });

    result.forEach((subscription) => {
      totalEarnings += subscription.price;
    })

    res.status(200).json(totalEarnings);
  }catch(err) {
    next(err)
  }
}
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    await User.findByIdAndUpdate(orders.sellerId, {
      $addToSet: { subscribedUsers: orders.buyerId },
      $inc: orders.type == "subscription" ? 
      { "earnings.subscriptions": orders.price } : 
      { "earnings.bookings": orders.price }
    });
    await User.findByIdAndUpdate(orders.buyerId, {
      $addToSet: { subscribers: orders.sellerId },
      $inc: {points: 10 }
    });

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
