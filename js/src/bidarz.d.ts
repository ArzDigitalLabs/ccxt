import Exchange from './abstract/bidarz.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class bidarz
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class bidarz extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: any, type?: string): Market;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    parseTicker(ticker: any, market?: Market, type?: string): Ticker;
    convertPrice(price: any): number;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
