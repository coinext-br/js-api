import { IPayload, IServiceName, SubscriptionResponse } from "./types";
declare class CoinextWebSocket {
    private index;
    private minimumSystemIndexIncrement;
    private socket;
    private isTestEnvironment;
    private subscriptions;
    constructor(isTestEnvironment?: boolean);
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    callExternalApi: (apiServiceName: IServiceName, payload: IPayload) => Promise<IPayload>;
    subscribeToEvent: (apiServiceName: IServiceName, apiEventName: string, callback: (payload: any) => void, payload: IPayload) => Promise<SubscriptionResponse>;
    unsubscribeToEvent: (apiUnsubscribeServiceName: IServiceName, payload: IPayload) => Promise<void>;
    getNumberOfListeners: (serviceName: string) => number;
}
export default CoinextWebSocket;
