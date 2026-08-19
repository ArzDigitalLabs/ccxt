from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_market_getgoldprice = publicGetMarketGetGoldPrice = Entry('market/getGoldPrice', 'public', 'GET', {'cost': 1})
