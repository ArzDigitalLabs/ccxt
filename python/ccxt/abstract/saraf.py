from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_prices_listed = publicGetV1PricesListed = Entry('v1/prices/listed', 'public', 'GET', {'cost': 1})
