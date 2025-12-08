
//  ---------------------------------------------------------------------------

import Exchange from './abstract/iranexchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class iranexchange
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class iranexchange extends Exchange {
    describe () : any {
        return this.deepExtend (super.describe (), {
            'id': 'iranexchange',
            'name': 'Iran Exchange',
            'countries': [ 'IR' ],
            'rateLimit': 1000,
            'version': '1',
            'certified': false,
            'pro': false,
            'timeout': 30000, // milliseconds = seconds * 1000
            'has': {
                'CORS': undefined,
                'spot': false,
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
                'otc': true,
                'setLeverage': false,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'comment': 'This comment is optional',
            'urls': {
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/iran-exchange/64x64.png',
                'api': {
                    'public': 'https://api.iranexchange.com/api/public/modules/crypto',
                },
                'www': 'https://iranexchange.com/',
                'doc': [
                    'https://iranexchange.com/',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        'v1/client/listProduct': 1,
                        'v1/client/getBySymbol': 1,
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber ('0.001'),
                    'taker': this.parseNumber ('0.001'),
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name iranexchange#fetchMarkets
         * @description retrieves data on all markets for iranexchange
         * @see https://iranexchange.co/
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetV1ClientListProduct ();
        const markets = this.safeList (response, 'data');
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = this.parseMarket (markets[i]);
            result.push (market);
        }
        return result;
    }

    parseMarket (market): Market {
        // {
        // _id: "60b08a57b202353abb592032",
        // name: "Bitcoin",
        // fa_name: "بیت کوین",
        // symbol: "BTC",
        // slug: "bitcoin",
        // is_sell_to_customer_active: 1,
        // is_fast_sell_to_customer_active: 1,
        // is_buy_from_customer_active: 1,
        // logo: "https://iranexchange.com/strapi/media/BTC_78d99b9d12.png",
        // dollar_price: 89240.18,
        // sell_to_iranicard_currency_price: 1234526,
        // buy_from_iranicard_currency_price: 1239474,
        // fast_sell_to_iranicard_currency_price: 1234526,
        // buy_from_iranicard_network_list: [
        // {
        // network: "BTC",
        // name: "Bitcoin",
        // addressRegex: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^[(bc1q)|(bc1p)][0-9A-Za-z]{37,62}$",
        // coin: "BTC",
        // withdrawEnable: true,
        // depositEnable: true,
        // withdrawMin: "0.000100000",
        // withdrawMax: null,
        // withdrawFee: "0.000100000",
        // sameAddress: false,
        // memoRegex: null,
        // tradeEnable: true
        // }
        // ],
        // sell_to_iranicard_network_list: [
        // {
        // network: "BTC",
        // name: "Bitcoin",
        // addressRegex: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^[(bc1q)|(bc1p)][0-9A-Za-z]{37,62}$",
        // coin: "BTC",
        // withdrawEnable: true,
        // depositEnable: true,
        // withdrawMin: "0.000100000",
        // withdrawMax: null,
        // withdrawFee: "0.000100000",
        // sameAddress: false,
        // memoRegex: null,
        // tradeEnable: true
        // }
        // ],
        // is_price_maker_active: 1,
        // quotation: {
        // maxPrice: "90199.99",
        // minPrice: "88925",
        // dailyChangePercent: "-0.26"
        // },
        // dailyChangePercent: -0.26,
        // order: 0,
        // stock_status: "in_stock",
        // stock_label: null,
        // stock_description: null
        // },
        const id = this.safeString (market, 'symbol') + '_' + 'IRT';
        let baseId = this.safeString (market, 'symbol');
        let quoteId = 'IRT';
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        baseId = baseId.toLowerCase ();
        quoteId = quoteId.toLowerCase ();
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
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

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name iranexchange#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://iranexchange.co/
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const response = await this.publicGetV1ClientListProduct ();
        const markets = this.safeList (response, 'data');
        const result = {};
        for (let i = 0; i < markets.length; i++) {
            const ticker = this.parseTicker (markets[i]);
            const symbol = ticker['symbol'];
            result[symbol] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name iranexchange#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://iranexchange.co/
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'id': market['base'],
        };
        const response = await this.publicGetV1ClientGetBySymbol (request);
        const marketData = this.safeDict (response, 'data');
        const ticker = this.parseTicker (marketData);
        return ticker;
    }

    parseTicker (ticker, market: Market = undefined): Ticker {
        // {
        // _id: "60b08a57b202353abb592032",
        // name: "Bitcoin",
        // fa_name: "بیت کوین",
        // symbol: "BTC",
        // slug: "bitcoin",
        // is_sell_to_customer_active: 1,
        // is_fast_sell_to_customer_active: 1,
        // is_buy_from_customer_active: 1,
        // logo: "https://iranexchange.com/strapi/media/BTC_78d99b9d12.png",
        // dollar_price: 89240.18,
        // sell_to_iranicard_currency_price: 1234526,
        // buy_from_iranicard_currency_price: 1239474,
        // fast_sell_to_iranicard_currency_price: 1234526,
        // buy_from_iranicard_network_list: [
        // {
        // network: "BTC",
        // name: "Bitcoin",
        // addressRegex: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^[(bc1q)|(bc1p)][0-9A-Za-z]{37,62}$",
        // coin: "BTC",
        // withdrawEnable: true,
        // depositEnable: true,
        // withdrawMin: "0.000100000",
        // withdrawMax: null,
        // withdrawFee: "0.000100000",
        // sameAddress: false,
        // memoRegex: null,
        // tradeEnable: true
        // }
        // ],
        // sell_to_iranicard_network_list: [
        // {
        // network: "BTC",
        // name: "Bitcoin",
        // addressRegex: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^[(bc1q)|(bc1p)][0-9A-Za-z]{37,62}$",
        // coin: "BTC",
        // withdrawEnable: true,
        // depositEnable: true,
        // withdrawMin: "0.000100000",
        // withdrawMax: null,
        // withdrawFee: "0.000100000",
        // sameAddress: false,
        // memoRegex: null,
        // tradeEnable: true
        // }
        // ],
        // is_price_maker_active: 1,
        // quotation: {
        // maxPrice: "90199.99",
        // minPrice: "88925",
        // dailyChangePercent: "-0.26"
        // },
        // dailyChangePercent: -0.26,
        // order: 0,
        // stock_status: "in_stock",
        // stock_label: null,
        // stock_description: null
        // }
        const marketType = 'otc';
        const marketId = this.safeString (ticker, 'symbol') + '_' + 'IRT';
        const symbol = this.safeSymbol (marketId, market, undefined, marketType);
        const quotation = this.safeValue (ticker, 'quotation', {});
        const high = this.safeFloat (quotation, 'maxPrice', 0);
        const low = this.safeFloat (quotation, 'minPrice', 0);
        const bid = this.safeFloat (ticker, 'sell_to_iranicard_currency_price', 0);
        const ask = this.safeFloat (ticker, 'buy_from_iranicard_currency_price', 0);
        const last = this.safeFloat (ticker, 'sell_to_iranicard_currency_price', 0);
        const change = this.safeFloat (quotation, 'dailyChangePercent', 0);
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'open': last,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': change,
            'percentage': change,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let url = this.urls['api']['public'] + '/' + path + '?' + this.urlencode (query);
        const pair_id = this.safeString (params, 'id');
        if (pair_id !== undefined) {
            url = this.urls['api']['public'] + '/' + path + '/' + pair_id;
        }
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
