import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class hamrahgold
 * @augments Exchange
 */
export default class hamrahgold extends Exchange {
    describe(): any;
    fetchPrice(type: string, params?: {}): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(response: any): Market;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    parseTicker(buyResponse: any, market?: Market, sellResponse?: any): Ticker;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
