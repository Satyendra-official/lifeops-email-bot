require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const quotes = require('./quotes');
const axios = require("axios");

// Function to get a quote from the internet
async function getQuoteFromAPI() {
  try {
    const res = await axios.get("https://zenquotes.io/api/random");
    const quote = res.data[0];
    return `${quote.q} – ${quote.a}`;
  } catch (err) {
    console.error("Failed to fetch quote, using fallback.");
    return "Success is the sum of small efforts, repeated day in and day out. – Robert Collier";
  }
}

// Create mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Daily Email Function
async function sendDailyEmail() {
    const quote = await getQuoteFromAPI();
  const question = "What did you build or improve today in LifeOps?";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: "🚀 Daily LifeOps Motivation",
    text: `🔥 Quote of the Day:\n${quote}\n\n❓ Progress Question:\n${question}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Schedule it daily at 8 AM
//cron.schedule('0 8 * * *', sendDailyEmail);



sendDailyEmail();