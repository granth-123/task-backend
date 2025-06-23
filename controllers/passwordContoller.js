import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendMail } from '../services/mailer.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "No user with this email" });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const resetLink = `http://localhost:5000/reset-password?token=${token}`;

  const html = `
    <p>Hello ${user.name},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>"token":"${token}"</p>
  `;

  await sendMail(email, "Password Reset", html);

  res.status(200).json({ message: "Reset link sent. Check your email." });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(400).json({ error: "Invalid or expired token." });
  }
};
