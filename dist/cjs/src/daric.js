'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Exchange = require('./base/Exchange.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class daric
 * @augments Exchange
 */
class daric extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'daric',
            'name': 'Daric',
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
                    'public': 'https://apie.daric.gold',
                },
                'www': 'https://daric.gold',
                'doc': 'https://apie.daric.gold/public/general/PairList?src=TMN',
            },
            'api': {
                'public': {
                    'get': {
                        'public/general/PairList': 1,
                    },
                },
            },
        });
    }
    async fetchMarkets(params = {}) {
        const response = await this.fetchPairList(params);
        return this.parseMarkets(response);
    }
    fetchPairList(params = {}) {
        return this.publicGetPublicGeneralPairList(this.extend({ 'src': 'TMN' }, params));
    }
    parseMarkets(response) {
        let markets = [];
        if (Array.isArray(response)) {
            markets = response;
        }
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const baseId = this.safeString(market, 'destinationCoinSymbol');
            if (baseId === 'GOLD18' || baseId === 'SILVER') {
                result.push(this.parseMarket(market));
            }
        }
        return result;
    }
    parseMarket(market) {
        const baseId = this.safeString(market, 'destinationCoinSymbol');
        let base = 'XAG';
        if (baseId === 'GOLD18') {
            base = 'XAU18';
        }
        const quote = 'IRT';
        return {
            'id': this.safeString(market, 'id'),
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': this.safeString(market, 'sourceCoinSymbol'),
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
                'price': this.safeInteger(market, 'decimalLength'),
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
        const response = await this.fetchPairList(params);
        return this.parseTicker(response, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const response = await this.fetchPairList(params);
        const result = {};
        const markets = this.parseMarkets(response);
        for (let i = 0; i < markets.length; i++) {
            const ticker = this.parseTicker(response, markets[i]);
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    parseTicker(response, market = undefined) {
        let markets = [];
        if (Array.isArray(response)) {
            markets = response;
        }
        const ticker = this.filterBy(markets, 'destinationCoinSymbol', market['baseId'])[0];
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': undefined,
            'datetime': undefined,
            'high': this.safeNumber(ticker, 'highestRecentOrder'),
            'low': this.safeNumber(ticker, 'lowestRecentOrder'),
            'bid': this.safeNumber(ticker, 'bestBuy'),
            'bidVolume': undefined,
            'ask': this.safeNumber(ticker, 'bestSell'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': this.safeNumber(ticker, 'lastOrderPrice'),
            'last': this.safeNumber(ticker, 'lastOrderPrice'),
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeNumber(ticker, 'change'),
            'average': undefined,
            'baseVolume': this.safeNumber(ticker, 'todayTradeAmount'),
            'quoteVolume': this.safeNumber(ticker, 'todayTradeTotal'),
            'info': ticker,
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

exports["default"] = daric;
