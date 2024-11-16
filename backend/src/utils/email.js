import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset Request",
    text: `Click this link to reset your password: ${resetUrl}`,
    html: `<p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Email sending failed."); // Rethrow error for handling in calling function
  }
};

export { sendPasswordResetEmail };
