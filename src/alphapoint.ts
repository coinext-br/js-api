import rx from 'rx';
import config from './config';
import {forTimeout} from './awaits';
import {cryptoAmount} from './numbers';

const PUBLIC_USER = '_public';

const logger = console;

let nextIvalue = 2;

type APCallback = {
  (
    error: Error | string | null,
    response: APPayload | APResponseError | null,
  ): void;
  isSubscription?: boolean;
  subscriptionName?: string;
  iValue?: number;
};

interface APResponseError {
  status: string;
  errorcode: string;
  errormsg: string;
  detail?: string;
}

const RPCCall_ReplyWaitObjects: {
  [name: string]: APCallback | Array<APCallback>;
} = {};

export const websocketSubjects = {
  instance: new rx.BehaviorSubject<WebSocket | null>(null),
  connect: new rx.BehaviorSubject<{kind: string} | null>(null),
  close: new rx.BehaviorSubject<{kind: string} | null>(null),
  message: new rx.BehaviorSubject<{data: string} | null>(null),
  error: new rx.BehaviorSubject<Event | null>(null),
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

class APError extends Error {
  private serviceName: string;
  private status: string;
  private errormsg: string;
  private errorcode: string;
  private detail?: string;
  private response: APResponseError;

  constructor(serviceName: string, response: APResponseError) {
    super(`[${serviceName}] ${response.errormsg}`);
    this.serviceName = serviceName;
    this.status = response.status;
    this.errormsg = response.errormsg;
    this.errorcode = response.errorcode;
    this.detail = response.detail;
    this.response = response;
  }
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

type Tickers = Array<Array<number>>;

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
  OMSId: number,
  UserId: number,
  UserName: string,
  Email: string,
  Use2FA: boolean,
  PasswordHash: string,
  PendingEmailCode: string,
  EmailVerified: boolean,
  AccountId: number,
  DateTimeCreated: string,
  AffiliateId: number,
  RefererId: number,
  Salt: string,
  PendingCodeTime: string
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

class AlphaPointService {
  private username?: string;
  private password?: string;
  private ws: WebSocket | null = null;

  async connect(username: string, password: string) {
    let payload = null;
    if (username && username !== PUBLIC_USER) {
      this.username = username;
      this.password = password;
      payload = {UserName: username, Password: password};
    }

    const response = await this.connectUsingPayload(payload);
    return (response as unknown) as APLoginResponse;
  }

  async reconnect(sessionToken: string) {
    let payload = await this.connectUsingPayload({SessionToken: sessionToken});
    return (payload as unknown) as APLoginResponse;
  }

  // noinspection JSUnusedLocalSymbols
  connectUsingPayload(payload: APPayload | null) {
    this.ws = new WebSocket(config.API_V2_URL);
    websocketSubjects.instance.onNext(this.ws);
    return new Promise<APPayload>((resolve, reject) => {
      if (!this.ws) {
        logger.error('[ALPHAPOINT] ws === null?!');
        return;
      }

      this.ws.onopen = () => {
        if (!this.ws) {
          logger.error('[ALPHAPOINT] ws === null?!');
          return;
        }

        websocketSubjects.connect.onNext({kind: 'open'});
        this.ws.onerror = (e) => {
          logger.error(e);
          websocketSubjects.error.onNext(e);
        };
        this.ws.onmessage = (ev) => {
          websocketSubjects.message.onNext({data: ev.data});
          const frame = JSON.parse(ev.data) as APPackageResponse;
          // if (!['SubscribeTicker', 'Level1UpdateEvent', 'SubscribeLevel2', 'Level2UpdateEvent', 'GetWithdrawTickets'].includes(frame.n)) {console.log(` <- ${ev.data}`);}

          const cbs = RPCCall_ReplyWaitObjects[frame.n]
            ? (RPCCall_ReplyWaitObjects[frame.n] as Array<APCallback>)
            : [RPCCall_ReplyWaitObjects[frame.i] as APCallback];
          if (cbs && cbs[0]) {
            for (const cb of cbs) {
              // check cb.iValue, delete cb instead of cbs
              if (!cb.isSubscription) {
                delete RPCCall_ReplyWaitObjects[frame.i];
              } else if (frame.n !== cb.subscriptionName) {
                console.warn(
                  `frame.n !== subscriptionName: ${frame.n} !== ${cb.subscriptionName}`,
                );
              }

              if (frame.m !== 5) {
                try {
                  const response = JSON.parse(frame.o);
                  cb(null, response);
                } catch (e) {
                  cb(e instanceof Error ? e : new Error(`${e}`), null);
                }
              } else {
                cb(new Error(`${frame.n}: ${frame.o}`), null);
              }
            }
          } else {
            console.log(`Ignore: ${ev.data}`);
          }
        };
        this.ws.onclose = () => {
          websocketSubjects.close.onNext({kind: 'close'});
        };

        if (!payload) {
          resolve({});
        } else {
          this.callService('WebAuthenticateUser', payload)
            .then((r) => {
              resolve(r);
            })
            .catch((e) => {
              reject(e);
            });
        }
      };
      this.ws.onerror = (e) => {
        logger.error(e);
        websocketSubjects.error.onNext(e);
        reject(new Error(`Can't connect to AP WebSocket: ${e}`));
      };
    });
  }

  async disconnect() {
    if (!this.ws) {
      throw new Error('Not connected');
    }

    for (const key of Object.keys(RPCCall_ReplyWaitObjects)) {
      delete RPCCall_ReplyWaitObjects[key];
    }

    if ([WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)) {
      this.ws.close();
      while (this.ws.readyState !== WebSocket.CLOSED) {
        await forTimeout(100);
      }

      this.ws = null;
    }
  }

  callService(serviceName: string, payload: APPayload): Promise<APPayload> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        logger.error('[ALPHAPOINT] callService: this.ws is null?!');
        return;
      }

      const payloadStr = payload ? JSON.stringify(payload) : '';
      const frame = {
        m: 0,
        i: nextIvalue,
        n: serviceName,
        o: payloadStr,
      };

      // console.log(` -> ${JSON.stringify(frame)}`);

      const cb = (
        error: string | Error | null,
        response: APPayload | APResponseError | null,
      ) => {
        if (error) {
          reject(error);
        } else {
          if (response && response.errorcode) {
            const payloadMsg =
              serviceName === 'WebAuthenticateUser'
                ? ''
                : `Payload: ${payloadStr}`;
            console.warn(`${serviceName}: ${response.errormsg}. ${payloadMsg}`);
            reject(new APError(serviceName, response as APResponseError));
          } else {
            resolve(response as APPayload);
          }
        }
      };
      cb.iValue = nextIvalue;
      RPCCall_ReplyWaitObjects[nextIvalue] = cb;

      nextIvalue += 2;
      this.ws.send(JSON.stringify(frame));
    });
  }

  // noinspection JSMethodCanBeStatic, JSUnusedLocalSymbols
  async subscribeService(
    serviceName: string,
    subscriptionNames: Array<string>,
    payload: APPayload,
    cb: (response: APPayload, subsName?: string) => any,
  ) {
    for (const subscriptionName of subscriptionNames) {
      this.registerCallback(serviceName, subscriptionName, cb);
    }

    const firstCallResult = await this.callService(serviceName, payload);
    cb(firstCallResult);

    return {
      dispose: () => {
        for (const subscriptionName of subscriptionNames) {
          delete RPCCall_ReplyWaitObjects[subscriptionName];
        }
      },
    };
  }

  registerCallback(
    serviceName: string,
    subscriptionName: string,
    cb: (value: APPayload, subsName: string) => any,
  ) {
    const observer = {
      next: (value: APPayload) => cb(value, subscriptionName),
      onerror: (e: Error | string) => console.error(`${serviceName}: ${e}`),
    };

    const subscriptionCallback = (
      error: Error | string | null,
      response: APPayload | APResponseError | null,
    ) => {
      if (error) {
        console.warn(error);
        observer && observer.onerror(error);
      } else {
        if (response && response.errorcode) {
          observer.onerror(
            new Error(
              `[${response.errormsg}] ${response.errormsg}: ${response.detail}`,
            ),
          );
        } else {
          observer.next(response as APPayload);
        }
      }
    };
    subscriptionCallback.isSubscription = true;
    subscriptionCallback.subscriptionName = subscriptionName;
    let cbs = RPCCall_ReplyWaitObjects[subscriptionName] as Array<APCallback>;
    if (!cbs) {
      cbs = [];
      RPCCall_ReplyWaitObjects[subscriptionName] = cbs;
    }

    cbs.push(subscriptionCallback);
  }
}

