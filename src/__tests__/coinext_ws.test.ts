import CoinextWebSocket from "../coinext/coinext_ws";
import { WebSocketServerMock } from "./ws_server_mock";
import { forTimeout } from "../awaits";

describe("CoinextWebSocket", () => {
  let clientSocket: CoinextWebSocket;
  let mockedServer: WebSocketServerMock;

  beforeAll(() => {
    mockedServer = new WebSocketServerMock();
  });

  afterAll(() => {
    mockedServer.closeMockedWSServer();
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

  test("should correctly respond to subscribed events", async () => {
    let receivedValue = 0;

    const subscriptionResponse = await clientSocket.subscribeToEvent(
      "SubscriptionTest",
      "EventTest",
      (p) => {
        receivedValue = p.received as number;
      },
      {}
    );

    expect(subscriptionResponse.firstPayload.received).toBe(1);

    mockedServer.sendEventMessageThroughAllSockets("EventTest", { received: 1 }, 4);

    // Giving time for the event to be processed.
    await forTimeout(100);

    expect(receivedValue).toBe(1);

    await clientSocket.unsubscribeToEvent("UnsubscriptionTest", {});
    subscriptionResponse.dispose();

    mockedServer.sendEventMessageThroughAllSockets("EventTest", { received: 2 }, 8);

    // Giving time for the event to be processed.
    await forTimeout(100);

    expect(receivedValue).toBe(1);
  });

  test("should remove listener after first use", async () => {
    const simpleService = "GetFiveTest";

    const firstResponse = await clientSocket.callExternalApi(simpleService, {});
    expect(firstResponse["value"]).toBe(5);
    expect(clientSocket.getNumberOfListeners(simpleService)).toBe(0);

    const secondResponse = await clientSocket.callExternalApi(simpleService, {});
    expect(secondResponse["value"]).toBe(5);
    expect(clientSocket.getNumberOfListeners(simpleService)).toBe(0);
  });
});
