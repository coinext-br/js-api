export declare enum SocketOperation {
    Request = 0,
    Reply = 1,
    SubscribeToEvent = 2,
    Event = 3,
    UnSubscribeFromEvent = 4,
    Error = 5
}
export type IPayloadRequest = {
    i: number;
    n: IServiceName;
    m: number;
    o: string;
};
export type IServiceName = "AuthenticateUser" | "Authenticate2FA" | "GetUserAccounts" | "GetAccountPositions" | "GetDepositInfo" | "GetInstruments" | "GetL2Snapshot" | "SubscribeAccountEvents" | "GetDeposits" | "GetTickerHistory" | "GetProducts" | "TransferFunds" | string;
export type DepositInfo = {
    productId: number;
    amount: number;
    assetName: string;
    toAddress: string;
    ticketStatus: string;
};
export type ITransferFundsResponse = {
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
export type IGetDepositsResponse = {
    deposits: DepositInfo[];
    isEmpty: boolean;
    errorMessage: string;
};
export type ILoginResponse = {
    accountId: number;
    errorMessage: string;
    authenticated: boolean;
};
export type IDepositInfoResponse = {
    currencyDepositAddress: string[];
    errorMessage: string;
};
export type ISimpleLoginResponse = {
    errorMessage: string;
    authenticated: boolean;
    isAuthenticatorEnabled: boolean;
    token: string;
    userId: number;
};
export type InstrumentSymbol = "BTCBRL" | "USDTBRL" | string;
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
export type ProductName = "BRL" | "BTC" | "LTC" | "ETH" | "XRP" | "BCH" | "USDT" | "LINK" | "DOGE" | "ADA" | "EOS" | "XLM" | "CHZ" | "SUSHI" | "USDC" | "AXS" | "BNB" | string;
export type Product = {
    ProductId: ProductId;
    Product: ProductName;
};
export type IPayload = {
    [key: string]: string | number | boolean | IPayload | IPayload[] | null;
};
export type IInstrument = {
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
export type IApiBookOrderResponse = [
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
export type IBookOrder = {
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
export type IBookOrderResquest = {
    instrumentId: number;
    howMany: number;
    side: OrderSide;
};
export type IBookOrderResponse = {
    orders: IBookOrder[];
    errorMessage: string;
    isEmpty: boolean;
};
export type IInstrumentIdResponse = {
    instrumentId: number;
    errorMessage: string;
};
export type ISubscribeAccountEventsResquest = {
    accountId: number;
};
export type ISubscribeAccountEventsResponse = {
    subscribed: boolean;
};
export interface SubscriptionResponse {
    firstPayload: IPayload;
    dispose: DisposeSubscription;
}
export type EventCallback = (p: IPayload) => void;
export type InstrumentTradeHistory = number[][];
export type DisposeSubscription = () => void;
export interface DefaultAPIResponse {
    result: boolean;
    errormsg: string;
    errorcode: number;
    detail: string;
}
export type SubscribeTickerCallback = (update: InstrumentTradeHistory) => void;
export {};
