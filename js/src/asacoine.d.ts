import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers } from './base/types.js';
/**
 * @class asacoine
 * @augments Exchange
 */
export default class asacoine extends Exchange {
    describe(): any;
    parseMarket(market: any): Market;
    parseMarkets(response: any): Market[];
    parseCumulativeMarkets(response: any, type?: string): Market[];
    fetchMarkets(params?: {}): Promise<import("./base/types.js").MarketInterface[]>;
    parseTicker(ticker: any, market?: Market): Ticker;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
