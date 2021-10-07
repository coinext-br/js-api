import WebSocket from 'ws';
import config from "./config";
import crypto from 'crypto';

enum SocketOperation {
  Request = 0,
  Reply = 1,
  SubscribeToEvent = 2,
  Event = 3,
  UnSubscribeFromEvent = 4,
  Error = 5,
}

type IPayloadRequest = {
  i: number;
  n: IServiceName;
  m: number;
  o: string;
};

type IServiceName =
  | 'AuthenticateUser'
  | 'Authenticate2FA'
  | 'GetUserAccounts'
  | 'GetAccountPositions'
  | 'GetDepositInfo'
  | 'GetInstruments'
  | 'GetL2Snapshot'
  | 'SubscribeAccountEvents'
  | 'GetDeposits'
  | 'TransferFunds';

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

export type InstrumentSymbol = 'BTCBRL' | 'USDTBRL';

enum ProductId {
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
  Xlm = 12,
}

export type ProductName =
  | 'BRL'
  | 'BTC'
  | 'LTC'
  | 'ETH'
  | 'XRP'
  | 'BCH'
  | 'USDT'
  | 'LINK'
  | 'DOGE'
  | 'ADA'
  | 'EOS'
  | 'XLM'
  | 'CHZ'
  | 'SUSHI'
  | 'USDC'
  | 'AXS'
  | 'BNB';

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

export enum OrderType {
  New = 1,
  Update = 2,
  Delete = 3,
}

export enum OrderSide {
  Buy = 0,
  Sell = 1,
  Short = 2,
  Unknown = 3,
}

