from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_pairs_pair = publicGetPairsPair = Entry('pairs/{pair}', 'public', 'GET', {'cost': 1})
