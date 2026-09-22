'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class zarpin
 * @augments Exchange
 */
class zarpin extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'zarpin',
            'name': 'Zarpin',
            'countries': ['IR'],
            'rateLimit': 1000,
            'version': 'v1',
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'fetchMarkets': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'otc': true,
            },
            'options': {
                'defaultType': 'otc',
            },
            'urls': {
                'api': {
                    'public': 'https://api-khazaneh.zarpin.com',
                },
                'www': 'https://zarpin.com',
                'doc': 'https://api-khazaneh.zarpin.com/v1/prc/prices',
            },
            'api': {
                'public': {
                    'get': {
                        'v1/prc/prices': 1,
                    },
                },
            },
        });
    }
    async fetchMarkets(params = {}) {
        const response = await this.publicGetV1PrcPrices(params);
        return this.parseMarkets(response);
    }
    parseMarkets(response) {
        let prices = [];
        if (Array.isArray(response)) {
            prices = response;
        }
        const result = [];
        for (let i = 0; i < prices.length; i++) {
            const price = prices[i];
            const code = this.safeString(price, 'code');
            if (code === 'GOLD_IRT' || code === 'SILVER_IRT') {
                result.push(this.parseMarket(price));
            }
        }
        return result;
    }
    parseMarket(market) {
        const code = this.safeString(market, 'code');
        let base = 'XAG-1G';
        if (code === 'GOLD_IRT') {
            base = 'XAU18';
        }
        const quote = 'IRT';
        return {
            'id': code,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': code,
            'quoteId': quote,
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeNumber(market, 'price') !== undefined,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': undefined,
                'price': undefined,
            },
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': { 'min': undefined, 'max': undefined },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': undefined, 'max': undefined },
            },
            'created': undefined,
            'info': market,
        };
    }
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const response = await this.publicGetV1PrcPrices(params);
        return this.parseTicker(response, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const response = await this.publicGetV1PrcPrices(params);
        const markets = this.parseMarkets(response);
        const result = {};
        for (let i = 0; i < markets.length; i++) {
            const ticker = this.parseTicker(response, markets[i]);
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    parseTicker(response, market = undefined) {
        let prices = [];
        if (Array.isArray(response)) {
            prices = response;
        }
        let price = {};
        for (let i = 0; i < prices.length; i++) {
            const entry = prices[i];
            if (this.safeString(entry, 'code') === market['baseId']) {
                price = entry;
                break;
            }
        }
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': undefined,
            'datetime': undefined,
            'high': this.safeNumber(price, 'max_24h_price'),
            'low': this.safeNumber(price, 'min_24h_price'),
            'bid': this.safeNumber(price, 'price'),
            'bidVolume': undefined,
            'ask': this.safeNumber(price, 'price'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': this.safeNumber(price, 'price_at_in_last_24h'),
            'close': this.safeNumber(price, 'price'),
            'last': this.safeNumber(price, 'price'),
            'previousClose': this.safeNumber(price, 'price_at_in_last_24h'),
            'change': undefined,
            'percentage': this.safeNumber(price, 'price_change_24h'),
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': price,
        }, market);
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + this.implodeParams(path, params);
        const query = this.omit(params, this.extractParams(path));
        if (Object.keys(query).length) {
            url += '?' + this.urlencode(query);
        }
        headers = { 'Accept': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}

exports["default"] = zarpin;
