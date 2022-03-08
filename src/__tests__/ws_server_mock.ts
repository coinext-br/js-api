import { WebSocketServer } from "ws";
import { SocketOperation } from "../coinext/types";
import DEFAULT_TICKER_SUBSCRIPTION from "../__fixures__/ticker_subscription";
import DEFAULT_INSTRUMENTS from "../__fixures__/instruments";
import DEFAULT_PRODUCTS from "../__fixures__/products";
import DEFAULT_TICKER_HISTORY from "../__fixures__/ticker_history";

interface MockedPackageResponse {
  i?: number;
  n?: string;
  m: number;
  o: string;
}

export class WebSocketServerMock {
  private server: WebSocketServer | null = null;
  private responses: { [key: string]: MockedPackageResponse } = {
    Test: {
      m: SocketOperation.Reply,
      o: JSON.stringify({ message: "passed" }),
    },
    SubscriptionTest: {
      m: SocketOperation.Reply,
      o: JSON.stringify({ received: 1 }),
    },
    UnsubscriptionTest: {
      m: SocketOperation.Reply,
      o: JSON.stringify({}),
    },
    GetFiveTest: {
      m: SocketOperation.Reply,
      o: JSON.stringify({ value: 5 }),
    },
    GetInstruments: {
      m: SocketOperation.Reply,
      o: JSON.stringify(DEFAULT_INSTRUMENTS),
    },
    GetProducts: {
      m: SocketOperation.Reply,
      o: JSON.stringify(DEFAULT_PRODUCTS),
    },
    AuthenticateUser: {
      m: SocketOperation.Reply,
      o: JSON.stringify({
        errormsg: "",
        Authenticated: true,
        Requires2FA: false,
        SessionToken: "12",
        User: { UserId: 11 },
      }),
    },
    GetTickerHistory: {
      m: SocketOperation.Reply,
      o: JSON.stringify(DEFAULT_TICKER_HISTORY),
    },
    SubscribeTicker: {
      m: SocketOperation.Reply,
      o: JSON.stringify(DEFAULT_TICKER_SUBSCRIPTION),
    },
    UnsubscribeTicker: {
      m: SocketOperation.Reply,
      o: JSON.stringify({
        result: true,
        errormsg: null,
        errorcode: 0,
        detail: null,
      }),
    },
  };

  constructor(port = 8080) {
    console.log(`Mocked WS Server runing on port ${port}...`);

    this.server = new WebSocketServer({ port: port });

    this.server.on("connection", (socket) => {
      socket.on("message", (data) => {
        const request = JSON.parse(`${data}`);
        let serviceName = request.n;
        const mockResponse = this.responses[serviceName];

        const response = mockResponse && (mockResponse.o || "Endpoint not found!");

        socket.send(
          JSON.stringify({
            m: mockResponse.m,
            i: request.i,
            n: serviceName,
            o: response,
          })
        );
      });
    });
  }

  closeMockedWSServer() {
    console.log("Closing mocked WS Server...");
    this.server && this.server.close();
    this.server = null;
  }

  sendEventMessageThroughAllSockets(serviceName: string, payload: any, i = 2) {
    if (this.server) {
      for (const sockets of Array.from(this.server.clients)) {
        sockets.send(
          JSON.stringify({
            m: SocketOperation.Event,
            i: i,
            n: serviceName,
            o: JSON.stringify(payload),
          })
        );
      }
    }
  }
}
