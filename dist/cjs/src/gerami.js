'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class gerami
 * @augments Exchange
 */
class gerami extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'gerami',
            'name': 'Gerami',
            'countries': ['IR'],
            'rateLimit': 1000,
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
                    'public': 'https://api.gerami.com/api/v1',
                },
                'www': 'https://gerami.com',
                'doc': 'https://api.gerami.com/api/v1/pairs/XAU750g_IRT',
            },
            'api': {
                'public': {
                    'get': {
                        'pairs/{pair}': 1,
                    },
                },
            },
        });
    }
    async fetchMarkets(params = {}) {
        const marketIds = ['XAU750g_IRT', 'XAG999g_IRT'];
        const result = [];
        for (let i = 0; i < marketIds.length; i++) {
            const response = await this.publicGetPairsPair(this.extend({
                'pair': marketIds[i],
            }, params));
            result.push(this.parseMarket(response));
        }
        return result;
    }
    parseMarket(response) {
        const data = this.safeDict(response, 'data', {});
        const baseId = this.safeString(data, 'base_symbol');
        const quoteId = this.safeString(data, 'quote_symbol');
        let base = 'XAG-1G';
        if (baseId === 'XAU750g') {
            base = 'XAU18';
        }
        return {
            'id': this.safeString(data, 'market'),
            'symbol': base + '/' + quoteId,
            'base': base,
            'quote': quoteId,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': 'otc',
            'spot': false,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': this.safeBool(data, 'buy_is_active') && this.safeBool(data, 'sell_is_active'),
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber(data, 'amount_precision'),
                'price': this.safeNumber(data, 'price_precision'),
            },
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': {
                    'min': this.safeNumber(data, 'buy_min_amount'),
                    'max': this.safeNumber(data, 'buy_max_amount'),
                },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': undefined, 'max': undefined },
            },
            'created': undefined,
            'info': data,
        };
    }
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const response = await this.publicGetPairsPair(this.extend({
            'pair': market['id'],
        }, params));
        return this.parseTicker(response, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const marketSymbols = ['XAU18/IRT', 'XAG-1G/IRT'];
        const result = {};
        for (let i = 0; i < marketSymbols.length; i++) {
            const market = this.market(marketSymbols[i]);
            const response = await this.publicGetPairsPair(this.extend({
                'pair': market['id'],
            }, params));
            const ticker = this.parseTicker(response, market);
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    parseTicker(response, market = undefined) {
        const data = this.safeDict(response, 'data', {});
        const bid = this.safeNumber(data, 'buy_price');
        const ask = this.safeNumber(data, 'sell_price');
        let last = bid;
        if (ask !== undefined && (last === undefined || ask > last)) {
            last = ask;
        }
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': undefined,
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
            'change': this.safeNumber(data, 'daily_price_change_amount'),
            'percentage': this.safeNumber(data, 'daily_price_change_percentage'),
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': data,
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

exports["default"] = gerami;
