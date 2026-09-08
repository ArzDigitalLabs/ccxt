from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_user_get_gold_price = publicGetUserGetGoldPrice = Entry('user/get_gold_price', 'public', 'GET', {'cost': 1})
    public_get_user_get_silver_price = publicGetUserGetSilverPrice = Entry('user/get_silver_price', 'public', 'GET', {'cost': 1})
