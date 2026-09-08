from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_public_general_pairlist = publicGetPublicGeneralPairList = Entry('public/general/PairList', 'public', 'GET', {'cost': 1})
