import WebSocket from "ws";
import config from "../config";
import { EventCallback, IPayload, IPayloadRequest, IServiceName, SocketOperation, SubscriptionResponse } from "./types";

class CoinextWebSocket {
  private index: number = 2;
  private minimumSystemIndexIncrement: number = 2;
  private socket: WebSocket | null = null;
  private isTestEnvironment = false;
  private eventListeners = new Map<string, EventCallback>();

  constructor(isTestEnvironment = false) {
    this.isTestEnvironment = isTestEnvironment;
  }

  connect = async (): Promise<void> => {
    await new Promise<WebSocket>((resolve, reject) => {
      const server = new WebSocket(this.isTestEnvironment ? `${config.API_TEST_URL}` : `${config.API_V2_URL}`);
      server.onopen = async () => {
        this.socket = server;
        this.socket.on("message", (frame: string) => {
          console.log(`New frame received ${frame}`);

          const { m: responseType, n: responseFunction, o: response } = JSON.parse(frame) as IPayloadRequest;
          if (responseType === SocketOperation.Event && this.eventListeners.has(responseFunction)) {
            const eventCallback = this.eventListeners.get(responseFunction) as EventCallback;
            const callbackPayload = JSON.parse(response);
            eventCallback(callbackPayload);
          }
        });
        try {
          resolve(server);
        } catch (e) {
          reject(e);
        }
      };
      server.onerror = function (err: any) {
        reject(err);
      };
    });
  };

  disconnect = async (): Promise<void> => {
    await this.socket?.close();
  };

  callExternalApi = (apiServiceName: IServiceName, payload: IPayload): Promise<IPayload> => {
    const thisRequestIndex = this.index;
    const options = JSON.stringify(payload);

    const payloadRequest: IPayloadRequest = {
      m: SocketOperation.Request,
      i: thisRequestIndex,
      n: apiServiceName,
      o: options,
    };

    const message = JSON.stringify(payloadRequest);
    this.socket!.send(message);
    this.index += this.minimumSystemIndexIncrement;

    return new Promise((resolve, reject) => {
      const listener = (reply: string) => {
        try {
          const {
            m: responseType,
            n: responseFunction,
            o: response,
            i: reponseIndex,
          } = JSON.parse(reply) as IPayloadRequest;

          if (responseType === SocketOperation.Error) {
            reject(JSON.parse(response));
            return;
          }

          if (responseType === SocketOperation.Reply) {
            if (response.length === 0) {
              reject({
                errorMessage: `Response body was empty from service ${apiServiceName}`,
              });
              return;
            }
            if (responseFunction === apiServiceName) {
              if (reponseIndex === thisRequestIndex) {
                this.socket?.removeListener("message", listener);
                resolve(JSON.parse(response));
              }
            }
          }
        } catch (e) {
          this.socket?.removeListener("message", listener);
          reject({
            errorMessage: `Unknown error ${e}`,
          });
        }
      };
      this.socket?.on("message", listener);
    });
  };

  subscribeToEvent = (
    apiServiceName: IServiceName,
    apiEventName: string,
    callback: (payload: IPayload) => void,
    payload: IPayload
  ) => {
    return new Promise<SubscriptionResponse>((resolve, reject) => {
      this.callExternalApi(apiServiceName, payload)
        .then((firstResponse) => {
          this.eventListeners.set(apiEventName, callback);
          resolve({
            firstPayload: firstResponse,
          });
        })
        .catch((e) => {
          console.log(`Error captured while subscribing to service ${apiServiceName}`);
          reject(e);
        });
    });
  };

  unsubscribeToEvent = async (apiUnsubscribeServiceName: IServiceName, apiEventName: string, payload: IPayload) => {
    await this.callExternalApi(apiUnsubscribeServiceName, payload);
    this.eventListeners.delete(apiEventName);
  };

  getNumberOfListeners = (serviceName: string) => {
    return this.socket ? this.socket.listenerCount(serviceName) : 0;
  }
}

export default CoinextWebSocket;
