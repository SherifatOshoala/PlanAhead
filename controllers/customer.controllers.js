const Customers = require("../models/customers.model.js");
const OTP = require("../models/otp.models.js");
const { sendMail } = require("../services/email.js");
const messages = require("../messages");
const {
  createCustomerValidation,
  validateVerificationData,
  emailAndPasswordValidation,
  emailValidation,
  completeForgotPasswordValidation,
  updateProfileValidation,
  changePasswordValidation
} = require("../validations/customer.validations.js");
const { encryptPassword, generateOtp, checkPassword } = require("../utils");
const { v4: uuidv4 } = require("uuid");

const createCustomer = async (req, res) => {
  const {
    surname,
    other_names,
    email,
    phone,
    password,
    password_confirmation,
  } = req.body;
  try {
    const validate = createCustomerValidation(req.body);
    if (validate != undefined) throw new Error(validate.details[0].message);
    const checkEmail = await Customers.findOne({ where: { email: email } });
    if (checkEmail != null) throw new Error(messages.emailExists);
    const [hash, salt] = await encryptPassword(password);
    await Customers.create({
      customer_id: uuidv4(),
      surname,
      other_names,
      email,
      password_hash: hash,
      password_salt: salt,
    });
    const otp = generateOtp();
    await OTP.create({
      email,
      otp: otp,
    });
    sendMail(
      email,
      "Your OTP!",
      `Hello ${surname}, 
Please, use this otp: ${otp} to verify your mail`
    );
    res.status(201).json({
      success: true,
      message: `${messages.otpNoticeMessage}, ${surname}!`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyCustomerEmail = async (req, res) => {
  const { email, otp } = req.params;
  try {
    const validate = validateVerificationData(req.params);
    if (validate != undefined) throw new Error(messages.invalidEmailOrOtp);
    const checkIfDataExists = await OTP.findOne({
      where: { email: email, otp: otp },
    });
    if (checkIfDataExists == null) throw new Error(messages.invalidEmailOrOtp);
    const convertMillisecondsToMinutes = 1000 * 60;
    const otpCreatedTime = new Date(
      checkIfDataExists.dataValues.created_at
    ).getTime();
    const timeNow = new Date().getTime();
    const timeDifferenceInMillisecs = timeNow - otpCreatedTime;
    const timeInMinutes = Math.floor(
      timeDifferenceInMillisecs / convertMillisecondsToMinutes
    );
    if (timeInMinutes > 200) throw new Error(messages.invalidOrExpiredOtp);
    await Customers.update(
      { is_email_verified: true },
      { where: { email: email } }
    );
    await OTP.destroy({
      where: { email: email, otp: otp },
    });
    const getUserDetails = await Customers.findOne({ where: { email: email } });
    sendMail(
      email,
      "Verification Successful!",
      `Hi ${getUserDetails.dataValues.surname},\nWelcome to PlanAhead, your day just got more productive!`
    );
    res.status(200).json({
      success: true,
      message: `Hi ${getUserDetails.dataValues.surname},
          ${messages.landing}`,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validate = emailAndPasswordValidation(req.body);
    if (validate != undefined) throw new Error(messages.invalidEmailOrPassword);
    const getUserByEmail = await Customers.findOne({ where: { email: email } });
    if (getUserByEmail == null)
      throw new Error(messages.invalidEmailOrPassword);
    if (getUserByEmail.dataValues.is_email_verified == false) {
      const verificationError = new Error()
      verificationError.message =  messages.verifcationError
      verificationError.isEmailVerified = false
      throw (verificationError);
    }
    const hash = getUserByEmail.dataValues.password_hash;
    const comparePassword = await checkPassword(password, hash);
    if (!comparePassword) throw new Error(messages.invalidEmailOrPassword);
    res.status(201).json({
      status: true,
      message: messages.login,
    });
  } catch (error) {
    const keys = Object.keys(error)
    if(keys.includes("isEmailVerified")){
      res.status(500).json({
        status: false,
        message: error.message,
        isEmailVerified: error.isEmailVerified
      });
    }else{
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const validateEmail = emailValidation(req.body);
    if (validateEmail != undefined)
      throw new Error(validateEmail.details[0].message);
    const otp = generateOtp();
    await OTP.create({ email: email, otp: otp });
    sendMail(
      email,
      "Your OTP!",
      `Please, use this otp: ${otp} to verify your mail`
    );
    res.status(201).json({
      success: true,
      message: messages.otpNoticeMessage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const completeForgotPassword = async (req, res) => {
  const { otp, email, new_password, password_confirmation } = req.body;
  try {
    const validate = completeForgotPasswordValidation(req.body);
    if (validate != undefined) throw new Error(validate.details[0].message);
    const confirmOtpAndEmail = await OTP.findOne({
      where: { email: email, otp: otp },
    });
    if (confirmOtpAndEmail == null) throw new Error(messages.invalidEmailOrOtp);
    const convertMillisecondsToMinutes = 1000 * 60;
    const otpCreatedTime = new Date(
      confirmOtpAndEmail.dataValues.created_at
    ).getTime();
    const timeNow = new Date().getTime();
    const timeDifferenceInMillisecs = timeNow - otpCreatedTime;
    const timeInMinutes = Math.floor(
      timeDifferenceInMillisecs / convertMillisecondsToMinutes
    );
    if (timeInMinutes > 10) throw new Error(messages.invalidEmailOrOtp);
    const [hash, salt] = await encryptPassword(new_password);
    await Customers.update(
      { password_hash: hash, password_salt: salt },
      { where: { email: email } }
    );
    await OTP.destroy({ where: { email: email, otp: otp } });
    const getUserDetails = await Customers.findOne({ where: { email: email } });
    sendMail(
      email,
      "Password reset successful!",
      `Hi ${getUserDetails.dataValues.surname},\nYour password has been reset successfully, you can now login. Cheers!`
    );
    res.status(201).json({
      status: true,
      message: messages.completeForgotPassword,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const resendOtp = async (req, res)=> {
  const email = req.params.email
   try{
    const validateEmail = emailValidation(req.params);
    if (validateEmail != undefined)
      throw new Error(validateEmail.details[0].message);
   const checkIfUserExists = await Customers.findOne({where:{email:email}})
   if(checkIfUserExists == null) throw new Error ('Account does not exist')
      await OTP.destroy({ where:{email:email} });
      const otp = generateOtp()
      await OTP.create({ email: email, otp: otp });
    sendMail(
      email,
      "Your OTP!",
      `Please, use this otp: ${otp} to verify your mail`
    );
    res.status(200).json({
      status: true, 
      message: messages.otpNoticeMessage
    })

   }catch (error){
res.status(500).json({
  status: false,
  message: error.message
})
   }
}

const changePassword = async (req, res) => {
  const id = req.params.customer_id
const {old_password, new_password, password_confirmation} = req.body
try{
  const checkIfUserExists = await Customers.findOne({where:{customer_id:id}})
  if(checkIfUserExists == null) throw new Error (messages.customerExistsNot)
const customer_hash = checkIfUserExists.password_hash
const comparePassword = await checkPassword(old_password, customer_hash);
if (!comparePassword) throw new Error(messages.incorrectPassword)
  const validate = changePasswordValidation(req.body)
  if (validate != undefined) throw new Error(validate.details[0].message);
  const [hash, salt] = await encryptPassword(new_password);
  await Customers.update(
    { password_hash: hash, password_salt: salt },
    { where: { customer_id: id } }
  );
res.status(200).json({
  status: true, 
  message: messages.changePassword
})

}
 catch(error){
  res.status(500).json({
    status: false,
    message: error.message
  })
 }
}

const updateProfile = async(req, res) => {
  try {
    const id = req.params.id;
const { surname, other_names, phone } = req.body;
    const validate = updateProfileValidation(req.body)
    if(validate != undefined){
      throw new Error(validate.details[0].message)
    }
    let keys = {};

    if (surname) {
     keys.surname= surname
    }
    if (other_names) {
     keys.other_names = other_names
    }
    if (phone) {
    keys.phone = phone
    }
  const customer = await Customers.findOne({ where: { customer_id: id } });
    if (!customer) {
      throw new Error(messages.customerExistsNot);
    }
const updateCustomer = await Customers.update(keys, {where:{customer_id:id}})

          if (updateCustomer[0] == 0) throw new Error(messages.noChangeDetected);
          else {
            res.status(200).json({
              status: true,
              message: messages.updateCustomer,
              data: keys
            });
          }
      }
      catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}

module.exports = {
  createCustomer,
  verifyCustomerEmail,
  customerLogin,
  forgotPassword,
  completeForgotPassword,
  resendOtp,
  changePassword,
  updateProfile
};

