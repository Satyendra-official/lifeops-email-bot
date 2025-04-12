import nodemailer from 'nodemailer';
import axios from 'axios';
import cron from 'node-cron';

// Hardcoded email credentials (for dev/testing only)
const EMAIL_USER = 'satyadot3@gmail.com';
const EMAIL_PASS = 'dqinevevxbemmtgo';
const TO_EMAIL = 'satyendray2306@gmail.com';

async function getQuoteFromAPI() {
  try {
    const res = await axios.get("https://zenquotes.io/api/random");
    if (res.data && res.data.length > 0) {
      const quote = res.data[0];
      return `${quote.q} – ${quote.a}`;
    }
  } catch (err) {
    console.error("Failed to fetch quote:", err.message);
  }
  return "Success is the sum of small efforts, repeated day in and day out. – Robert Collier";
}

async function sendDailyEmail() {
  const quote = await getQuoteFromAPI();
  const question = "What did you build or improve today in LifeOps?";

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: TO_EMAIL,
    subject: "🚀 Daily LifeOps Motivation",
    text: `🔥 Quote of the Day:\n${quote}\n\n❓ Progress Question:\n${question}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

// ⏰ Schedule it daily at 8 AM IST
cron.schedule('0 8 * * *', sendDailyEmail, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

sendDailyEmail()

console.log("✅ Email bot started — will send daily at 8 AM IST.");
