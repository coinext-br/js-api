import {Coinext} from "../coinext";


describe('Coinext', () => {
  let coinext: Coinext;

  beforeEach(async () => {
    coinext = new Coinext();
    await coinext.connect();
  });
  afterEach(async () => {
    await coinext.disconnect();
  });

  describe('connect', () => {
    test('initializes coins', async () => {
      expect(coinext.getCoins().length).toBeGreaterThan(10);
    });

    test('initializes isntruments', async () => {
      expect(coinext.getInstruments().length).toBeGreaterThan(10);
    });
  });

  describe('login', () => {
    test('login successful, no 2FA', async () => {
      const {
        userId,
        token,
        isAuthenticatorEnabled,
        authenticated,
        errorMessage
      } = await coinext.login('gandra@gmail.com', 'hureia123Seca');
      expect(userId).toEqual(11);
      expect(token).toBeTruthy();
      expect(isAuthenticatorEnabled).toBeFalsy();
      expect(authenticated).toBeTruthy();
      expect(errorMessage).toBeFalsy();
    });

    test('bad password', async () => {
      const {
        userId,
        token,
        isAuthenticatorEnabled,
        authenticated,
        errorMessage
      } = await coinext.login('gandra@gmail.com', 'batata');
      expect(userId).toBeFalsy();
      expect(token).toBeFalsy();
      expect(isAuthenticatorEnabled).toBeFalsy();
      expect(authenticated).toBeFalsy();
      expect(errorMessage).toEqual('Invalid username or password');
    });
  });

  test('getTickerHistory', async () => {
    const insterval = 15 * 60;
    const fromDate = new Date(Date.now() - 1000 * 60 * 60);
    const toDate = new Date();
    const {history} = await coinext.getTickerHistory('BTC', insterval, fromDate, toDate);
    expect(history?.length).toEqual(4);
  });
});
