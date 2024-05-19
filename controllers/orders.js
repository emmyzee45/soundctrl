import { artifactregistry } from "googleapis/build/src/apis/artifactregistry/index.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from "stripe";

// "sk_test_51OYl3MHuxvfPN8eLlMGK4S72J9F16ieEZuxUStXliKDjyr8grX8WxU7P1CYaRhiQ8fD2dNGCIma9jr87tvG353N100CuTazu83"
const stripe = new Stripe(process.env.STRIPE);

export const intent = async (req, res, next) => {

  const { price, type, artistId } = req.body;
  try {
    const artist = await User.findOne({_id: artistId});
    const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    transfer_data: {
      amount: price * 100 * 0.8,
      destination: artist.account_id
      
    }
    // await stripe.
  });
  
  const newOrder = new Order({
    type: type,
    buyerId: req.userId,
    sellerId: artistId,
    price: price,
    payment_intent: paymentIntent.id,
  });
  
  await newOrder.save();
  
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
    // result: "success"
  });

}catch(err) {
  next(err)
}
};

export const transfer = async(req, res, next) => {
  const {amount, account_id } = req.body;

  try {
    const transfer = await stripe.transfers.create({
      amount: amount * 100,
      currency: "usd",
      destination: account_id
    });

    res.status(200).json(transfer);
  }catch(err) {
    next(err);
  }
}

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
    const order = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    await User.findByIdAndUpdate(order.sellerId, {
      $addToSet: { subscribedUsers: order.buyerId },
      $inc: order.type == "subscription" ? 
      { "earnings.subscriptions": order.price } : 
      { "earnings.bookings": order.price },
      $inc: { "earnings.total": order.price }
    });
    await User.findByIdAndUpdate(order.buyerId, {
      $addToSet: { subscribers: order.sellerId },
      $inc: {points: 10 }
    });

    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};
