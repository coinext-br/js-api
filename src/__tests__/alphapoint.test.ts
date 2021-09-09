import AlphaPoint, {APSuccess2FAAuthResponse} from '../alphapoint';
import {mockWebSocket} from './test_helper';

describe('AlphaPoint', () => {
  it('connects and calls a service', async () => {
    mockWebSocket.responses.GetProducts = {
      m: 1,
      o: JSON.stringify([{
        ProductId: 1,
        Product: 'BRL'
      }, {
        ProductId: 2,
        Product: 'BTC'
      }, {
        ProductId: 3,
        Product: 'LTC'
      }, {
        ProductId: 4,
        Product: 'ETH'
      }, {
        ProductId: 5,
        Product: 'XRP'
      }, {
        ProductId: 6,
        Product: 'BCH'
      }, {
        ProductId: 7,
        Product: 'USDT'
      }, {
        ProductId: 8,
        Product: 'LINK'
      }, {
        ProductId: 9,
        Product: 'DOGE'
      }, {
        ProductId: 10,
        Product: 'ADA'
      }, {
        ProductId: 11,
        Product: 'EOS'
      }, {
        ProductId: 12,
        Product: 'XLM'
      }])
    };

    const ap = new AlphaPoint();
    await ap.connect();
    const products = await ap.getProducts();
    expect(products && products[0]).toEqual({"ProductId": 1, "Product": "BRL"});
  });

  it('handles system errors', async () => {
    mockWebSocket.responses.GetUserConfig = {
      m: 5,
      o: 'Endpoint not found'
    };
    const ap = new AlphaPoint();
    await ap.connect();
    let failed;
    try {
      await ap.getUserConfigs(33);
      failed = false;
    } catch(e) {
      failed = e;
    }

    expect(failed).toBeTruthy();
  });

  it('handles service errors', async () => {
    mockWebSocket.responses.GetProducts = {
      m: 1,
      o: JSON.stringify({
        "result":false,
        "errormsg":"Invalid Request",
        "errorcode":100,
        "detail":"OMSId is Required"
      })
    };
    const ap = new AlphaPoint();
    await ap.connect();
    let failed;
    try {
      await ap.getProducts();
      failed = false;
    } catch(e) {
      failed = e;
    }

    expect(failed).toBeTruthy();
  });

  it('logs in', async () => {
    mockWebSocket.responses.WebAuthenticateUser = {
      m: 1,
      o: JSON.stringify({
        Authenticated: true,
        SessionToken: "42788801-8828-46ba-a045-df56ac48ee7f",
        UserId: 11,
        twoFaToken: ""
      })
    };

    const ap = new AlphaPoint();
    const result = await ap.connect('me@me.me', 's3cRtZ');
    expect(result.Authenticated).toBeTruthy();
  });

  it('authenticatew 2fa', async () => {
    mockWebSocket.responses.WebAuthenticateUser = {
      m: 1,
      o: JSON.stringify({Authenticated: true, Requires2FA: true})
    };
    mockWebSocket.responses.Authenticate2FA = {
      m: 1,
      o: JSON.stringify({
        Authenticated: true,
        SessionToken: "42788801-8828-46ba-a045-df56ac48ee7f",
        UserId: 11,
        twoFaToken: ""
      })
    };
    const ap = new AlphaPoint();
    await ap.connect('me@me.me', 's3cRtZ');
    const auth: APSuccess2FAAuthResponse = <APSuccess2FAAuthResponse>await ap.authenticate2FA('123');
    expect(auth).toBeTruthy();
    expect(auth.SessionToken).toEqual('42788801-8828-46ba-a045-df56ac48ee7f');
  });
});
