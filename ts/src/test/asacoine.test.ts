//  ---------------------------------------------------------------------------

import assert from 'assert';
import asacoine from '../asacoine.js';

//  ---------------------------------------------------------------------------

const exchange = new asacoine ();

const directMarket = exchange.parseMarket ({
    'baseId': 'BTC',
    'quoteId': 'TMN',
});
assert.strictEqual (directMarket['symbol'], 'BTC/IRT', 'parses market objects using the base Exchange contract');

const response = {
    'error': [],
    'status': 200,
    'data': {
        'BTC': {
            'USDT': {
                'bid': [ '77002.3861', '0.00715913' ],
                'ask': [ '77110.3190', '0.25426519' ],
            },
            'TMN': {
                'bid': [ '15301996198', '0.00715913' ],
                'ask': [ '15381966431', '0.25426519' ],
            },
        },
    },
};

const markets = exchange.parseMarkets (response);
assert.strictEqual (markets.length, 2, 'parses each nested base/quote pair as a market');
assert.strictEqual (markets[0]['symbol'], 'BTC/USDT', 'keeps USDT market symbols');
assert.strictEqual (markets[1]['symbol'], 'BTC/IRT', 'normalizes TMN markets to IRT');

const ticker = exchange.parseTicker (response['data']['BTC']['USDT'], markets[0]);
assert.strictEqual (ticker['bid'], 77002.3861, 'uses the bid price');
assert.strictEqual (ticker['bidVolume'], 0.00715913, 'uses the bid amount');
assert.strictEqual (ticker['ask'], 77110.319, 'uses the ask price');
assert.strictEqual (ticker['askVolume'], 0.25426519, 'uses the ask amount');
assert.strictEqual (ticker['last'], 77056.35255, 'uses the bid/ask midpoint as the last price');

const tickerWithoutMarket = exchange.parseTicker (response['data']['BTC']['USDT']);
assert.strictEqual (tickerWithoutMarket['last'], 77056.35255, 'allows the optional base-class market argument to be omitted');

const cumulativeResponse = {
    'error': [],
    'status': 200,
    'data': {
        'keys': [ 'priority', 'name', 'nameFa', 'orderBook', 'changeRate', '_id', 'market', 'buyGapPercent', 'sellGapPercent', 'srcMinSize', 'dstMinSize', 'srcNumberOfDecimal', 'dstNumberOfDecimal', 'priceNumberOfDecimal', 'buyStatus', 'sellStatus', 'tradingView', 'marketTypes', 'srcSymbol', 'chartConfig' ],
        'values': [
            [ 1, 'USDT-TMN', 'تتر-تومان', { 'bestBid': '199690', 'bestAsk': '200090', 'bidSize': '0', 'askSize': '0' }, '2.7', 'id-usdt-tmn', { 'ask': '200090', 'bid': '199690', 'updatedAt': 1787555841626 }, 0.1, 0.1, 12, 11.8, 2, 2, 0, 'active', 'active', {}, [ 'otc', 'spot' ], { '_id': 'id-usdt', 'name': 'USDT' }, {} ],
            [ 2, 'BTC-USDT', 'بیت کوین-تتر', { 'bestBid': '77576.2966', 'bestAsk': '77685.0339', 'bidSize': '0.001615', 'askSize': '0.70202073' }, '1.76', 'id-btc-usdt', { 'ask': '77685.0339', 'bid': '77576.2966', 'updatedAt': 1787555841861 }, 0.02, 0.12, 0.000073, 3, 8, 4, 4, 'active', 'active', {}, [ 'otc', 'spot' ], { '_id': 'id-btc', 'name': 'BTC' }, {} ],
        ],
    },
};
const otcMarkets = exchange.parseCumulativeMarkets (cumulativeResponse, 'otc');
assert.strictEqual (otcMarkets.length, 2, 'parses cumulative OTC markets');
assert.strictEqual (otcMarkets[0]['symbol'], 'USDT/IRT', 'normalizes TMN and marks OTC symbols');
const otcTicker = exchange.parseTicker (cumulativeResponse['data']['values'][1][3], otcMarkets[1]);
assert.strictEqual (otcTicker['symbol'], 'BTC/USDT', 'parses cumulative OTC ticker symbols');
assert.strictEqual (otcTicker['bid'], 77576.2966, 'parses cumulative OTC best bid');
assert.strictEqual (otcTicker['askVolume'], 0.70202073, 'parses cumulative OTC ask size');

const combinedExchange: any = new asacoine ();
combinedExchange.publicGetV1MarketPairsPricing = async () => response;
combinedExchange.publicGetV1MarketPairsCumulative = async () => cumulativeResponse;
const combinedMarkets = await combinedExchange.fetchMarkets ();
assert.strictEqual (combinedMarkets.length, 2, 'defaults to spot markets when type is omitted');
const combinedTickers = await combinedExchange.fetchTickers ();
assert.strictEqual (Object.keys (combinedTickers).length, 2, 'defaults to spot tickers when type is omitted');

const signed = exchange.sign ('v1/market/pairs/pricing', 'public', 'GET', { 'foo': 'bar' });
assert.strictEqual (signed['url'], 'https://api.asacoine.com/api/v1/market/pairs/pricing?foo=bar', 'sign builds the public request URL');
assert.strictEqual (signed['headers']['Content-Type'], 'application/json', 'sign supplies the JSON content header');
