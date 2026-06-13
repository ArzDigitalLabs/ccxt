import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    spotGetApiPlatformSpotMarketV2Tickers(params?: {}): Promise<implicitReturnType>;
    spotGetApiPlatformSpotMarketV2SymbolTicker(params?: {}): Promise<implicitReturnType>;
    futuresGetApiV1ContractTicker(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
