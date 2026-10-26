from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_public_markets = publicGetPublicMarkets = Entry('public/markets', 'public', 'GET', {'cost': 1})
