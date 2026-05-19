import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    publicGetApiV1MarketSymbols(params?: {}): Promise<implicitReturnType>;
    publicGetApiV1MarketSymbolsSymbol(params?: {}): Promise<implicitReturnType>;
    publicGetApiV1MarketDepthSymbol(params?: {}): Promise<implicitReturnType>;
    publicGetApiV1Market(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
