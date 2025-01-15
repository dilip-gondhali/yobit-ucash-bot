require("dotenv").config(); // Load environment variables
const axios = require("axios");
const crypto = require("crypto");

// Load YoBit API credentials
const { API_KEY, API_SECRET } = process.env;

if (!API_KEY || !API_SECRET) {
    throw new Error("API_KEY and API_SECRET must be set in the .env file.");
}

// Helper function for YoBit API requests
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

// Fetch current market price for a trading pair
async function getMarketPrice(pair) {
    try {
        const response = await axios.get(`https://yobit.net/api/3/depth/${pair}`);
        return response.data[pair].asks[0][0];
    } catch (error) {
        console.error("Error fetching market price:", error.message);
        throw error;
    }
}

// Function to place a trade with enhanced error handling
async function placeTrade(pair, type, rate, amount, orderType) {
    try {
        let tradeParams = {
            pair,
            type,
            amount
        };

        if (orderType === "limit") {
            tradeParams.rate = rate;
        } else if (orderType === "market") {
            tradeParams.rate = await getMarketPrice(pair);
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

// Example usage: Adjust values as needed
// placeTrade('ucash_btc', 'buy', '0.00000002', '1111', 'limit');
//placeTrade('ucash_btc', 'buy', null, '520', 'market');
//placeTrade('ucash_btc', 'buy', null, '1000', 'market');
