/// <reference types="rx-core-binding" />
import rx from 'rx';
export declare const websocketSubjects: {
    instance: rx.BehaviorSubject<WebSocket | null>;
    connect: rx.BehaviorSubject<{
        kind: string;
    } | null>;
    close: rx.BehaviorSubject<{
        kind: string;
    } | null>;
    message: rx.BehaviorSubject<{
        data: string;
    } | null>;
    error: rx.BehaviorSubject<Event | null>;
};
export interface APPackageResponse {
    i: number;
    n: string;
    m: number;
    o: string;
}
export interface APPayload {
    [key: string]: string | number | boolean | APPayload | APPayload[] | null;
}
export interface APLoginResponse {
    Authenticated: boolean;
    Requires2FA?: boolean;
}
export interface APFailedLoginResponse extends APLoginResponse {
    Locked: boolean;
    errormsg: string;
}
export interface APRequired2FALoginResponse extends APLoginResponse {
    Requires2FA: true;
    AuthType: string;
}
export interface AP2FAAuthResponse {
    Authenticated: boolean;
}
export interface APSuccess2FAAuthResponse extends AP2FAAuthResponse {
    Authenticated: true;
    UserId: number;
    SessionToken: string;
}
export interface APSuccessLoginResponse extends APLoginResponse {
    SessionToken: string;
    User: {
        UserId: number;
        UserName: string;
        Email: string;
        EmailVerified: boolean;
        AccountId: number;
        OMSId: number;
        Use2FA: boolean;
    };
    EnforceEnable2FA: boolean;
    TwoFAType: string;
    TwoFAToken: string;
    Locked: false;
    errormsg: null;
}
interface APDepositRequest {
    accountId: number;
    productId: number;
    currencyCode: string;
    amount: number;
    depositInfo: APPayload;
}
interface APWithdrawRequest {
    accountId: number;
    productId: number;
    amount: number;
    formData: APCryptoWithdrawRequestFormData | APFiatWithdrawRequestFormData;
}
interface APCryptoWithdrawRequest {
    accountId: number;
    productId: number;
    amount: number;
    address: string;
    destinationTag?: string;
    memo?: string;
}
interface APCryptoWithdrawRequestFormData {
    ExternalAddress: string;
    Comment: string;
    DestinationTagNumber?: string;
    Memo?: string;
}
interface APBankAccount {
    bankName: string;
    agency: string;
    account: string;
    type: string;
}
interface APPixAccount {
    pixType: string;
    pixKey: string;
    type: string;
}
interface APFiatWithdrawRequest {
    accountId: number;
    productId: number;
    amount: number;
    fullName: string;
    ssn: string;
    account: APBankAccount | APPixAccount;
}
interface APFiatWithdrawRequestFormData {
    fullName: string;
    language: string;
    bankAddress: string;
    bankAccountNumber: string;
    bankAccountName: string;
    Comment: string;
}
interface APDepositKey {
    DepositInfo: string;
}
declare type Tickers = Array<Array<number>>;
interface APOrderRequest {
    accountId: number;
    instrumentId: number;
    marketOrder: boolean;
    buy: boolean;
    quantity: number;
    limitPrice: number | null;
}
interface APOrderFeeRequest {
    accountId: number;
    buy: boolean;
    marketOrder: boolean;
    instrumentId: number;
    productId: number;
    quantity: number;
    price: number;
    maker: boolean;
}
interface APWithdrawTicket {
    TicketNumber: number;
    AssetId: number;
    CreatedTimestamp: number;
    Amount: number;
    FeeAmt: number;
    Status: string;
    RequestCode: string;
    TemplateForm: string;
    WithdrawTransactionDetails: string;
}
interface APProduct {
    OMSId: number;
    ProductId: number;
    Product: string;
    ProductFullName: string;
    Producttype: string;
    DecimalPlaces: number;
    TickSize: number;
    NoFees: boolean;
    IsDisabled: boolean;
    MarginEnabled: boolean;
}
interface APInstrument {
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
    PriceCollarEnabled: true;
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
}
export interface APLevel1Update {
    OMSId: number;
    InstrumentId: number;
    BestBid: number;
    BestOffer: number;
    LastTradedPx: number;
    LastTradedQty: number;
    LastTradeTime: number;
    SessionOpen: number;
    SessionHigh: number;
    SessionLow: number;
    SessionClose: number;
    Volume: number;
    CurrentDayVolume: number;
    CurrentDayNotional: number;
    CurrentDayNumTrades: number;
    CurrentDayPxChange: number;
    Rolling24HrVolume: number;
    Rolling24HrNotional: number;
    Rolling24NumTrades: number;
    Rolling24HrPxChange: number;
    TimeStamp: string;
    BidQty: number;
    AskQty: number;
    BidOrderCt: number;
    AskOrderCt: number;
    Rolling24HrPxChangePercent: number;
}
interface APOpenOrder {
    OMSId: number;
    Side: string;
    OrderId: number;
    Price: number;
    Quantity: number;
    DisplayQuantity: number;
    Instrument: number;
    Account: number;
    AccountName: string;
    OrderType: string;
    ClientOrderId: number;
    OrderState: string;
    ReceiveTime: number;
    ReceiveTimeTicks: number;
    LastUpdatedTime: number;
    LastUpdatedTimeTicks: number;
    OrigQuantity: number;
    QuantityExecuted: number;
    GrossValueExecuted: number;
    ExecutableValue: number;
    AvgPrice: number;
    CounterPartyId: number;
    ChangeReason: string;
    OrigOrderId: number;
    OrigClOrdId: number;
    EnteredBy: number;
    UserName: string;
    IsQuote: boolean;
    InsideAsk: number;
    InsideAskSize: number;
    InsideBid: number;
    InsideBidSize: number;
    LastTradePrice: number;
    RejectReason?: string;
    IsLockedIn: boolean;
    CancelReason?: string;
    OrderFlag: string;
    UseMargin: boolean;
    StopPrice: number;
    PegPriceType: string;
    PegOffset: number;
    PegLimitOffset: number;
    IpAddress: string | null;
    ClientOrderIdUuid: string | null;
}
export interface APBookOrder {
    Side: number;
    Price: number;
    Quantity: number;
}
interface APUserInfo {
    OMSId: number;
    UserId: number;
    UserName: string;
    Email: string;
    Use2FA: boolean;
    PasswordHash: string;
    PendingEmailCode: string;
    EmailVerified: boolean;
    AccountId: number;
    DateTimeCreated: string;
    AffiliateId: number;
    RefererId: number;
    Salt: string;
    PendingCodeTime: string;
}
interface APAccountInfo {
    OMSID: number;
    AccountId: number;
    AccountName: string;
    AccountHandle: string;
    FirmId: string;
    FirmName: string;
    AccountType: string;
    FeeGroupId: number;
    ParentID: number;
    RiskType: string;
    VerificationLevel: number;
    CreditTier: number;
    FeeProductType: string;
    FeeProduct: number;
    RefererId: number;
    LoyaltyProductId: number;
    LoyaltyEnabled: boolean;
    PriceTier: number;
}
interface APAccountPosition {
    ProductSymbol: string;
    Amount: number;
    Hold: number;
    PendingDeposits: number;
    PendingWithdraws: number;
    TotalDayDeposits: number;
    TotalDayWithdraws: number;
    TotalMonthWithdraws: number;
}
interface APWithdrawResponse {
    result: boolean;
    errormsg: string;
    errorcode: number;
    detail: string;
}
interface RegisterNewUserPayload {
    username: string;
    fullName: string;
    password: string;
    key: string;
    dob: string;
    affiliateTag: string;
}
declare class AlphaPoint {
    private services;
    constructor();
    connect(username?: string, password?: string): Promise<APLoginResponse>;
    reconnect(sessionToken: string): Promise<APLoginResponse>;
    disconnect(): Promise<void>;
    registerNewUser(params: RegisterNewUserPayload): Promise<APPayload | null>;
    getUserInfo(apUserId: number): Promise<APUserInfo>;
    enable2FA(): Promise<string | null>;
    getUserConfigs(apUserId: number): Promise<{
        [name: string]: string;
    }>;
    setUserConfig(apUserId: number, key: string, value: string): Promise<APPayload>;
    removeUserConfig(apUserId: number, username: string, key: string): Promise<APPayload | null>;
    getUserAccounts(apUserId: number): Promise<number[]>;
    authenticate2FA(code: string): Promise<AP2FAAuthResponse>;
    resetPassword(username: string): Promise<APPayload>;
    getAccountInfo(accountId: number): Promise<APAccountInfo>;
    getProducts(): Promise<APProduct[]>;
    getInstruments(): Promise<APInstrument[]>;
    getDepositKey(accountId: number, productId: number, generate: boolean): Promise<APDepositKey>;
    getL2Snapshot(instrumentId: number, depth?: number): Promise<APPayload> | null;
    createDepositTicket({ accountId, productId, currencyCode, amount, depositInfo, }: APDepositRequest): Promise<APPayload> | null;
    getWithdrawTemplateTypes(accountId: number, productId: number): Promise<{
        TemplateName: string;
    }[]>;
    createWithdrawTicket({ accountId, productId, amount, formData, }: APWithdrawRequest): Promise<APWithdrawResponse>;
    createCryptoWithdrawTicket({ accountId, productId, amount, address, destinationTag, memo }: APCryptoWithdrawRequest): Promise<APWithdrawResponse>;
    createFiatWithdrawTicket({ accountId, productId, amount, fullName, ssn, account, }: APFiatWithdrawRequest): Promise<APWithdrawResponse>;
    ping(): Promise<APPayload>;
    subscribeTicker(instrumentId: number, interval: number, count: number, cb: (tickers: Tickers) => any): Promise<void>;
    subscribeLevel1(instrumentId: number, cb: (data: APLevel1Update) => any): Promise<void>;
    getAccountPositions(accountId: number): Promise<APAccountPosition[]>;
    getOrderFee({ accountId, buy, marketOrder, instrumentId, productId, quantity, price, maker, }: APOrderFeeRequest): Promise<APPayload> | null;
    getUserAffiliateTag(userId: number): Promise<APPayload | null>;
    addUserAffiliateTag(userId: number, tag: string): Promise<APPayload | null>;
    sendOrder({ accountId, instrumentId, marketOrder, buy, quantity, limitPrice, }: APOrderRequest): Promise<{
        status: string;
        OrderId: number;
        errormsg: string;
    }>;
    cancelOrder(orderId: number): Promise<APPayload>;
    subscribeTrades(instrumentId: number, cb: (trades: Array<Array<number>>) => any): Promise<void>;
    subscribeLevel2(instrumentId: number, depth: number, cb: (items: Array<Array<number>>) => any): Promise<void>;
    unsubscribeLevel1(instrumentId: number): Promise<void>;
    unsubscribeLevel2(instrumentId: number): Promise<void>;
    unsubscribeTicker(instrumentId: number): Promise<void>;
    subscribeAccountEvents(accountId: number, cb: (result: APPayload, eventName: string) => any): Promise<{
        dispose: () => void;
    } | null>;
    getOpenOrders(accountId: number): Promise<APOpenOrder[]>;
    keepAlive(interval?: number): void;
    getAccountDepositTickets(apAccountId: number, startTimestamp?: null): Promise<APPayload> | null;
    getWithdrawTickets(apAccountId: number, limit?: number): Promise<APWithdrawTicket[]>;
    cancelWithdraw(userId: number, accountId: number, requestCode: string): Promise<APPayload>;
}
export declare const ap: AlphaPoint;
export default AlphaPoint;
