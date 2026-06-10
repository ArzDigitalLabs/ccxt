//  ---------------------------------------------------------------------------

import Exchange from './abstract/bidarz.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class bidarz
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class bidarz extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'bidarz',
            'name': 'Bidarz',
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
                'otc': true,
                'setLeverage': false,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'comment': 'This comment is optional',
            'urls': {
                'logo': 'https://cdn.arz.digital/cr-odin/img/exchanges/bidarz/64x64.png',
                'api': {
                    'public': 'https://new-api.bidarz.ir',
                },
                'www': 'https://bidarz.ir/',
                'doc': [
                    'https://bidarz.ir/',
                ],
            },
            'api': {
                'public': {
                    'get': {
                        'v1/arz-digital/spot/markets': 1,
                        'v1/arz-digital/otc/markets': 1,
                    },
                },
            },
            'commonCurrencies': {
                'IRR': 'IRT',
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
         * @name bidarz#fetchMarkets
         * @description retrieves data on all markets for bidarz, including spot and OTC markets
         * @see https://new-api.bidarz.ir/v1/arz-digital/spot/markets
         * @see https://new-api.bidarz.ir/v1/arz-digital/otc/markets
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const result = [];
        const spotResponse = await this.publicGetV1ArzDigitalSpotMarkets (params);
        const spotData = this.safeDict (spotResponse, 'data', {});
        const spotSymbols = this.safeDict (spotData, 'symbols', {});
        const spotIds = Object.keys (spotSymbols);
        for (let i = 0; i < spotIds.length; i++) {
            const market = this.parseMarket (spotSymbols[spotIds[i]], 'spot');
            result.push (market);
        }
        const otcResponse = await this.publicGetV1ArzDigitalOtcMarkets (params);
        const otcData = this.safeDict (otcResponse, 'data', {});
        const otcSymbols = this.safeDict (otcData, 'symbols', {});
        const otcIds = Object.keys (otcSymbols);
        for (let i = 0; i < otcIds.length; i++) {
            const market = this.parseMarket (otcSymbols[otcIds[i]], 'otc');
            result.push (market);
        }
        return result;
    }

    parseMarket (market, type = 'spot'): Market {
        // spot
        // {
        //     symbol: "BTCIRR",
        //     baseAsset: "BTC",
        //     quoteAsset: "IRR",
        //     price: "128005355600",
        //     minPrice24h: "0",
        //     maxPrice24h: "0",
        //     volume24h: "0",
        //     price24h: "0",
        //     marketIcon: null
        // }
        // otc
        // {
        //     symbol: "BTCIRR",
        //     baseAsset: "BTC",
        //     quoteAsset: "IRR",
        //     buyPrice: "128325368989",
        //     sellPrice: "127685342211"
        // }
        const rawId = this.safeString (market, 'symbol');
        let baseId = this.safeString (market, 'baseAsset');
        let quoteId = this.safeString (market, 'quoteAsset');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        baseId = baseId.toLowerCase ();
        quoteId = quoteId.toLowerCase ();
        const isOtc = (type === 'otc');
        let id = rawId;
        let symbol = base + '/' + quote;
        if (isOtc) {
            id += ':OTC';
            symbol += ':OTC';
        }
        return {
            'id': id,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': isOtc ? 'otc' : 'spot',
            'spot': !isOtc,
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
         * @name bidarz#fetchTickers
         * @description fetches price tickers for multiple markets
         * @see https://new-api.bidarz.ir/v1/arz-digital/spot/markets
         * @see https://new-api.bidarz.ir/v1/arz-digital/otc/markets
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
        }
        const result = {};
        const spotResponse = await this.publicGetV1ArzDigitalSpotMarkets (params);
        const spotData = this.safeDict (spotResponse, 'data', {});
        const spotSymbols = this.safeDict (spotData, 'symbols', {});
        const spotIds = Object.keys (spotSymbols);
        for (let i = 0; i < spotIds.length; i++) {
            const ticker = this.parseTicker (spotSymbols[spotIds[i]], undefined, 'spot');
            result[ticker['symbol']] = ticker;
        }
        const otcResponse = await this.publicGetV1ArzDigitalOtcMarkets (params);
        const otcData = this.safeDict (otcResponse, 'data', {});
        const otcSymbols = this.safeDict (otcData, 'symbols', {});
        const otcIds = Object.keys (otcSymbols);
        for (let i = 0; i < otcIds.length; i++) {
            const ticker = this.parseTicker (otcSymbols[otcIds[i]], undefined, 'otc');
            result[ticker['symbol']] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name bidarz#fetchTicker
         * @description fetches a price ticker, defaulting duplicate raw spot/OTC symbols to the spot market
         * @see https://new-api.bidarz.ir/v1/arz-digital/spot/markets
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const ticker = await this.fetchTickers ([ symbol ], params);
        return ticker[symbol];
    }

    parseTicker (ticker, market: Market = undefined, type = 'spot'): Ticker {
        const isOtc = (type === 'otc');
        let marketId = this.safeString (ticker, 'symbol');
        if (isOtc) {
            marketId += ':OTC';
        }
        const symbol = this.safeSymbol (marketId, market);
        const last = this.convertPrice (this.safeString (ticker, 'price'));
        const bid = this.convertPrice (this.safeString (ticker, 'sellPrice'));
        const ask = this.convertPrice (this.safeString (ticker, 'buyPrice'));
        const high = this.convertPrice (this.safeString (ticker, 'maxPrice24h'));
        const low = this.convertPrice (this.safeString (ticker, 'minPrice24h'));
        const open = this.convertPrice (this.safeString (ticker, 'price24h'));
        const quoteVolume = this.convertPrice (this.safeString (ticker, 'volume24h'));
        let close = last;
        if (isOtc) {
            close = undefined;
        }
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
            'open': open,
            'close': close,
            'last': close,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }

    convertPrice (price) {
        const value = this.parseNumber (price);
        return (value === undefined) ? undefined : value / 10;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        let url = this.urls['api'][api] + '/' + this.implodeParams (path, params);
        if (Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = { 'Content-Type': 'application/json' };
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
