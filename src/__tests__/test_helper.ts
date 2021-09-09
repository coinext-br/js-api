import {Server} from "mock-socket";
import config from "../config";

export interface MockedPackageResponse {
  i?: number,
  n?: string,
  m: number,
  o: string
}

interface APResponseMap {
  [key: string]: MockedPackageResponse
}

interface MockedWebSocket {
  server?: Server,
  responses: APResponseMap
}

export const mockWebSocket: MockedWebSocket = {
  responses: {}
};

beforeAll(async () => {
  const fakeURL = config.API_V2_URL;
  mockWebSocket.server = new Server(fakeURL);
  mockWebSocket.server.on('connection', socket => {
    socket.on('message', data => {
      const request = JSON.parse(`${data}`);
      let serviceName = request.n;
      const mockResponse = mockWebSocket.responses[serviceName];

      const response = mockResponse && (mockResponse.o || 'Endpoint not found!');

      socket.send(JSON.stringify({
        m: mockResponse.m,
        i: request.i,
        n: serviceName,
        o: response
      }));
    });
  });
});

afterAll(async () => {
  mockWebSocket.server && mockWebSocket.server.stop();
});


beforeEach(async () => {
  mockWebSocket.responses = {};
});