interface RegisterNewUserPayload {
  username: string;
  fullName: string;
  password: string;
  key: string;
  dob: string;
  affiliateTag: string;
}

class AlphaPoint {
  private services: AlphaPointService | null = null;

  constructor() {}

  connect(username = PUBLIC_USER, password: string = '') {
    this.services = new AlphaPointService();
    return this.services.connect(username, password);
  }

  reconnect(sessionToken: string) {
    this.services = new AlphaPointService();
    return this.services.reconnect(sessionToken);
  }

  // noinspection JSUnusedGlobalSymbols
  disconnect() {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] disconnect: this.services is null?!');
    }
    return this.services.disconnect();
  }

  async registerNewUser(params: RegisterNewUserPayload) {
    const {username, fullName, password, key, dob, affiliateTag} = params;
    return (
      this.services &&
      (await this.services.callService('RegisterNewUser', {
        userInfo: {
          UserName: username,
          Email: username,
          PasswordHash: password,
        },
        OperatorId: 1,
        AffiliateTag: affiliateTag,
        UserConfig: [
          {
            Name: 'apexKey',
            Value: key,
          },
          {
            Name: 'fullName',
            Value: fullName,
          },
          {
            Name: 'dob',
            Value: dob,
          },
        ],
      }))
    );
  }

  async getUserInfo(apUserId: number): Promise<APUserInfo> {
    const response = await this.services!.callService('GetUserInfo',
        {UserId: apUserId});
    return (response as unknown) as APUserInfo;
  }

  async enable2FA() {
    const response = await this.services!.callService('EnableGoogle2FA', {});
    return response && response.ManualCode ? response.ManualCode as string : null;
  }

  async getUserConfigs(apUserId: number): Promise<{[name: string]: string}> {
    return new Promise((resolve, reject) => {
      this.services &&
        this.services
          .callService('GetUserConfig', {
            UserId: apUserId,
          })
          .then((data) => {
            const ucData = (data as unknown) as Array<{
              Key: string;
              Value: string;
            }>;
            const result: {[key: string]: string} = {};

            for (const entry of ucData) {
              result[entry.Key] = entry.Value;
            }
            resolve(result);
          })
          .catch((e) => reject(e));
    });
  }

  async setUserConfig(apUserId: number, key: string, value: string) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] setUserConfig: this.services is null?!');
    }
    return this.services.callService('SetUserConfig', {
      UserId: apUserId,
      Config: [
        {
          Key: key,
          Value: value,
        },
      ],
    });
  }

  async removeUserConfig(apUserId: number, username: string, key: string) {
    return (
      this.services &&
      this.services.callService('RemovetUserConfig', {
        UserId: apUserId,
        UserName: username,
        Key: key,
      })
    );
  }

  async getUserAccounts(apUserId: number) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] getUserAccounts session is null?!');
    }

    const accounts = await this.services.callService('GetUserAccounts', {
      OMSId: 1,
      UserId: apUserId,
    });

    return (accounts as unknown) as number[];
  }

  async authenticate2FA(code: string) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] authenticate2FA: services is null?!');
    }

    let response = await this.services.callService('Authenticate2FA', {
      Code: code,
    });
    return (response as unknown) as AP2FAAuthResponse;
  }

  async resetPassword(username: string) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] resetPassword: this.services is null?!');
    }

    return await this.services.callService('resetPassword', {
      UserName: username,
    });
  }

  async getAccountInfo(accountId: number) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] getAccountInfo: this.services is null?!');
    }

    const response = await this.services.callService('GetAccountInfo', {
      OMSId: 1,
      AccountId: accountId,
    });

    return (response as unknown) as APAccountInfo;
  }

  async getProducts() {
    if (!this.services) {
      throw new Error('[ALPHAPOINT getProducts: this.services is null?!]');
    }

    const apProducts = await this.services.callService('GetProducts', {
      OMSId: 1,
    });
    return (apProducts as unknown) as APProduct[];
  }

  async getInstruments() {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] getInstruments: services is null?!');
    }
    const apPayload = await this.services.callService('GetInstruments', {
      OMSId: 1,
    });

    return (apPayload as unknown) as Array<APInstrument>;
  }

  async getDepositKey(accountId: number, productId: number, generate: boolean) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] getDepositKey: this.services is null?!');
    }

    let response = await this.services.callService('GetDepositInfo', {
      OMSId: 1,
      ProductId: productId,
      AccountId: accountId,
      GenerateNewKey: generate,
    });

    return (response as unknown) as APDepositKey;
  }

  // noinspection JSUnusedGlobalSymbols
  getL2Snapshot(instrumentId: number, depth = 100) {
    return (
      this.services &&
      this.services.callService('GetL2Snapshot', {
        OMSId: 1,
        InstrumentId: instrumentId,
        Depth: depth,
      })
    );
  }

  createDepositTicket({
    accountId,
    productId,
    currencyCode,
    amount,
    depositInfo,
  }: APDepositRequest) {
    return (
      this.services &&
      this.services.callService('CreateDepositTicket', {
        OMSId: 1,
        OperatorId: 1,
        accountId: accountId,
        assetId: productId,
        assetName: currencyCode,
        amount: amount,
        RequestUser: accountId,
        Status: 'New',
        DepositInfo: depositInfo,
      })
    );
  }

  async getWithdrawTemplateTypes(accountId: number, productId: number) {
    if (!this.services) {
      throw new Error(
        '[ALPHAPOINT] getWithdrawTemplateTypes: this.services===null?!',
      );
    }

    const response = await this.services.callService(
      'GetWithdrawTemplateTypes',
      {
        OMSId: 1,
        AccountId: accountId,
        ProductId: productId,
      },
    );

    return (response.TemplateTypes as unknown) as Array<{TemplateName: string}>;
  }

  async createWithdrawTicket({
    accountId,
    productId,
    amount,
    formData,
  }: APWithdrawRequest) {
    if (!this.services) {
      throw new Error(
        '[ALPHAPOINT] createWithdrawTicket: this.services is null?!',
      );
    }
    const templateTypes = await this.getWithdrawTemplateTypes(
      accountId,
      productId,
    );
    const templateType = templateTypes[0].TemplateName;

    const form = {
      TemplateType: templateType,
      ...formData,
    };

    const payload = {
      OMSId: 1,
      AccountId: accountId,
      ProductId: productId,
      Amount: amount,
      TemplateType: templateType,
      TemplateForm: JSON.stringify(form),
    };

    const response = await this.services.callService(
      'CreateWithdrawTicket',
      payload,
    );
    return (response as unknown) as APWithdrawResponse;
  }

  async createCryptoWithdrawTicket({
    accountId,
    productId,
    amount,
    address,
    destinationTag,
    memo
  }: APCryptoWithdrawRequest) {
    const formData: APCryptoWithdrawRequestFormData = {
      ExternalAddress: address,
      Comment: '',
    };
    if (destinationTag) {
      formData.DestinationTagNumber = destinationTag;
    } else if (memo) {
      formData.Memo = memo;
    }

    return this.createWithdrawTicket({accountId, productId, amount, formData});
  }

  async createFiatWithdrawTicket({
    accountId,
    productId,
    amount,
    fullName,
    ssn,
    account,
  }: APFiatWithdrawRequest) {
    let bankAddress;
    let bankAccountNumber;
    let comment: {[key: string]: string} = {};

    if (account.type === 'pix') {
      const a = account as APPixAccount;
      bankAddress = `PIX - ${a.pixType}`;
      bankAccountNumber = a.pixKey;
      comment.Chave = a.pixKey;
      comment.Tipo = a.pixType;
    } else {
      const a = account as APBankAccount;
      bankAddress = `${a.bankName} - Agência ${a.agency}`;
      bankAccountNumber = a.account;
      comment.Banco = a.bankName;
      comment.Conta = a.account;
      comment.Agencia = a.agency;
      comment['Tipo de conta'] = a.type;
    }

    const formData: APFiatWithdrawRequestFormData = {
      fullName,
      language: 'pt',
      bankAddress,
      bankAccountNumber,
      bankAccountName: ssn,
      Comment: JSON.stringify({...comment, ssn}),
    };

    return await this.createWithdrawTicket({
      accountId,
      productId,
      amount,
      formData,
    });
  }

  ping() {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] ping: this.services is null?!');
    }
    return this.services.callService('Ping', {});
  }

  async subscribeTicker(
    instrumentId: number,
    interval: number,
    count: number,
    cb: (tickers: Tickers) => any,
  ) {
    this.services &&
      (await this.services.subscribeService(
        'SubscribeTicker',
        ['TickerDataUpdateEvent'],
        {
          OMSId: 1,
          InstrumentId: instrumentId,
          Interval: interval,
          IncludeLastCount: count,
        },
        (response) => {
          const tickers = (response as unknown) as Tickers;
          if (tickers && tickers.length > 0 && tickers[0][8] === instrumentId) {
            cb(tickers);
          }
        },
      ));
  }

  async subscribeLevel1(
    instrumentId: number,
    cb: (data: APLevel1Update) => any,
  ) {
    const payload: APPayload = {OMSId: 1};
    if (instrumentId) {
      payload.InstrumentId = instrumentId;
    }

    this.services &&
      (await this.services.subscribeService(
        'SubscribeLevel1',
        ['Level1UpdateEvent'],
        payload,
        (data) => {
          if (data.InstrumentId === instrumentId) {
            cb((data as unknown) as APLevel1Update);
          }
        },
      ));
  }

  async getAccountPositions(accountId: number) {
    if (!this.services) {
      throw new Error(
        '[ALPHAPOINT] getAccountPositions this.services is null?!',
      );
    }
    const payload = {OMSId: 1, AccountId: accountId};
    let responsePayload = await this.services.callService(
      'GetAccountPositions',
      payload,
    );
    return (responsePayload as unknown) as APAccountPosition[];
  }

  getOrderFee({
    accountId,
    buy,
    marketOrder,
    instrumentId,
    productId,
    quantity,
    price,
    maker,
  }: APOrderFeeRequest) {
    const payload: APPayload = {
      OMSId: 1,
      AccountId: accountId,
      InstrumentId: instrumentId,
      ProductId: productId,
      Amount: quantity,
      OrderType: marketOrder ? 1 : 2,
      MakerTaker: maker ? 'Maker' : 'Taker',
      Side: buy ? 0 : 1,
      Price: price,
    };

    if (!buy) {
      payload.Quantity = quantity / price;
    }

    return this.services && this.services.callService('GetOrderFee', payload);
  }

  async getUserAffiliateTag(userId: number) {
    const payload = {OMSId: 1, UserId: userId};
    return (
      this.services && this.services.callService('GetUserAffiliateTag', payload)
    );
  }

  async addUserAffiliateTag(userId: number, tag: string) {
    const payload = {
      OMSId: 1,
      UserId: userId,
      AffiliateTag: `${tag}`,
    };

    return (
      this.services && this.services.callService('AddUserAffiliateTag', payload)
    );
  }

  async sendOrder({
    accountId,
    instrumentId,
    marketOrder,
    buy,
    quantity,
    limitPrice,
  }: APOrderRequest) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] sendOrder: this.services is null?!');
    }
    const payload: APPayload = {
      AccountId: accountId,
      ClientOrderId: 0,
      Side: buy ? 0 : 1,
      Quantity: cryptoAmount(quantity),
      OrderIdOCO: 0,
      OrderType: marketOrder ? 1 : 2,
      InstrumentId: instrumentId,
      TimeInForce: 0,
      OMSId: 1,
      UseDisplayQuantity: false,
    };
    if (!marketOrder && limitPrice) {
      payload.LimitPrice = +limitPrice;
    }

    let response = await this.services.callService('SendOrder', payload);
    return (response as unknown) as {
      status: string;
      OrderId: number;
      errormsg: string;
    };
  }

  cancelOrder(orderId: number) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] cancelOrder: this.services is null?!');
    }

    const payload = {
      OMSId: 1,
      OrderId: orderId,
    };

    return this.services.callService('CancelOrder', payload);
  }

  async subscribeTrades(
    instrumentId: number,
    cb: (trades: Array<Array<number>>) => any,
  ) {
    let payload: APPayload = {
      OMSId: 1,
      InstrumentId: instrumentId,
      IncludeLastCount: 100,
    };
    this.services &&
      (await this.services.subscribeService(
        'SubscribeTrades',
        ['TradeDataUpdateEvent'],
        payload,
        (response) => {
          const tradeArray = (response as unknown) as Array<Array<number>>;
          if (
            tradeArray &&
            tradeArray.length &&
            tradeArray[0][1] === instrumentId
          ) {
            cb(tradeArray);
          }
        },
      ));
  }

  async subscribeLevel2(
    instrumentId: number,
    depth: number,
    cb: (items: Array<Array<number>>) => any,
  ) {
    instrumentId = Number(instrumentId); // better safe
    this.services &&
      (await this.services.subscribeService(
        'SubscribeLevel2',
        ['Level2UpdateEvent'],
        {
          OMSId: 1,
          InstrumentId: instrumentId,
          Depth: depth,
        },
        (response) => {
          const items = (response as unknown) as Array<Array<number>>;
          if (items && items.length > 0) {
            const ordersInstrumentId = items[0][7];
            if (instrumentId === ordersInstrumentId) {
              cb(items);
            }
          }
        },
      ));
  }

  async unsubscribeLevel1(instrumentId: number) {
    this.services &&
      (await this.services.callService('UnsubscribeLevel1', {
        OMSId: 1,
        InstrumentId: instrumentId,
      }));
  }

  async unsubscribeLevel2(instrumentId: number) {
    this.services &&
      (await this.services.callService('UnsubscribeLevel2', {
        OMSId: 1,
        InstrumentId: instrumentId,
      }));
  }

  async unsubscribeTicker(instrumentId: number) {
    this.services &&
      (await this.services.callService('UnsubscribeTicker', {
        OMSId: 1,
        InstrumentId: instrumentId,
      }));
  }

  async subscribeAccountEvents(
    accountId: number,
    cb: (result: APPayload, eventName: string) => any,
  ) {
    return (
      this.services &&
      (await this.services.subscribeService(
        'SubscribeAccountEvents',
        [
          'AccountPositionEvent',
          'OrderStateEvent',
          'OrderTradeEvent',
          'PendingDepositUpdate',
          'LogoutEvent',
        ],
        {
          OMSId: 1,
          AccountId: accountId,
        },
        (result, eventName) => {
          eventName && cb(result, eventName);
        },
      ))
    );
  }

  async getOpenOrders(accountId: number) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] getOpenOrders: this.services is null?!');
    }
    let response = await this.services.callService('GetOpenOrders', {
      OMSId: 1,
      AccountId: accountId,
    });
    return (response as unknown) as Array<APOpenOrder>;
  }

  keepAlive(interval = 20000) {
    setInterval(() => {
      this.ping();
    }, interval);
  }

  getAccountDepositTickets(apAccountId: number, startTimestamp = null) {
    const payload: APPayload = {
      OMSId: 1,
      OperatorId: 1,
      AccountId: apAccountId,
    };
    if (startTimestamp) {
      payload.StartTimestamp = startTimestamp;
    }

    return (
      this.services &&
      this.services.callService('GetAllDepositTickets', payload)
    );
  }

  async getWithdrawTickets(
    apAccountId: number,
    limit = 40,
  ): Promise<APWithdrawTicket[]> {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] getWithdrawTickets: services is null!');
    }
    const payload = {
      OMSId: 1,
      AccountId: apAccountId,
      StartIndex: 0,
      Limit: limit,
    };

    let response = await this.services.callService(
      'GetWithdrawTickets',
      payload,
    );
    return (response as unknown) as APWithdrawTicket[];
  }

  cancelWithdraw(userId: number, accountId: number, requestCode: string) {
    if (!this.services) {
      throw new Error('[ALPHAPOINT] cancelWithdraw: this.services is null?!');
    }

    const payload = {
      OMSId: 1,
      UserId: userId,
      AccountId: accountId,
      RequestCode: requestCode,
    };

    return this.services.callService('CancelWithdraw', payload);
  }
}

export const ap = new AlphaPoint();

export default AlphaPoint;
