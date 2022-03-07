import { IPayload, IServiceName, SubscriptionResponse } from "./types";
declare class CoinextWebSocket {
    private index;
    private minimumSystemIndexIncrement;
    private socket;
    private isTestEnvironment;
    private eventListeners;
    constructor(isTestEnvironment?: boolean);
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    callExternalApi: (apiServiceName: IServiceName, payload: IPayload) => Promise<IPayload>;
    subscribeToEvent: (apiServiceName: IServiceName, apiEventName: string, callback: (payload: IPayload) => void, payload: IPayload) => Promise<SubscriptionResponse>;
    unsubscribeToEvent: (apiUnsubscribeServiceName: IServiceName, apiEventName: string, payload: IPayload) => Promise<void>;
}
export default CoinextWebSocket;
