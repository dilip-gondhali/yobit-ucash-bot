# Trading Bot

> The code is commented. Change it accordingly for your need. <br>
If you want to place a trade like buying using limit order, uncomment the code under the limit order and change the values accordingly.

## Limit order
### placeTrade(['trade_pair'], ['buy'], ['rate'], [amount], ['limit'])
```bash
placeTrade('ucash_btc', 'buy', '0.00000002', '1111', 'limit');
```

## Market order
### placeTrade(['trade_pair'], ['buy'], [null], [amount], ['market'])
```bash
 placeTrade("ucash_btc", "sell", null, "20000", "market");
```

# Run Locally
Clone the project

```bash
  git clone https://github.com/dilip-gondhali/yobit-ucash-bot.git
```

Go to the project directory

```bash
  cd yobit-ucash-bot/buysellcode
```
Create a `.env` file and insert your `API_KEY` and `API_SECRET`
```
API_KEY=<Insert the api key>
API_SECRET=<Insert the api secret>
```

Install dependencies

```bash
  npm install
```
### To auto buy x amount of UCASH every X seconds, run this.
```bash
node autobuy.js
```

### To buy, run this.
```bash
node buy.js
```
### To sell, run this.
```bash
node sell.js
```
### To get the balance info, run this.
```bash
node getInfo.js
```