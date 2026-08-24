from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_market_pairs_pricing = publicGetV1MarketPairsPricing = Entry('v1/market/pairs/pricing', 'public', 'GET', {'cost': 1})
    public_get_v1_market_pairs_cumulative = publicGetV1MarketPairsCumulative = Entry('v1/market/pairs/cumulative', 'public', 'GET', {'cost': 1})
