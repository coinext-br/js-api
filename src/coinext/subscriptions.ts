import { DisposeSubscription, EventCallback, IPayload } from "./types";

export class APSubscriptions {
  static nextId = 0;

  private subscriptions: Map<string, Map<number, EventCallback>>;

  constructor() {
    this.subscriptions = new Map<string, Map<number, EventCallback>>();
  }

  addSubscription = (eventName: string, callback: EventCallback): DisposeSubscription => {
    this.advanceNextSubscriptionId();
    const subscriptionId = APSubscriptions.nextId;

    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, new Map<number, EventCallback>());
    }

    const eventSubscriptions = this.subscriptions.get(eventName);

    eventSubscriptions!.set(subscriptionId, callback);

    return () => {
      eventSubscriptions!.delete(subscriptionId);
    };
  };

  runCallbacks = (eventName: string, payload: IPayload) => {
    if (this.subscriptions.has(eventName)) {
      for (const callback of this.subscriptions.get(eventName)!.values()) {
        callback(payload);
      }
    }
  };

  private advanceNextSubscriptionId = () => {
    APSubscriptions.nextId ++;
  }
}
