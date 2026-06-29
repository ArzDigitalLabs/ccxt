import Exchange from './abstract/bitwana.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class bitwana
 * @augments Exchange
 * @description Set rateLimit to 1000 if fully verified
 */
export default class bitwana extends Exchange {
    describe(): any;
    parseMarket(market: any): Market;
    fetchMarkets(params?: {}): Promise<Market[]>;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    parseTicker(ticker: any, market?: Market): Ticker;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
