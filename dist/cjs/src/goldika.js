'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class goldika
 * @augments Exchange
 */
class goldika extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'goldika',
            'name': 'Goldika',
            'countries': ['IR'],
            'rateLimit': 1000,
            'version': 'v2',
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
                    'public': 'https://api.goldika.ir',
                },
                'www': 'https://goldika.ir',
                'doc': 'https://api.goldika.ir/api/v2/public/price',
            },
            'api': {
                'public': {
                    'get': {
                        'api/v2/public/price': 1,
                    },
                },
            },
        });
    }
    async fetchMarkets(params = {}) {
        const response = await this.publicGetApiV2PublicPrice(params);
        return [this.parseMarket(response)];
    }
    parseMarket(response) {
        const data = this.safeDict(response, 'data', {});
        const oldPrice = this.safeDict(data, 'old_price', {});
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
            'active': true,
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
            'info': oldPrice,
        };
    }
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const response = await this.publicGetApiV2PublicPrice(params);
        return this.parseTicker(response, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const response = await this.publicGetApiV2PublicPrice(params);
        const market = this.market('XAU18/IRT');
        const ticker = this.parseTicker(response, market);
        const result = {};
        result[ticker['symbol']] = ticker;
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    parseTicker(response, market = undefined) {
        const data = this.safeDict(response, 'data', {});
        const oldPrice = this.safeDict(data, 'old_price', {});
        const timestamp = this.parse8601(this.safeString(oldPrice, 'created_at'));
        let bid = this.safeNumber(oldPrice, 'buy');
        let ask = this.safeNumber(oldPrice, 'sell');
        if (bid !== undefined) {
            bid = bid / 10;
        }
        if (ask !== undefined) {
            ask = ask / 10;
        }
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': ask,
            'last': ask,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeNumber(data, 'daily_change_percent'),
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': oldPrice,
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

exports["default"] = goldika;
