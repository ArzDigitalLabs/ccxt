from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_v1_client_listproduct = publicGetV1ClientListProduct = Entry('v1/client/listProduct', 'public', 'GET', {'cost': 1})
    public_get_v1_client_getbysymbol = publicGetV1ClientGetBySymbol = Entry('v1/client/getBySymbol', 'public', 'GET', {'cost': 1})
