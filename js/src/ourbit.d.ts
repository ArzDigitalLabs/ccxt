import Exchange from './base/Exchange.js';
import { Market, Strings, Ticker, Tickers, Dict } from './base/types.js';
/**
 * @class ourbit
 * @augments Exchange
 */
export default class ourbit extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseSpotMarket(market: any): Market;
    parseFutureMarket(market: any): Market;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    parseTicker(ticker: Dict, market?: Market, marketType?: string): Ticker;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
