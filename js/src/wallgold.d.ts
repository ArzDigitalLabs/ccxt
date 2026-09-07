import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class wallgold
 * @augments Exchange
 */
export default class wallgold extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    fetchPrice(side: string, params?: {}): any;
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
