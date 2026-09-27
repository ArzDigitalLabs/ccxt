from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_public_markets_details = publicGetV1PublicMarketsDetails = Entry('v1/public/markets_details', 'public', 'GET', {'cost': 1})
