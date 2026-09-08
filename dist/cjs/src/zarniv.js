'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class zarniv
 * @augments Exchange
 */
class zarniv extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'zarniv',
            'name': 'Zarniv',
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
                    'public': 'https://zarniv.ir',
                },
                'www': 'https://zarniv.ir',
                'doc': 'https://zarniv.ir/user/get_gold_price/',
            },
            'api': {
                'public': {
                    'get': {
                        'user/get_gold_price': 1,
                        'user/get_silver_price': 1,
                    },
                },
            },
        });
    }
    fetchPrice(metal, params = {}) {
        if (metal === 'gold') {
            return this.publicGetUserGetGoldPrice(params);
        }
        return this.publicGetUserGetSilverPrice(params);
    }
    async fetchMarkets(params = {}) {
        const goldResponse = await this.fetchPrice('gold', params);
        const silverResponse = await this.fetchPrice('silver', params);
        return [
            this.parseMarketEntry(goldResponse, 'gold'),
            this.parseMarketEntry(silverResponse, 'silver'),
        ];
    }
    parseMarketEntry(response, metal) {
        let base = 'XAG';
        if (metal === 'gold') {
            base = 'XAU18';
        }
        const quote = 'IRT';
        return {
            'id': base + quote,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': metal,
            'quoteId': quote,
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeNumber(response, 'base_price_per_gram') !== undefined,
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
        const response = await this.fetchPrice(market['baseId'], params);
        return this.parseTicker(response, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const goldResponse = await this.fetchPrice('gold', params);
        const silverResponse = await this.fetchPrice('silver', params);
        const goldMarket = this.market('XAU18/IRT');
        const silverMarket = this.market('XAG/IRT');
        const goldTicker = this.parseTicker(goldResponse, goldMarket);
        const silverTicker = this.parseTicker(silverResponse, silverMarket);
        const result = {};
        result[goldTicker['symbol']] = goldTicker;
        result[silverTicker['symbol']] = silverTicker;
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    parseTicker(response, market = undefined) {
        const serverTime = this.safeString(response, 'server_time');
        let timestamp = undefined;
        if (serverTime !== undefined) {
            timestamp = this.parse8601(serverTime + '+03:30');
        }
        const bid = this.safeNumber(response, 'sell_price_per_gram');
        const ask = this.safeNumber(response, 'buy_price_per_gram');
        const last = this.safeNumber(response, 'base_price_per_gram');
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
            'close': last,
            'last': last,
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
        headers = { 'Accept': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}

exports["default"] = zarniv;
