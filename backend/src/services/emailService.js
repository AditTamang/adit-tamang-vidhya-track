import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp, purpose) => {
  const subjects = {
    registration: "Verify Your Email - VidyaTrack",
    forgot_password: "Password Reset OTP - VidyaTrack",
  };

  const messages = {
    registration: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">Welcome to VidyaTrack!</h2>
        <p>Your verification OTP is:</p>
        <h1 style="background: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    forgot_password: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #FF9800;">Password Reset Request</h2>
        <p>Your password reset OTP is:</p>
        <h1 style="background: #FF9800; color: white; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  const mailOptions = {
    from: `"VidyaTrack" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjects[purpose],
    html: messages[purpose],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};
