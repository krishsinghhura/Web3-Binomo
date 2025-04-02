require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  TRADERMADE_API_KEY: process.env.TRADERMADE_API_KEY || "wsCBGalemRbgd9Owzc7g",
  TRADERMADE_WS_URL: "wss://marketdata.tradermade.com/feedadv",
};
