from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v3_prices_crypto = publicGetV3PricesCrypto = Entry('v3/prices/crypto', 'public', 'GET', {'cost': 1})
