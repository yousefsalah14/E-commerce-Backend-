import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";
import { resetPassTemp, signUpTemp } from "../../utils/htmlTamplates.js";
import { Token } from "../../../DB/models/token.model.js";
import randomstring from "randomstring";
import { Cart } from "../../../DB/models/cart.model.js";

export const signUp = asyncHandler(async (req, res, next) => {
  // take data from body
  const { email } = req.body;
  //check user
  const user = await User.findOne({ email });
  if (user) return next(new Error("User already exist ", { cause: 409 }));

  // generate token
  const token = jwt.sign({ email }, process.env.SECERT_KEY);
  // create user
  await User.create({ ...req.body});
  // confirmation
  const confirmLink = `http://localhost:3000/auth/activate/${token}`;
  // send mail
  const html = signUpTemp(confirmLink);
  const messageSent = sendEmail({
    to: email,
    subject: "Account Activation",
    html,
  });
  if (!messageSent) return next(new Error("Something Wrong! email not sent! "));
  // send resonse
  return res.status(201).json({
    success: true,
    mesaage: "Wait for Activation ,Check your email⏳",
  });
});

export const activateAcc = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.SECERT_KEY);
  const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });
  // check user
  if (!user) return next(new Error("User not found ", { cause: 404 }));
  // TODO create cart
  await Cart.create({user : user._id})
  //send res
  return res.json({ success: true, message: "activated✅,try to login now " });
});
export const signIn = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;
  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found ", { cause: 404 }));
  // check isConfirmed
  if (!user.isConfirmed) return next(new Error("Account not Activated "));
  // compare password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("invalid password "));
  // generate token
  const token = jwt.sign({ email, id: user._id }, process.env.SECERT_KEY);
  // save token
  await Token.create({ token, user: user._id });
  res.json({ success: true, results: { token } });
});
export const forgertCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));
  // generate code
  const forgertCode = randomstring.generate({
    charset: "numeric",
    length: 5,
  });
  // save forget code
  user.forgetCode = forgertCode;
  await user.save();
  // send email
  const messageSent = await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPassTemp(forgertCode),
  });
  if (!messageSent) return next(new Error("Something Wrong! email not sent! "));
  return res.json({ success: true, message: "Check your email " });
});
// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // data
  const { email, password, forgetCode } = req.body;
  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error(" User Not Found", { cause:404 }));
  // check code
  if (forgetCode !== user.forgetCode)
    return next(new Error("Code is Invalied"));
  user.password = bcryptjs.hashSync(password, parseInt(process.env.SALT_ROUND));
  await user.save();
  // find all tokens
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
    // send res
    return res.json({
      success: true,
      mesaage: "try to login again",
    });
  });
});
