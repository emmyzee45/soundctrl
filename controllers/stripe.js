import User from "../models/User.js";
import createError from "../utils/createError.js"
import Stripe from "stripe";

// "sk_test_51OYl3MHuxvfPN8eLlMGK4S72J9F16ieEZuxUStXliKDjyr8grX8WxU7P1CYaRhiQ8fD2dNGCIma9jr87tvG353N100CuTazu83"
// process.env.STRIPE
const stripe = new Stripe(process.env.STRIPE);
export const createStripeAccount = async(req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);

    try {
        const user = await User.findById(req.userId);
        let accountId = user.stripe_account_id;

        if(!accountId) {
            // Define parameters to create new stripe account id
            let accountParams = {
                type: "express",
                country: user.country || undefined,
                email: user.email || undefined,
                // business_type: user.business_type || undefined
            }

            const account = await stripe.accounts.create(accountParams);
            accountId = account.id;

            // // update account set it to manual payout
            // await stripe.accounts.update(
            //     accountId,
            //     {
            //         settings: {
            //             payouts: {
            //                 schedule: {
            //                     interval: 'manual',
            //                 }
            //             }
            //         }
            //     }
            // )

            // Update model and store the stripe account id in database
            user.stripe_account_id = accountId;
            await user.save();
        }

        // Create account link for user's stripe account
        const account_link = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.ARTIST_PUBLIC_DOMAIN}/artist-dashboard`,
            return_url: `${process.env.ARTIST_PUBLIC_DOMAIN}/artist-dashboard`,
            type: "account_onboarding"
        });

        res.status(200).json(account_link.url);
    }catch(err) {
        next(err)
    }
}

// Endpoint for user's onboarding, checks if onboarding has been completed
export const completeOnboarding = async(req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);

    try {
        const user = await User.findById(req.userId);

        // if completed onboarding already recorded
        if(user.onboarding_complete || !user.stripe_account_id) return res.status(200).json(user);

        const account = await stripe.accounts.retrieve(user.stripe_account_id);

        if(account.details_submitted) {
            user.onboarding_complete = true;
            await user.save();

            return res.status(200).json(user);
        }
        res.status(400).json("Not completed")
    }catch(err) {
        next(err)
    }
}

// Generate payout with stripe for available balance
export const payout = async(req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);

    try {
        const user = await User.findById(req.userId);
        
        // const balance = await stripe.balance.retrieve({
        //     stripeAccount: user.stripe_account_id
        // });

        const balance = await stripe.balance.retrieve();

        const {amount, currency} = balance.available[0];

        // const payout = await stripe.payouts.create({
        //     amount: amount,
        //     // method: "instant",
        //     currency: currency,
        //     statement_descriptor: 'Transaction made by sound control'
        // }, { stripeAccount: user.stripe_account_id });

        // res.status(200).json(payout);
        if(amount < user.earnings.balance) return next(createError(400, "pending balance"));

        await stripe.transfers.create({
            amount: (user.earnings.balance * 0.8).toFixed(),
            currency: 'usd',
            destination: user.stripe_account_id
        });

        user.earnings.balance = 0;
        await user.save();
        
        const { password, ...info } = user._doc;

        res.status(200).json(info);
    }catch(err) {
        next(err)
    }
};

// get account details
export const getAccountDetails = async(req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);

    try {
        const user = await User.findById(req.userId);

        // check if user complete onboarding
        if(!user.onboarding_complete) return next(createError(400, "No stripe account or onboarding not complete"));

        // Retrieve account details
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id,
        });

        // Generate a unique login link for associcated stripe account to access their express dashboard
        const login_link = await stripe.accounts.createLoginLink(
            user.stripe_account_id, {
                redirect_url: `${process.env.ARTIST_PUBLIC_DOMAIN}/artist-dashboard`
            }
        )
        res.status(200).json({ 
            balanceAvailable: balance.available[0].amount/100, 
            balancePending: balance.pending[0].amount/100,
            login_url: login_link.url,
            balanceCurrency: getCurrencySymbol(balance.available[0].currency),
        });
      
    }catch(err) {
        next(err)
    }
}

export const generateCharge = async(req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);
    // if (req.body.immediate_balance) {
    //     source = getTestSource('immediate_balance');
    //   } else if (req.body.payout_limit) {
    //     source = getTestSource('payout_limit');
    //   }
    try {
        const source = getTestSource('immediate_balance');
        const artist = await User.findById(req.params.id);
        // Accounts created in any other country use the more limited `recipients` service agreement (with a simpler
      // onboarding flow): the platform creates the charge and then separately transfers the funds to the recipient.
      const charge = await stripe.charges.create({
        source: source,
        amount: 4000,
        currency: "usd",
        description: "Testing",
        statement_descriptor: "Testing",
        // The `transfer_group` parameter must be a unique id for the ride; it must also match between the charge and transfer
        transfer_group: "6453635"
      });
    //   const transfer = await stripe.transfers.create({
    //     amount: 2000 * 0.9,
    //     currency: "usd",
    //     destination: artist.stripe_account_id,
    //     transfer_group: "6453635"
    //   })
      res.status(200);
    }catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// Function that returns a test card token for Stripe
function getTestSource(behavior) {
    // Important: We're using static tokens based on specific test card numbers
    // to trigger a special behavior. This is NOT how you would create real payments!
    // You should use Stripe Elements or Stripe iOS/Android SDKs to tokenize card numbers.
    // Use a static token based on a test card: https://stripe.com/docs/testing#cards
    var source = 'tok_visa';
    // We can use a different test token if a specific behavior is requested
    if (behavior === 'immediate_balance') {
      source = 'tok_bypassPending';
    } else if (behavior === 'payout_limit') {
      source = 'tok_visa_triggerTransferBlock';
    }
    return source;
  }

const getCurrencySymbol = (currency) => {
    const currencySymbol = new Intl.NumberFormat('en', {
        currency,
        style: 'currency'
    }).formatToParts(0).find((part) => part.type === 'currency');
    return currencySymbol && currencySymbol.value;
}