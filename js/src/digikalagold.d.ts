import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class digikalagold
 * @augments Exchange
 */
export default class digikalagold extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    fetchPrice(params?: {}): Promise<any>;
    parseMarketEntry(response: any, id: string): Market;
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
