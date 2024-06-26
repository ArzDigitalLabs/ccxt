// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

namespace ccxt;

public partial class hitobit : Exchange
{
    public hitobit (object args = null): base(args) {}

    public async Task<object> publicGetHapiExchangeV1PublicAlltickers24hr (object parameters = null)
    {
        return await this.callAsync ("publicGetHapiExchangeV1PublicAlltickers24hr",parameters);
    }

    public async Task<object> publicGetHapiExchangeV1PublicTicker24hr (object parameters = null)
    {
        return await this.callAsync ("publicGetHapiExchangeV1PublicTicker24hr",parameters);
    }

    public async Task<object> publicGetHapiExchangeV1PublicKlines (object parameters = null)
    {
        return await this.callAsync ("publicGetHapiExchangeV1PublicKlines",parameters);
    }

    public async Task<object> publicGetHapiExchangeV1PublicDepth (object parameters = null)
    {
        return await this.callAsync ("publicGetHapiExchangeV1PublicDepth",parameters);
    }

}