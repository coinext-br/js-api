import { forTimeout } from "../awaits";
import { Coinext } from "../coinext";
import { InstrumentTradeHistory } from "../coinext/types";
import { WebSocketServerMock } from "./ws_server_mock";

describe("Coinext", () => {
  let coinext: Coinext;
  let mockedServer: WebSocketServerMock;

  beforeAll(() => {
    mockedServer = new WebSocketServerMock();
  });

  afterAll(() => {
    mockedServer.closeMockedWSServer();
  });

  beforeEach(async () => {
    coinext = new Coinext();
    return coinext.connect(true);
  });
  afterEach(async () => {
    return coinext.disconnect();
  });

  describe("connect", () => {
    test("initializes coins", async () => {
      expect(coinext.getCoins().length).toBeGreaterThan(10);
    });

    test("initializes isntruments", async () => {
      expect(coinext.getInstruments().length).toBeGreaterThan(10);
    });
  });

  describe("login", () => {
    test("login successful, no 2FA", async () => {
      const { userId, token, isAuthenticatorEnabled, authenticated, errorMessage } = await coinext.login(
        "gandra@gmail.com",
        "hureia123Seca"
      );
      expect(userId).toEqual(11);
      expect(token).toBeTruthy();
      expect(isAuthenticatorEnabled).toBeFalsy();
      expect(authenticated).toBeTruthy();
      expect(errorMessage).toBeFalsy();
    });

    test.skip("bad password", async () => {
      const { userId, token, isAuthenticatorEnabled, authenticated, errorMessage } = await coinext.login(
        "gandra@gmail.com",
        "batata"
      );
      expect(userId).toBeFalsy();
      expect(token).toBeFalsy();
      expect(isAuthenticatorEnabled).toBeFalsy();
      expect(authenticated).toBeFalsy();
      expect(errorMessage).toEqual("Invalid username or password");
    });
  });

  test("getTickerHistory", async () => {
    const insterval = 15 * 60;
    const fromDate = new Date(Date.now() - 1000 * 60 * 60);
    const toDate = new Date();
    const { history } = await coinext.getTickerHistory("BTC", "BRL", insterval, fromDate, toDate);
    expect(history?.length).toEqual(4);
  });

  describe("subscribeToTicker", () => {
    const UPDATES_INTERVAL = 1800;
    const TICKER_HISTORY_SIZE = 60;
    const INSTRUMENT_ID = 1;

    test("should get ticker history from the last 24h", async () => {
      let tickerHistory: InstrumentTradeHistory = [];

      const dispose = await coinext.subscribeToTicker(
        INSTRUMENT_ID,
        UPDATES_INTERVAL,
        TICKER_HISTORY_SIZE,
        (tickerUpdate) => {
          tickerHistory = tickerUpdate;
        }
      );

      // Giving time for the event to be processed.
      await forTimeout(100);

      expect(Object.keys(tickerHistory).length).toBe(59);

      mockedServer.sendEventMessageThroughAllSockets("TickerDataUpdateEvent", [
        [1501603632000, 2700.33, 2687.01, 2687.01, 2687.01, 24.86100992, 0, 2870.95, 2],
      ]);

      // Giving time for the event to be processed.
      await forTimeout(100);

      expect(Object.keys(tickerHistory).length).toBe(1);

      await coinext.unsubscribeToTicker(INSTRUMENT_ID);
      dispose();

      mockedServer.sendEventMessageThroughAllSockets("TickerDataUpdateEvent", [
        [1501603632000, 2700.33, 2687.01, 2687.01, 2687.01, 24.86100992, 0, 2870.95, 1],
        [1501603632000, 2700.33, 2687.01, 2687.01, 2687.01, 24.86100992, 0, 2870.95, 1],
      ]);

      // Giving time for the event to be processed.
      await forTimeout(100);

      expect(Object.keys(tickerHistory).length).toBe(1);
    });
  });
});
