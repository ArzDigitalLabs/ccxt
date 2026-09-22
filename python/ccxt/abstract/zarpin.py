from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_prc_prices = publicGetV1PrcPrices = Entry('v1/prc/prices', 'public', 'GET', {'cost': 1})
