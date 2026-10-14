import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class poulyar
 * @augments Exchange
 */
export default class poulyar extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: any): Market;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    parseTicker(ticker: any, market?: Market): Ticker;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
