from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_v2_market_data = publicGetApiV2MarketData = Entry('api/v2/market-data', 'public', 'GET', {'cost': 1})
