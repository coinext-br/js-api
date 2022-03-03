import { WebSocketServer } from "ws";
import { SocketOperation } from "../coinext/types";

let server: WebSocketServer | null = null;

interface MockedPackageResponse {
  i?: number;
  n?: string;
  m: number;
  o: string;
}

const responses: { [key: string]: MockedPackageResponse } = {
  Test: {
    m: SocketOperation.Reply,
    o: JSON.stringify({ message: "passed" }),
  },
};

export function runMockedWSServer(port = 8080) {
  console.log(`Mocked WS Server runing on port ${port}...`);

  server = new WebSocketServer({ port: port });

  server.on("connection", (socket) => {
    socket.on("message", (data) => {
      const request = JSON.parse(`${data}`);
      let serviceName = request.n;
      const mockResponse = responses[serviceName];

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

export function closeMockedWSServer() {
  console.log("Closing mocked WS Server...");
  server && server.close();
}
