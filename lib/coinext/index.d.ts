import { DefaultAPIResponse, DisposeSubscription, IBookOrderResponse, IBookOrderResquest, IDepositInfoResponse, IGetDepositsResponse, IInstrument, IInstrumentIdResponse, ILoginResponse, InstrumentSymbol, IPayload, IServiceName, ISimpleLoginResponse, ISubscribeAccountEventsResponse, ISubscribeAccountEventsResquest, ITransferFundsResponse, ProductName, SubscribeTickerCallback } from "./types";
declare class Coinext {
    private omsId;
    private socket;
    private products;
    private instruments;
    connect: (isTestEnvironment?: boolean) => Promise<void>;
    disconnect: () => Promise<void>;
    getCoins: () => string[];
    getInstruments: () => IInstrument[];
    refreshProductsAndInstruments: () => Promise<void>;
    private static createSha256Signature;
    private static authPayload;
    login: (username: string, password: string) => Promise<ISimpleLoginResponse>;
    loginBySecret: () => Promise<ILoginResponse>;
    getCurrencyDepositAddress: (accountId: number, productName: ProductName) => Promise<IDepositInfoResponse>;
    subscribeToAccountEvents: ({ accountId, }: ISubscribeAccountEventsResquest) => Promise<ISubscribeAccountEventsResponse>;
    getBookOrders: ({ instrumentId, howMany, side }: IBookOrderResquest) => Promise<IBookOrderResponse>;
    getInstrumentIdBySymbol: (instrumentSymbol: InstrumentSymbol) => Promise<IInstrumentIdResponse>;
    safeCall(serviceName: IServiceName, payload: IPayload): Promise<{
        response: IPayload | undefined;
        errorMessage: string;
    } | {
        errorMessage: string;
        response?: undefined;
    }>;
    getTickerHistory: (coin: string, quoteCoin: string, intervalInSeconds: number, fromDate: Date, toDate: Date) => Promise<{
        history: IPayload | undefined;
        errorMessage: string;
    } | {
        history: never[];
        errorMessage: string;
    }>;
    private instrumentForCoin;
    getDeposits: (accountId: number) => Promise<IGetDepositsResponse>;
    transferFunds: (senderAccountId: number, productName: ProductName, receiverUsername: string, amount: number, notes: string) => Promise<ITransferFundsResponse>;
    subscribeToTicker: (instrumentId: number, secondsBetweenData: number, lengthOfTickerHistory: number, callback: SubscribeTickerCallback) => Promise<DisposeSubscription>;
    unsubscribeToTicker: (instrumentId: number) => Promise<DefaultAPIResponse>;
}
export { Coinext };
