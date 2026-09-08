import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class goldika
 * @augments Exchange
 */
export default class goldika extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(response: any): Market;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    parseTicker(response: any, market?: Market): Ticker;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
