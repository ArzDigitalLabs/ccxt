from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v2_prices = publicGetV2Prices = Entry('v2/prices', 'public', 'GET', {'cost': 1})
