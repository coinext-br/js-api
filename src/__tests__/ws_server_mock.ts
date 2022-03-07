import WebSocket, { WebSocketServer } from "ws";
import { SocketOperation } from "../coinext/types";

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
