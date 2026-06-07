require("dotenv").config();

const trim = (value) =>
  typeof value === "string" ? value.trim() : value;

module.exports = {
  oceanApiKey: trim(process.env.OCEAN_API_KEY),
  prospeoApiKey: trim(process.env.PROSPEO_API_KEY),
  brevoApiKey: trim(process.env.BREVO_API_KEY),
  senderName: trim(process.env.SENDER_NAME),
  senderEmail: trim(process.env.SENDER_EMAIL)
};