import CoinextWebSocket from "../coinext/coinext_ws";
import { closeMockedWSServer, runMockedWSServer } from "./ws_server_mock";

describe("CoinextWebSocket", () => {
  let clientSocket: CoinextWebSocket;

  beforeAll(() => {
    runMockedWSServer();
  });

  afterAll(() => {
    closeMockedWSServer();
  });

  beforeEach(async () => {
    clientSocket = new CoinextWebSocket(true);
    return clientSocket.connect();
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  test("should correctly listen to a response from an api call", async () => {
    const response = await clientSocket.callExternalApi("Test", {});
    expect(response["message"]).toBe("passed");
  });
});
