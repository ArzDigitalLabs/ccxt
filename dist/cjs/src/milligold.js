'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class milligold
 * @augments Exchange
 */
class milligold extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'milligold',
            'name': 'Milli Gold',
            'countries': ['IR'],
            'rateLimit': 1000,
            'version': '1',
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
                    'public': 'https://milli.gold',
                },
                'www': 'https://milli.gold',
                'doc': 'https://milli.gold',
            },
            'api': {
                'public': {
                    'get': {
                        'api/v1/public/milli-price/external': 1,
                    },
                },
            },
        });
    }
    async fetchMarkets(params = {}) {
        const response = await this.publicGetApiV1PublicMilliPriceExternal(params);
        return [this.parseMarket(response)];
    }
    parseMarket(response) {
        return {
            'id': 'XAU18IRT',
            'symbol': 'XAU18/IRT',
            'base': 'XAU18',
            'quote': 'IRT',
            'settle': undefined,
            'baseId': 'XAU18',
            'quoteId': 'IRT',
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeInteger(response, 'code') === 0,
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
            'info': response,
        };
    }
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const response = await this.publicGetApiV1PublicMilliPriceExternal(params);
        return this.parseTicker(response, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const market = this.market('XAU18/IRT');
        const response = await this.publicGetApiV1PublicMilliPriceExternal(params);
        const ticker = this.parseTicker(response, market);
        const result = {};
        result[ticker['symbol']] = ticker;
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    parseTicker(response, market = undefined) {
        const data = this.safeDict(response, 'data', {});
        const price = this.safeNumber(data, 'price18');
        const date = this.safeString(data, 'date');
        const timestamp = date ? this.parse8601(date) : undefined;
        // The endpoint returns the price of 0.01g; normalize to the 1g XAU18 market price.
        const pricePerGram = price * 100;
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': pricePerGram,
            'bidVolume': undefined,
            'ask': pricePerGram,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': pricePerGram,
            'last': pricePerGram,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': response,
        }, market);
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + this.implodeParams(path, params);
        const query = this.omit(params, this.extractParams(path));
        if (Object.keys(query).length) {
            url += '?' + this.urlencode(query);
        }
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}

exports["default"] = milligold;
