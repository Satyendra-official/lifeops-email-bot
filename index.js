require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const axios = require("axios");

// Function to get a quote from the internet
async function getQuoteFromAPI() {
  try {
    const res = await axios.get("https://zenquotes.io/api/random");
    if (res.data && res.data.length > 0) {
      const quote = res.data[0];
      return `${quote.q} – ${quote.a}`;
    } else {
      console.warn("Unexpected response format from quote API");
    }
  } catch (err) {
    console.error("Failed to fetch quote from API:", err.message);
  }
  
  // Fallback quote
  return "Success is the sum of small efforts, repeated day in and day out. – Robert Collier";
}

// Check for required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.TO_EMAIL) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1);
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

// Schedule it daily at 8 AM IST
cron.schedule('0 8 * * *', sendDailyEmail, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Set the timezone to India
});


// sendDailyEmail()
console.log("Daily email bot started, will send email at 8 AM daily IST.");