export type IApiBookOrderResponse = [
  number, // MDUpdateId
  number, // Number of Unique Accounts
  number, // ActionDateTime in Posix format X 1000
  OrderType, // ActionType 0 (New), 1 (Update), 2(Delete)
  number, // LastTradePrice
  number, // Number of Orders
  number, //Price
  number, // ProductPairCode
  number, // Quantity
  OrderSide, // Side
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

class Coinext {
  private index: number = 2;
  private omsId: number = 1;
  private minimumSystemIndexIncrement: number = 2;
  private socket: WebSocket;
  private products: Product[] = [
    {
      ProductId: 1,
      Product: 'BTC',
    },
    {
      ProductId: 2,
      Product: 'LTC',
    },
    {
      ProductId: 3,
      Product: 'ETH',
    },
    {
      ProductId: 4,
      Product: 'XRP',
    },
    {
      ProductId: 5,
      Product: 'BRL',
    },
    {
      ProductId: 6,
      Product: 'BCH',
    },
    {
      ProductId: 7,
      Product: 'USDT',
    },
    {
      ProductId: 8,
      Product: 'LINK',
    },
    {
      ProductId: 9,
      Product: 'DOGE',
    },
    {
      ProductId: 10,
      Product: 'ADA',
    },
    {
      ProductId: 11,
      Product: 'EOS',
    },
    {
      ProductId: 12,
      Product: 'XLM',
    },
    {
      ProductId: 13,
      Product: 'CHZ',
    },
    {
      ProductId: 14,
      Product: 'SUSHI',
    },
    {
      ProductId: 15,
      Product: 'USDC',
    },
    {
      ProductId: 16,
      Product: 'AXS',
    },
    {
      ProductId: 17,
      Product: 'BNB',
    },
  ];

  constructor() {}

  connect = async (): Promise<void> => {
    const socket = new Promise<WebSocket>(function (resolve, reject) {
      const server = new WebSocket(`${process.env.AP_URL}`);
      server.onopen = function () {
        resolve(server);
      };
      server.onerror = function (err: any) {
        reject(err);
      };
    });

    this.socket = await socket;
  };

  disconnect = async (): Promise<void> => {
    await this.socket.close();
  };

  private callExternalApi = (apiServiceName: IServiceName, payload: IPayload): Promise<IPayload> => {
    const thisRequestIndex = this.index;
    const options = JSON.stringify(payload);

    const payloadRequest: IPayloadRequest = {
      m: SocketOperation.Request,
      i: thisRequestIndex,
      n: apiServiceName,
      o: options,
    };

    const message = JSON.stringify(payloadRequest);

    this.socket.send(message);

    this.index += this.minimumSystemIndexIncrement;

    return new Promise((resolve, reject) => {
      this.socket.on('message', (reply: any) => {
        try {
          const {
            m: responseType,
            n: responseFunction,
            o: response,
            i: reponseIndex,
          } = JSON.parse(reply.toString()) as IPayloadRequest;

          if (responseType === SocketOperation.Error) {
            reject(JSON.parse(response));
            return;
          }

          if (responseType === SocketOperation.Reply) {
            if (responseFunction === apiServiceName) {
              if (reponseIndex === thisRequestIndex) {
                resolve(JSON.parse(response));
              }
            }
          }
        } catch (e) {
          reject({
            errorMessage: `Unknown error ${e}`,
          });
        }
      });
    });
  };

  private static createSha256Signature(secret: string, message: any) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);
    return hmac.digest('hex');
  }

  private static authPayload(userId: string, apiKey: string, apiSecret: string) {
    let nonce = new Date().getTime();
    let signature = Coinext.createSha256Signature(apiSecret, `${nonce}${userId}${apiKey}`);

    return {
      APIKey: apiKey,
      Signature: signature,
      UserId: `${userId}`,
      Nonce: `${nonce}`,
    };
  }

  loginBySecret = async (): Promise<ILoginResponse> => {
    try {
      const authenticationPayload = Coinext.authPayload(
        `${process.env.AP_USER}`,
        `${process.env.AP_KEY}`,
        `${process.env.AP_SECRET}`,
      );

      type IGetDepositInfo = {
        Authenticated: boolean;
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
        Locked: boolean;
        Requires2FA: boolean;
        EnforceEnable2FA: boolean;
        errormsg: string;
      };

      const apiResponse = await this.callExternalApi('AuthenticateUser', authenticationPayload);

      const { errormsg: errorMessage } = apiResponse as IGetDepositInfo;

      if (errorMessage) {
        return Promise.resolve({
          accountId: -1,
          authenticated: false,
          errorMessage,
        });
      }

      const {
        errormsg,
        Authenticated: authenticated,
        User: { AccountId: accountId },
      } = apiResponse as IGetDepositInfo;

      return Promise.resolve({
        accountId,
        authenticated: authenticated as boolean,
        errorMessage: errormsg as string,
      });
    } catch (e) {
      return Promise.resolve({
        accountId: -1,
        authenticated: false,
        errorMessage: 'Unknown login error',
      });
    }
  };

  getCurrencyDepositAddress = async (accountId: number, productName: ProductName): Promise<IDepositInfoResponse> => {
    type IGetDepositInfo = {
      AssetManagerId: number;
      ACcountId: number;
      AssetId: number;
      ProviderId: number;
      DepositInfo: string;
      result: boolean;
      errormsg: string;
      statuscode: number;
    };

    const [{ ProductId }] = this.products.filter(product => product.Product === productName);

    try {
      const apiResponse = (await this.callExternalApi('GetDepositInfo', {
        OMSId: this.omsId,
        AccountId: accountId || '',
        ProductId: ProductId || '',
        GenerateNewKey: false,
      })) as unknown as IGetDepositInfo;

      return Promise.resolve({
        currencyDepositAddress: JSON.parse(apiResponse.DepositInfo),
        errorMessage: '',
      });
    } catch (e) {
      return Promise.resolve({
        currencyDepositAddress: [],
        errorMessage: 'Unknown error getting currency deposity address',
      });
    }
  };

  subscribeToAccountEvents = async ({
                                      accountId,
                                    }: ISubscribeAccountEventsResquest): Promise<ISubscribeAccountEventsResponse> => {
    try {
      const apiResponse = await this.callExternalApi('SubscribeAccountEvents', {
        OMSId: this.omsId,
        AccountId: accountId,
      });

      const subscriptionStatus = apiResponse as unknown as { Subscribed: boolean };

      return Promise.resolve({
        subscribed: subscriptionStatus.Subscribed,
        errorMessage: '',
      });
    } catch (e) {
      return Promise.resolve({
        subscribed: false,
        errorMessage: 'Unknown error subscribing into account events',
      });
    }
  };

  getBookOrders = async ({ instrumentId, howMany, side }: IBookOrderResquest): Promise<IBookOrderResponse> => {
    try {
      const apiResponse = await this.callExternalApi('GetL2Snapshot', {
        OMSId: this.omsId,
        InstrumentId: instrumentId,
        Depth: howMany,
      });

      const orders = apiResponse as unknown as IApiBookOrderResponse[];

      let bookOrders: IBookOrder[] = [];

      orders.map(order => {
        const bookOrder: IBookOrder = {
          updateId: order[0],
          uniqueAccountsQuantity: order[1],
          posixActionDateTime: order[2],
          type: order[3],
          lastTradePrice: order[4],
          numberOfOrders: order[5],
          price: order[6],
          instrumentId: order[7],
          quantity: order[8],
          side: order[9],
        };
        bookOrders.push(bookOrder);
      });

      bookOrders = bookOrders.filter(bo => bo.side === side);

      return Promise.resolve({
        orders: bookOrders,
        errorMessage: '',
        isEmpty: bookOrders.length === 0,
      });
    } catch (e) {
      return Promise.resolve({
        orders: [],
        isEmpty: true,
        errorMessage: 'Unknown error getting book orders',
      });
    }
  };

  getInstrumentIdBySymbol = async (instrumentSymbol: InstrumentSymbol): Promise<IInstrumentIdResponse> => {
    try {
      const apiResponse = await this.callExternalApi('GetInstruments', { omsId: this.omsId });

      const instruments = apiResponse as unknown as IInstrument[];

      const instrument = instruments.find(i => i.Symbol === instrumentSymbol);

      return instrument
        ? Promise.resolve({
          instrumentId: instrument.InstrumentId,
          errorMessage: '',
        })
        : Promise.resolve({
          instrumentId: -1,
          errorMessage: `cannot quote ${instrumentSymbol}`,
        });
    } catch (e) {
      return Promise.resolve({
        instrumentId: -1,
        errorMessage: 'Unknown error getting instrument id',
      });
    }
  };

  getDeposits = async (accountId: number): Promise<IGetDepositsResponse> => {
    type IGetDeposits = {
      OMSId: number;
      DepositId: number;
      AccountId: number;
      SubAccountId: number;
      ProductId: number;
      Amount: number;
      LastUpdateTimeStamp: number;
      ProductType: string;
      TicketStatus: string;
      DepositInfo: {
        AccountProviderId: number;
        AccountProviderName: string;
        TXId: string;
        FromAddress: string;
        ToAddress: string;
      };
      DepositCode: string;
      TicketNumber: number;
      NotionalProductId: number;
      NotionalValue: number;
      FeeAmount: number;
    };

    const deposits: DepositInfo[] = [];

    try {
      const apiResponse = (await this.callExternalApi('GetDeposits', {
        OMSId: this.omsId,
        AccountId: accountId || '',
      })) as unknown as IGetDeposits[];

      apiResponse.forEach(deposit => {
        const [{ Product }] = this.products.filter(product => product.ProductId === deposit.ProductId);
        deposit.DepositInfo = JSON.parse(deposit.DepositInfo.toString());
        deposits.push({
          productId: deposit.ProductId,
          amount: deposit.Amount,
          assetName: Product,
          toAddress: deposit.DepositInfo.ToAddress,
          ticketStatus: deposit.TicketStatus,
        });
      });

      return Promise.resolve({
        deposits,
        isEmpty: deposits.length === 0,
        errorMessage: '',
      });
    } catch (e) {
      return Promise.resolve({
        deposits,
        isEmpty: deposits.length === 0,
        errorMessage: `Unknown error getting deposits for accountId ${accountId}`,
      });
    }
  };

  transferFunds = async (
    senderAccountId: number,
    productName: ProductName,
    receiverUsername: string,
    amount: number,
    notes: string,
  ): Promise<ITransferFundsResponse> => {
    type ITransferDetails = {
      TransferId: number;
      SenderAccountId: number;
      SenderUserName: string;
      ReceiverAccountId: number;
      ReceiverUserName: string;
      ProductId: number;
      Amount: number;
      Notes: string;
      OMSId: number;
      Reason: string;
      TransferState: string;
      CreatedTimeInTicks: number;
      LastUpdatedTimeInTicks: number;
    };

    type ITransferFunds = {
      result: boolean;
      errormsg: string;
      errorcode: number;
      detail: string;
    };

    const [{ ProductId }] = this.products.filter(product => product.Product === productName);

    try {
      const apiResponse = (await this.callExternalApi('TransferFunds', {
        OMSId: this.omsId,
        ProductId: ProductId || '',
        SenderAccountId: senderAccountId || '',
        ReceiverUsername: receiverUsername || '',
        Amount: amount || 0,
        Notes: notes || '',
      })) as unknown as ITransferFunds;

      const { result, errormsg, detail } = apiResponse;

      let retorno: ITransferFundsResponse = {
        success: result,
        details: null,
        errorMessage: errormsg,
      };

      if (result && detail !== null) {
        const details: ITransferDetails = JSON.parse(detail);
        retorno = {
          success: result,
          details: {
            transferId: details.TransferId,
            senderAccountId: details.SenderAccountId,
            senderUserName: details.SenderUserName,
            receiverAccountId: details.ReceiverAccountId,
            receiverUserName: details.ReceiverUserName,
            productId: details.ProductId,
            amount: details.Amount,
            notes: details.Notes,
            omsId: details.OMSId,
            reason: details.Reason,
            transferState: details.TransferState,
            createdTimeInTicks: details.CreatedTimeInTicks,
            lastUpdatedTimeInTicks: details.LastUpdatedTimeInTicks,
          },
          errorMessage: errormsg,
        };
      }

      return Promise.resolve(retorno);
    } catch (e) {
      return Promise.resolve({
        success: false,
        details: null,
        errorMessage: `Unknown error transfering funds from accountId ${senderAccountId} to ${receiverUsername}`,
      });
    }
  };
}

export {Coinext};
