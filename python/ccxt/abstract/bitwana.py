from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_1_markets = publicGetApi1Markets = Entry('api/1/markets', 'public', 'GET', {'cost': 1})
    public_get_api_1_markets_id = publicGetApi1MarketsId = Entry('api/1/markets/{id}', 'public', 'GET', {'cost': 1})
