import config from "../config";
import crypto from "crypto";
import {
  DepositInfo,
  IApiBookOrderResponse,
  IBookOrder,
  IBookOrderResponse,
  IBookOrderResquest,
  IDepositInfoResponse,
  IGetDepositsResponse,
  IInstrument,
  IInstrumentIdResponse,
  ILoginResponse,
  InstrumentSymbol,
  IPayload,
  IServiceName,
  ISimpleLoginResponse,
  ISubscribeAccountEventsResponse,
  ISubscribeAccountEventsResquest,
  ITransferFundsResponse,
  Product,
  ProductName,
} from "./types";
import CoinextWebSocket from "./coinext_ws";

class Coinext {
  private omsId: number = 1;
  private socket: CoinextWebSocket | null = null;
  private products: Product[] = [];
  private instruments: IInstrument[] = [];

  connect = async (): Promise<void> => {
    await new Promise<CoinextWebSocket>((resolve, reject) => {
      const server = new CoinextWebSocket();
      server.connect().then(async () => {
        this.socket = server;
        try {
          await this.refreshProductsAndInstruments();
          resolve(server);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  disconnect = async (): Promise<void> => {
    await this.socket?.disconnect();
  };

  getCoins = () => {
    return this.products.map((p) => p.Product);
  };

  getInstruments = () => {
    return this.instruments.filter((i) => !i.IsDisable);
  };

  refreshProductsAndInstruments = async () => {
    const instrumentsResponse = await this.socket?.callExternalApi("GetInstruments", { OMSId: this.omsId });
    this.instruments = instrumentsResponse as unknown as IInstrument[];

    const productsResponse = await this.socket?.callExternalApi("GetProducts", { OMSId: this.omsId });
    const pr: IPayload[] = productsResponse as unknown as IPayload[];
    this.products = pr.map((p) => ({ ProductId: Number(p.ProductId), Product: p.Product as unknown as ProductName }));
  };

  private static createSha256Signature(secret: string, message: any) {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);
    return hmac.digest("hex");
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

  login = async (username: string, password: string): Promise<ISimpleLoginResponse> => {
    try {
      const apiResponse = await this.socket?.callExternalApi("AuthenticateUser", {
        UserName: username || "",
        Password: password || "",
      });

      const {
        errormsg: errorMessage,
        Authenticated: authenticated,
        Requires2FA: isAuthenticatorEnabled,
        SessionToken: sessionToken,
        User: user,
      } = apiResponse as any;

      const userId = user ? ((user as IPayload)["UserId"] as number) : 0;

      return {
        authenticated: authenticated as boolean,
        isAuthenticatorEnabled: isAuthenticatorEnabled as boolean,
        token: sessionToken as string,
        userId,
        errorMessage: errorMessage as string,
      };
    } catch (e) {
      console.log(e);
      return {
        authenticated: false,
        isAuthenticatorEnabled: false,
        token: "",
        userId: 0,
        errorMessage: "Unknown login error",
      };
    }
  };

  loginBySecret = async (): Promise<ILoginResponse> => {
    try {
      const authenticationPayload = Coinext.authPayload(`${config.AP_USER}`, `${config.AP_KEY}`, `${config.AP_SECRET}`);

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

      const apiResponse = await this.socket?.callExternalApi("AuthenticateUser", authenticationPayload);

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
        errorMessage: "Unknown login error",
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

    const [{ ProductId }] = this.products.filter((product) => product.Product === productName);

    try {
      const apiResponse = (await this.socket?.callExternalApi("GetDepositInfo", {
        OMSId: this.omsId,
        AccountId: accountId || "",
        ProductId: ProductId || "",
        GenerateNewKey: false,
      })) as unknown as IGetDepositInfo;

      return Promise.resolve({
        currencyDepositAddress: JSON.parse(apiResponse.DepositInfo),
        errorMessage: "",
      });
    } catch (e) {
      return Promise.resolve({
        currencyDepositAddress: [],
        errorMessage: "Unknown error getting currency deposity address",
      });
    }
  };

  subscribeToAccountEvents = async ({
    accountId,
  }: ISubscribeAccountEventsResquest): Promise<ISubscribeAccountEventsResponse> => {
    try {
      const apiResponse = await this.socket?.callExternalApi("SubscribeAccountEvents", {
        OMSId: this.omsId,
        AccountId: accountId,
      });

      const subscriptionStatus = apiResponse as unknown as { Subscribed: boolean };

      return Promise.resolve({
        subscribed: subscriptionStatus.Subscribed,
        errorMessage: "",
      });
    } catch (e) {
      return Promise.resolve({
        subscribed: false,
        errorMessage: "Unknown error subscribing into account events",
      });
    }
  };

  getBookOrders = async ({ instrumentId, howMany, side }: IBookOrderResquest): Promise<IBookOrderResponse> => {
    try {
      const apiResponse = await this.socket?.callExternalApi("GetL2Snapshot", {
        OMSId: this.omsId,
        InstrumentId: instrumentId,
        Depth: howMany,
      });

      const orders = apiResponse as unknown as IApiBookOrderResponse[];

      let bookOrders: IBookOrder[] = [];

      orders.map((order) => {
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

      bookOrders = bookOrders.filter((bo) => bo.side === side);

      return Promise.resolve({
        orders: bookOrders,
        errorMessage: "",
        isEmpty: bookOrders.length === 0,
      });
    } catch (e) {
      return Promise.resolve({
        orders: [],
        isEmpty: true,
        errorMessage: "Unknown error getting book orders",
      });
    }
  };

  getInstrumentIdBySymbol = async (instrumentSymbol: InstrumentSymbol): Promise<IInstrumentIdResponse> => {
    try {
      const apiResponse = await this.socket?.callExternalApi("GetInstruments", { omsId: this.omsId });

      const instruments = apiResponse as unknown as IInstrument[];

      const instrument = instruments.find((i) => i.Symbol === instrumentSymbol);

      return instrument
        ? Promise.resolve({
            instrumentId: instrument.InstrumentId,
            errorMessage: "",
          })
        : Promise.resolve({
            instrumentId: -1,
            errorMessage: `cannot quote ${instrumentSymbol}`,
          });
    } catch (e) {
      return Promise.resolve({
        instrumentId: -1,
        errorMessage: "Unknown error getting instrument id",
      });
    }
  };

  async safeCall(serviceName: IServiceName, payload: IPayload) {
    try {
      const response = await this.socket?.callExternalApi(serviceName, payload);
      return { response, errorMessage: "" };
    } catch (e) {
      console.error(e);
      return { errorMessage: `${e}` };
    }
  }

  getTickerHistory = async (coin: string, intervalInSeconds: number, fromDate: Date, toDate: Date) => {
    const instrument = this.instrumentForCoin(coin);
    if (instrument) {
      const { response, errorMessage } = await this.safeCall("GetTickerHistory", {
        OMSId: 1,
        InstrumentId: instrument.InstrumentId,
        Interval: intervalInSeconds,
        FromDate: fromDate.toISOString(),
        ToDate: toDate.toISOString(),
      });

      return { history: response, errorMessage };
    } else {
      return { history: [], errorMessage: `Instrument not found: ${coin}/BRL` };
    }
  };

  private instrumentForCoin(coin: string) {
    const symbol = `${coin.toUpperCase()}BRL`;
    return this.getInstruments().find((i) => i.Symbol === symbol);
  }

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
      const apiResponse = (await this.socket?.callExternalApi("GetDeposits", {
        OMSId: this.omsId,
        AccountId: accountId || "",
      })) as unknown as IGetDeposits[];

      apiResponse.forEach((deposit) => {
        const [{ Product }] = this.products.filter((product) => product.ProductId === deposit.ProductId);
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
        errorMessage: "",
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
    notes: string
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

    const [{ ProductId }] = this.products.filter((product) => product.Product === productName);

    try {
      const apiResponse = (await this.socket?.callExternalApi("TransferFunds", {
        OMSId: this.omsId,
        ProductId: ProductId || "",
        SenderAccountId: senderAccountId || "",
        ReceiverUsername: receiverUsername || "",
        Amount: amount || 0,
        Notes: notes || "",
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

export { Coinext };
