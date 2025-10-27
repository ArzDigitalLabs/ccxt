
//  ---------------------------------------------------------------------------

import Exchange from './abstract/tehran_exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class tehran_exchange
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class tehran_exchange extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'tehran_exchange',
            'name': 'Tehran Exchange',
            'countries': [ 'IR' ],
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
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/tehran_exchange/64x64.png',
                'api': {
                    'public': 'https://otc-api.tehran.exchange',
                },
                'www': 'https://tehran.exchange',
                'doc': [
                    'https://tehran.exchange',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        'otc/v1/market/pair': 1,
                        'otc/v1/market/order/pair/price': 1,
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber ('0.0025'),
                    'taker': this.parseNumber ('0.0025'),
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name tehran_exchange#fetchMarkets
         * @description retrieves data on all markets for tehran_exchange
         * @see https://otc-api.tehran.exchange/otc/v1/market/pair
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetOtcV1MarketPair (params);
        const data = this.safeDict (response, 'data', {});
        const pairs = this.safeList (data, 'pairs', []);
        const result = [];
        for (let i = 0; i < pairs.length; i++) {
            const market = this.parseMarket (pairs[i]);
            result.push (market);
        }
        return result;
    }

    parseMarket (market): Market {
        // {
        //     "id": 6054,
        //     "pair": "HBAR_USDT",
        //     "status": "TRADABLE",
        //     "tradable": true,
        //     "fiatOrder": false,
        //     "quoteName": "Tether",
        //     "baseName": "Hedera",
        //     "quoteNameFa": "تتر",
        //     "baseNameFa": "هدرا هش گراف ",
        //     "quoteImageUrl": "https://s3-dev.tehranex.com/asset/coin_icon/64/usdt.png",
        //     "baseImageUrl": "https://s3-dev.tehranex.com/asset/coin_icon/64/hbar.png",
        //     "quoteSymbol": "USDT",
        //     "baseSymbol": "HBAR",
        //     "amountPrecision": 2,
        //     "feePercentage": 0.25,
        //     "providerFeePercentage": 0.05,
        //     "maxQuoteAmount": 600000,
        //     "minBaseAmount": 0.01,
        //     "minQuoteAmount": 1,
        //     "pricePrecision": 5,
        //     "baseVirtualCurrencyId": 989,
        //     "quoteVirtualCurrencyId": 1
        // }
        const id = this.safeString (market, 'pair');
        const baseId = this.safeString (market, 'baseSymbol');
        const quoteId = this.safeString (market, 'quoteSymbol');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const status = this.safeString (market, 'status');
        const tradable = this.safeBool (market, 'tradable', false);
        const active = (status === 'TRADABLE') && tradable;
        const amountPrecision = this.safeInteger (market, 'amountPrecision');
        const pricePrecision = this.safeInteger (market, 'pricePrecision');
        const minBaseAmount = this.safeString (market, 'minBaseAmount');
        const minQuoteAmount = this.safeString (market, 'minQuoteAmount');
        const maxQuoteAmount = this.safeString (market, 'maxQuoteAmount');
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
            'active': active,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': amountPrecision,
                'price': pricePrecision,
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': this.parseNumber (minBaseAmount),
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': this.parseNumber (minQuoteAmount),
                    'max': this.parseNumber (maxQuoteAmount),
                },
            },
            'created': undefined,
            'info': market,
        };
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name tehran_exchange#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://otc-api.tehran.exchange/otc/v1/market/pair
         * @see https://otc-api.tehran.exchange/otc/v1/market/order/pair/price
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await this.publicGetOtcV1MarketPair (params);
        const data = this.safeDict (response, 'data', {});
        const pairs = this.safeList (data, 'pairs', []);
        // filter symbols from pairs
        const filteredPairs = [];
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            const pairId = this.safeString (pair, 'pair');
            const symbol = this.safeSymbol (pairId);
            if (symbols.includes (symbol)) {
                filteredPairs.push (pair);
            }
        }
        const result = {};
        for (let i = 0; i < filteredPairs.length; i++) {
            const pairData = filteredPairs[i];
            const pairId = this.safeString (pairData, 'pair');
            // Fetch BUY price
            const request = {
                'pair': pairId,
                'side': 'BUY',
                'basedOn': 'BASE',
                'amount': 1,
            };
            const priceResponse = await this.publicGetOtcV1MarketOrderPairPrice (request);
            const priceData = this.safeDict (priceResponse, 'data', {});
            const price = this.safeFloat (priceData, 'price', 0);
            pairData['price'] = price;
            const ticker = this.parseTicker (pairData);
            const symbol = ticker['symbol'];
            result[symbol] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name tehran_exchange#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://otc-api.tehran.exchange/otc/v1/market/pair
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const ticker = await this.fetchTickers ([ symbol ]);
        return ticker[this.safeSymbol (symbol)];
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        // {
        //     "id": 6054,
        //     "pair": "HBAR_USDT",
        //     "status": "TRADABLE",
        //     "tradable": true,
        //     "baseSymbol": "HBAR",
        //     "quoteSymbol": "USDT",
        //     ...
        //     "price": 12345,
        // }
        const marketType = 'spot';
        const baseSymbol = this.safeString (ticker, 'baseSymbol');
        const quoteSymbol = this.safeString (ticker, 'quoteSymbol');
        const marketId = baseSymbol + '/' + quoteSymbol;
        const symbol = this.safeSymbol (marketId, market, undefined, marketType);
        const price = this.safeFloat (ticker, 'price');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': price,
            'bidVolume': undefined,
            'ask': price,
            'askVolume': undefined,
            'open': undefined,
            'close': price,
            'last': price,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let url = this.urls['api']['public'] + '/' + path;
        if (Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
