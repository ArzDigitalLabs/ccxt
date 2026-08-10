from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_prices_arzdigital = publicGetV1PricesArzdigital = Entry('v1/prices/arzdigital', 'public', 'GET', {'cost': 1})
