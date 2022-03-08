import { DisposeSubscription, EventCallback, IPayload } from "./types";
export declare class APSubscriptions {
    static nextId: number;
    private subscriptions;
    constructor();
    addSubscription: (eventName: string, callback: EventCallback) => DisposeSubscription;
    runCallbacks: (eventName: string, payload: IPayload) => void;
    private advanceNextSubscriptionId;
}
