import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    publicGetOtcV1MarketPair(params?: {}): Promise<implicitReturnType>;
    publicGetOtcV1MarketOrderPairPrice(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
