declare type IServiceName = 'AuthenticateUser' | 'Authenticate2FA' | 'GetUserAccounts' | 'GetAccountPositions' | 'GetDepositInfo' | 'GetInstruments' | 'GetL2Snapshot' | 'SubscribeAccountEvents' | 'GetDeposits' | 'GetTickerHistory' | 'GetProducts' | 'TransferFunds';
export declare type DepositInfo = {
    productId: number;
    amount: number;
    assetName: string;
    toAddress: string;
    ticketStatus: string;
};
export declare type ITransferFundsResponse = {
    success: boolean;
    errorMessage: string;
    details: {
        transferId: number;
        senderAccountId: number;
        senderUserName: string;
        receiverAccountId: number;
        receiverUserName: string;
        productId: number;
        amount: number;
        notes: string;
        omsId: number;
        reason: string;
        transferState: string;
        createdTimeInTicks: number;
        lastUpdatedTimeInTicks: number;
    } | null;
};
export declare type IGetDepositsResponse = {
    deposits: DepositInfo[];
    isEmpty: boolean;
    errorMessage: string;
};
export declare type ILoginResponse = {
    accountId: number;
    errorMessage: string;
    authenticated: boolean;
};
export declare type IDepositInfoResponse = {
    currencyDepositAddress: string[];
    errorMessage: string;
};
export declare type ISimpleLoginResponse = {
    errorMessage: string;
    authenticated: boolean;
    isAuthenticatorEnabled: boolean;
    token: string;
    userId: number;
};
export declare type InstrumentSymbol = 'BTCBRL' | 'USDTBRL' | string;
declare enum ProductId {
    Blr = 1,
    Btc = 2,
    Ltc = 3,
    Eth = 4,
    Xrp = 5,
    Bch = 6,
    Ustd = 7,
    Link = 8,
    Doge = 9,
    Ada = 10,
    Eos = 11,
    Xlm = 12
}
export declare type ProductName = 'BRL' | 'BTC' | 'LTC' | 'ETH' | 'XRP' | 'BCH' | 'USDT' | 'LINK' | 'DOGE' | 'ADA' | 'EOS' | 'XLM' | 'CHZ' | 'SUSHI' | 'USDC' | 'AXS' | 'BNB';
export declare type Product = {
    ProductId: ProductId;
    Product: ProductName;
};
export declare type IPayload = {
    [key: string]: string | number | boolean | IPayload | IPayload[] | null;
};
export declare type IInstrument = {
    OMSId: number;
    InstrumentId: number;
    Symbol: string;
    Product1: number;
    Product1Symbol: string;
    Product2: number;
    Product2Symbol: string;
    InstrumentType: string;
    VenueInstrumentId: number;
    VenueId: number;
    SortIndex: number;
    SessionStatus: string;
    PreviousSessionStatus: string;
    SessionStatusDateTime: string;
    SelfTradePrevention: boolean;
    QuantityIncrement: number;
    PriceIncrement: number;
    MinimumQuantity: number;
    MinimumPrice: number;
    VenueSymbol: string;
    IsDisable: boolean;
    MasterDataId: number;
    PriceCollarThreshold: number;
    PriceCollarPercent: number;
    PriceCollarEnabled: boolean;
    PriceFloorLimit: number;
    PriceFloorLimitEnabled: boolean;
    PriceCeilingLimit: number;
    PriceCeilingLimitEnabled: boolean;
    CreateWithMarketRunning: boolean;
    AllowOnlyMarketMakerCounterParty: boolean;
    PriceCollarIndexDifference: number;
    PriceCollarConvertToOtcEnabled: boolean;
    PriceCollarConvertToOtcClientUserId: number;
    PriceCollarConvertToOtcAccountId: number;
    PriceCollarConvertToOtcThreshold: number;
    OtcConvertSizeThreshold: number;
    OtcConvertSizeEnabled: boolean;
    OtcTradesPublic: boolean;
    PriceTier: number;
};
export declare enum OrderType {
    New = 1,
    Update = 2,
    Delete = 3
}
export declare enum OrderSide {
    Buy = 0,
    Sell = 1,
    Short = 2,
    Unknown = 3
}
export declare type IApiBookOrderResponse = [
    number,
    number,
    number,
    OrderType,
    number,
    number,
    number,
    number,
    number,
    OrderSide
];
export declare type IBookOrder = {
    updateId: number;
    uniqueAccountsQuantity: number;
    posixActionDateTime: number;
    type: OrderType;
    lastTradePrice: number;
    numberOfOrders: number;
    price: number;
    instrumentId: number;
    quantity: number;
    side: OrderSide;
};
export declare type IBookOrderResquest = {
    instrumentId: number;
    howMany: number;
    side: OrderSide;
};
export declare type IBookOrderResponse = {
    orders: IBookOrder[];
    errorMessage: string;
    isEmpty: boolean;
};
export declare type IInstrumentIdResponse = {
    instrumentId: number;
    errorMessage: string;
};
export declare type ISubscribeAccountEventsResquest = {
    accountId: number;
};
export declare type ISubscribeAccountEventsResponse = {
    subscribed: boolean;
};
declare class Coinext {
    private index;
    private omsId;
    private minimumSystemIndexIncrement;
    private socket;
    private products;
    private instruments;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getCoins: () => ProductName[];
    getInstruments: () => IInstrument[];
    refreshProductsAndInstruments: () => Promise<void>;
    private callExternalApi;
    private static createSha256Signature;
    private static authPayload;
    login: (username: string, password: string) => Promise<ISimpleLoginResponse>;
    loginBySecret: () => Promise<ILoginResponse>;
    getCurrencyDepositAddress: (accountId: number, productName: ProductName) => Promise<IDepositInfoResponse>;
    subscribeToAccountEvents: ({ accountId, }: ISubscribeAccountEventsResquest) => Promise<ISubscribeAccountEventsResponse>;
    getBookOrders: ({ instrumentId, howMany, side }: IBookOrderResquest) => Promise<IBookOrderResponse>;
    getInstrumentIdBySymbol: (instrumentSymbol: InstrumentSymbol) => Promise<IInstrumentIdResponse>;
    safeCall(serviceName: IServiceName, payload: IPayload): Promise<{
        response: IPayload;
        errorMessage: string;
    } | {
        errorMessage: string;
        response?: undefined;
    }>;
    getTickerHistory: (coin: string, intervalInSeconds: number, fromDate: Date, toDate: Date) => Promise<{
        history: IPayload | undefined;
        errorMessage: string;
    } | {
        history: never[];
        errorMessage: string;
    }>;
    private instrumentForCoin;
    getDeposits: (accountId: number) => Promise<IGetDepositsResponse>;
    transferFunds: (senderAccountId: number, productName: ProductName, receiverUsername: string, amount: number, notes: string) => Promise<ITransferFundsResponse>;
}
export { Coinext };
