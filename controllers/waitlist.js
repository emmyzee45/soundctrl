import createError from "../utils/createError.js";
import Waitlist from "../models/Waitlist.js";
import hashToken from "../utils/hashToken.js";
import sendEmail from "../utils/sendMail.js";

export const createWaitlist = async (req, res, next) => {
  const newWaitlist = new Waitlist(req.body);
  try {
    const savedWaitlist = await newWaitlist.save();

    res.status(201).send(savedWaitlist);
  } catch (err) {
    next(err);
  }
};

// get Waitlists
export const getWaitlists = async (req, res, next) => {
  try {
    const waitlists = await Waitlist.find();
    res.status(200).send(waitlists);
  } catch (err) {
    next(err);
  }
};

// delete Waitlist by artist
export const deleteWaitlist = async (req, res, next) => {
  try {
    const waitlists = await Waitlist.findByIdAndDelete(req.params.id);
    res.status(200).send("waitlist deleted!");
  } catch (err) {
    next(err);
  }
};

// send code
export const sendCode = async(req,res, next) => {
    const { email } = req.body;

    // Delete Token if it exists in DB
    let wailtlist = await Waitlist.findOne({ email, isIsued: true });
    if (wailtlist) {
    await wailtlist.deleteOne();
    }
    
     // Genrate 4 digit code
     const registerCode = Math.floor(1000 + Math.random() * 9000);
    
    // Hash token and save
    const hashedToken = hashToken(registerCode);
    await Waitlist.findOneAndUpdate({email}, {
        $set: { code: hashedToken, isIsued: true}
    })
    

// Send Email
const subject = "Register Code - AUTH:Z";
const send_to = email;
const sent_from = process.env.EMAIL_USER;
const reply_to = "noreply@soundctrl.net";
const template = "registercode";
const name = "customer";
const link = registerCode;

try {
  await sendEmail(
    subject,
    send_to,
    sent_from,
    reply_to,
    template,
    name,
    link
  );
  res.status(200).json({ message: "Register code Sent" }); 
}catch(err) {
    next(err)
}
}
// send code
export const confirmCode = async(req,res, next) => {
    const { code } = req.params;
    // const { email } = req.body;
  
    const hashedCode = hashToken(code);
    try {

        const userCode = await Waitlist.findOne({
            code: hashedCode,
            // email: email,
        });
        
        if (!userCode) {
            return res.status(404).json("Invalid Code");
        }
        res.status(200).json("Code validation successfully")
    }catch(err) {
        next(err)
    }

}
