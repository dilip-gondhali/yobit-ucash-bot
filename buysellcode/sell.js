require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

const { API_KEY, API_SECRET } = process.env;

if (!API_KEY || !API_SECRET) {
    throw new Error("API_KEY and API_SECRET must be set in the .env file.");
}

// Function for YoBit API requests
async function yobitApiRequest(method, params = {}) {
    const nonce = Math.floor(Date.now() / 1000);
    params.method = method;
    params.nonce = nonce;

    const postData = new URLSearchParams(params).toString();
    const sign = crypto.createHmac("sha512", API_SECRET).update(postData).digest("hex");

    try {
        const response = await axios.post("https://yobit.net/tapi/", postData, {
            headers: {
                Key: API_KEY,
                Sign: sign,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error making API request:", error.message);
        throw error;
    }
}

// Function to fetch current market bid price
async function getMarketBidPrice(pair) {
    try {
        const response = await axios.get(`https://yobit.net/api/3/depth/${pair}`);
        return response.data[pair].bids[0][0];
    } catch (error) {
        console.error("Error fetching market bid price:", error.message);
        throw error;
    }
}

// Function to place a sell trade
async function placeTrade(pair, type, rate, amount, orderType) {
    try {
        let tradeParams = { pair, type, amount };

        if (orderType === "limit") {
            tradeParams.rate = rate;
        } else if (orderType === "market") {
            tradeParams.rate = await getMarketBidPrice(pair);
        } else {
            throw new Error('Invalid order type. Use "limit" or "market".');
        }

        const tradeResult = await yobitApiRequest("Trade", tradeParams);

        if (tradeResult.success === 1) {
            console.log("Trade successful:", tradeResult.return);
        } else {
            console.error("Trade error:", tradeResult.error);
        }
    } catch (error) {
        console.error("Failed to place trade:", error.message);
    }
}

// Example usage
// placeTrade("ucash_btc", "sell", "0.00000001", "5200", "limit");
// placeTrade("ucash_btc", "sell", null, "20000", "market");
// placeTrade("ucash_btc", "sell", null, "30000", "market");


