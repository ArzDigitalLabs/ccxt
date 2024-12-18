// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code
// EDIT THE CORRESPONDENT .ts FILE INSTEAD

//  ---------------------------------------------------------------------------
import Exchange from './abstract/twox.js';
//  ---------------------------------------------------------------------------
/**
 * @class twox
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class twox extends Exchange {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'twox',
            'name': 'Twox',
            'country': ['IR'],
            'rateLimit': 1000,
            'version': '1',
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'cancelAllOrders': false,
                'cancelOrder': false,
                'cancelOrders': false,
                'createDepositAddress': false,
                'createOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'editOrder': false,
                'fetchBalance': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDeposits': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchL2OrderBook': false,
                'fetchL3OrderBook': false,
                'fetchLedger': false,
                'fetchLedgerEntry': false,
                'fetchLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': false,
                'fetchOHLCV': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': false,
                'fetchOrders': false,
                'fetchOrderTrades': 'emulated',
                'fetchPositions': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': false,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchWithdrawals': false,
                'setLeverage': false,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'comment': 'This comment is optional',
            'urls': {
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/twox/64x64.png',
                'api': {
                    'public': 'https://api.twox.ir',
                },
                'www': 'https://twox.ir',
                'doc': [
                    'https://twox.ir',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        'api/currencies': 1,
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber('0.001'),
                    'taker': this.parseNumber('0.001'),
                },
            },
        });
    }
    async fetchMarkets(symbols = undefined, params = {}) {
        /**
         * @method
         * @name twox#fetchMarkets
         * @description retrieves data on all markets for twox
         * @see https://api.twox.ir/api/currencies
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetApiCurrencies(params);
        const result = [];
        const quotes = ['IRT', 'USDT'];
        for (let i = 0; i < response.length; i++) {
            const marketData = this.extend({}, response[i]);
            const base = this.safeString(marketData, 'symbol');
            for (let index = 0; index < quotes.length; index++) {
                const quote = quotes[index];
                if (base === quote || marketData['sellPrice'] === 0 || base === 'IRT') {
                    break;
                }
                marketData['base'] = base;
                marketData['quote'] = quote;
                const market = await this.parseMarket(marketData);
                result.push(market);
            }
        }
        return result;
    }
    parseMarket(market) {
        //         {
        // sellPrice: 0,
        // buyPrice: 0,
        // latestPrice: 0,
        // weeklyChart: "https://cdn.twox.trade/currencies/charts/7d/irt_toman.svg?v=2024061017",
        // priceChangePercent: 0,
        // minAmount: 10000,
        // tags: [ ],
        // marketCategories: [ ],
        // id: 1,
        // symbol: "IRT",
        // name: "Toman",
        // icon: "https://cdn.twox.trade/currencies/icons/128x128/irt_toman.png",
        // persianName: "تومان",
        // isStableCoin: false,
        // isActive: true,
        // colorCode: null,
        // type: 0,
        // isNeedRiskWarning: false,
        // assetPrecision: 0,
        // isLeveragedToken: false,
        // commissionPrecision: 0,
        // isDepositAllEnable: true,
        // isTrading: true,
        // isWithdrawAllEnable: true,
        // currencySlug: "IRT_Toman",
        // marketCurrencyId: 0,
        // order: 0
        // },
        let baseId = this.safeString(market, 'base');
        let quoteId = this.safeString(market, 'quote');
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        const id = base + quote;
        baseId = baseId.toLowerCase();
        quoteId = quoteId.toLowerCase();
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': 'spot',
            'spot': true,
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
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': market,
        };
    }
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name twox#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://api.twox.ir/api/currencies
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
        }
        const response = await this.publicGetApiCurrencies(params);
        const result = [];
        const quotes = ['IRT', 'USDT'];
        for (let i = 0; i < response.length; i++) {
            const base = this.safeString(response[i], 'symbol');
            for (let index = 0; index < quotes.length; index++) {
                const quote = quotes[index];
                if (base === quote || response[i]['sellPrice'] === 0 || base === 'IRT') {
                    continue;
                }
                response[i]['base'] = base;
                response[i]['quote'] = quote;
                response[i]['symbol'] = base + quote;
                const ticker = await this.parseTicker(response[i]);
                const symbol = ticker['symbol'];
                result[symbol] = ticker;
            }
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name twox#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://api.twox.ir/api/currencies
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const ticker = await this.fetchTickers([symbol]);
        return ticker[symbol];
    }
    parseTicker(ticker, market = undefined) {
        //         {
        // sellPrice: 0,
        // buyPrice: 0,
        // latestPrice: 0,
        // weeklyChart: "https://cdn.twox.trade/currencies/charts/7d/irt_toman.svg?v=2024061017",
        // priceChangePercent: 0,
        // minAmount: 10000,
        // tags: [ ],
        // marketCategories: [ ],
        // id: 1,
        // symbol: "IRT",
        // name: "Toman",
        // icon: "https://cdn.twox.trade/currencies/icons/128x128/irt_toman.png",
        // persianName: "تومان",
        // isStableCoin: false,
        // isActive: true,
        // colorCode: null,
        // type: 0,
        // isNeedRiskWarning: false,
        // assetPrecision: 0,
        // isLeveragedToken: false,
        // commissionPrecision: 0,
        // isDepositAllEnable: true,
        // isTrading: true,
        // isWithdrawAllEnable: true,
        // currencySlug: "IRT_Toman",
        // marketCurrencyId: 0,
        // order: 0
        // },
        const marketType = 'otc';
        const marketId = this.safeString(ticker, 'symbol');
        const symbol = this.safeSymbol(marketId, market, undefined, marketType);
        let last = this.safeFloat(ticker, 'latestPrice', 0);
        if (ticker['quote'] === 'IRT') {
            last = this.safeFloat(ticker, 'sell_price', 0);
        }
        const change = this.safeFloat(ticker, 'priceChangePercent', 0);
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': change,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const url = this.urls['api']['public'] + '/' + path;
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
