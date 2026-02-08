from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_otc_v1_market_pair = publicGetOtcV1MarketPair = Entry('otc/v1/market/pair', 'public', 'GET', {'cost': 1})
    public_get_otc_v1_market_order_pair_price = publicGetOtcV1MarketOrderPairPrice = Entry('otc/v1/market/order/pair/price', 'public', 'GET', {'cost': 1})
