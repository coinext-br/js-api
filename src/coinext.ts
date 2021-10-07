import WebSocket from 'ws';
import config from "./config";
import crypto from 'crypto';

enum SocketOperation {
  Request = 0,
  Reply = 1,
  SubscribeToEvent = 2,
  Event = 3,
  UnSubscribeFromEvent = 4,
  Error = 5
}

type IPayloadRequest = {
  i: number;
  n: IServiceName;
  m: number;
  o: string;
}

type IServiceName =
  'AuthenticateUser' |
  'Authenticate2FA' |
  'GetUserAccounts' |
  'GetAccountPositions'

export type ILoginResponse = {
  errorMessage: string,
  authenticated: boolean,
  isAuthenticatorEnabled: boolean
}

export type  IAuthenticationResponse = {
  errorMessage: string,
  authenticated: boolean,
  userId: number,
}

export type  IUserAccountsResponse = {
  userAccounts: number[],
  errorMessage: string,
  hasMoreThanOneAccount: boolean
}

export type IUserTotalAccountBalanceResponse = {
  totalBalance: number,
  errorMessage: string,
}

export type ISendOrderRequest = {
  InstrumentId: number,
  AccountId: number,
  TimeInForce: number,
  ClientOrderId: number,
  OrderIdOCO: number,
  UseDisplayQuantity: boolean,
  Side: number,
  quantity: number,
  OrderType: number,
  PegPriceType: number,
  LimitPrice: number
}

export type IPayload = {
  [key: string]: string | number | boolean | IPayload | IPayload[] | null;
}

class Coinext {
  private index: number = 2;
  private omsId: number = 1;
  private minimumSystemIndexIncrement: number = 2;
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket(config.API_V2_URL);
  }

  connect = async (): Promise<void> => {
    const socket = new Promise<WebSocket>(function (resolve, reject) {
      const server = new WebSocket(config.API_V2_URL);
      server.onopen = function () {
        resolve(server);
      };
      server.onerror = function (err) {
        reject(err);
      };
    });

    this.socket = await socket;
  }

  disconnect = () => {
    this.socket.close();
  }

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
      this.socket.on('message', (reply) => {
        try {

          const {
            m: responseType,
            n: responseFunction,
            o: response,
            i: reponseIndex
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
            errorMessage: `Unknown error ${e}`
          })
        }
      })
    });
  }

  private static createSha256Signature(secret: string, message: any) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);
    return hmac.digest('hex');
  }

  private static authPayload(userId: string, apiKey: string, apiSecret: string) {
    let nonce = new Date().getTime();
    let signature = Coinext.createSha256Signature(apiSecret, `${nonce}${userId}${apiKey}`);

    return {
      'APIKey': apiKey,
      'Signature': signature,
      'UserId': `${userId}`,
      'Nonce': `${nonce}`
    };
  }

  loginBySecret = async (): Promise<ILoginResponse> => {
    try {
      const authenticationPayload = Coinext.authPayload('184650', '847e18af8ef83ac118f9635e51728ba6', 'b31877e649252f8a744ae74868d5daa7')

      console.log(authenticationPayload);

      const apiResponse = await this.callExternalApi('AuthenticateUser', authenticationPayload);

      console.log(apiResponse);

      const {
        errormsg: errorMessage,
        Authenticated: authenticated,
        Requires2FA: isAuthenticatorEnabled
      } = apiResponse;

      return {
        authenticated: authenticated as boolean,
        isAuthenticatorEnabled: isAuthenticatorEnabled as boolean,
        errorMessage: errorMessage as string
      }
    } catch (e) {
      return {
        authenticated: false,
        isAuthenticatorEnabled: false,
        errorMessage: 'Unknown login error'
      }
    }
  }

  login = async (username: string, password: string): Promise<ILoginResponse> => {
    try {
      const apiResponse = await this.callExternalApi('AuthenticateUser', {
        UserName: username || '',
        Password: password || ''
      });

      const {
        errormsg: errorMessage,
        Authenticated: authenticated,
        Requires2FA: isAuthenticatorEnabled
      } = apiResponse;

      return {
        authenticated: authenticated as boolean,
        isAuthenticatorEnabled: isAuthenticatorEnabled as boolean,
        errorMessage: errorMessage as string
      }
    } catch (e) {
      return {
        authenticated: false,
        isAuthenticatorEnabled: false,
        errorMessage: 'Unknown login error'
      }
    }
  }

  authenticate2FA = async (authenticatorCode: string): Promise<IAuthenticationResponse> => {
    try {
      const apiResponse = await this.callExternalApi('Authenticate2FA', {
        Code: authenticatorCode || '',
      });

      const {
        errormsg: errorMessage,
        Authenticated: authenticated,
        UserId: userId
      } = apiResponse;

      return {
        authenticated: authenticated as boolean,
        userId: userId as number,
        errorMessage: errorMessage as string
      }
    } catch (e) {
      return {
        authenticated: false,
        userId: -1,
        errorMessage: 'Unknown authentication error'
      }
    }
  }

  getUserAccounts = async (userName: string, userId: number): Promise<IUserAccountsResponse> => {
    try {
      const apiResponse = await this.callExternalApi('GetUserAccounts', {
        omsId: this.omsId,
        userId,
        userName: userName,
      });

      const userAccounts = apiResponse as unknown as number[];

      return {
        userAccounts,
        errorMessage: '',
        hasMoreThanOneAccount: userAccounts.length > 1
      }
    } catch (e) {
      return {
        userAccounts: [],
        hasMoreThanOneAccount: false,
        errorMessage: 'Unknown error getting user accounts'
      }
    }
  }

  getUserTotalAccountBalance = async (accountId: number): Promise<IUserTotalAccountBalanceResponse> => {
    type IGetAccountPositions = {
      OMSId: number,
      AccountId: number,
      ProductSymbol: string,
      ProductId: number,
      Amount: number,
      Hold: number,
      PendingDeposits: number,
      PendingWithdraws: number,
      TotalDayDeposits: number,
      TotalMonthDeposits: number,
      TotalYearDeposits: number,
      TotalDayDepositNotional: number,
      TotalMonthDepositNotional: number,
      TotalYearDepositNotional: number,
      TotalDayWithdraws: number,
      TotalMonthWithdraws: number,
      TotalYearWithdraws: number,
      TotalDayWithdrawNotional: number,
      TotalMonthWithdrawNotional: number,
      TotalYearWithdrawNotional: number,
      NotionalProductId: number,
      NotionalProductSymbol: string,
      NotionalValue: number,
      NotionalHoldAmount: number,
      NotionalRate: number
    }[]

    try {
      const apiResponse = await this.callExternalApi('GetAccountPositions', {
        OMSId: this.omsId,
        AccountId: accountId || '',
      }) as unknown as IGetAccountPositions;

      const totalBalance = apiResponse
        .filter(currency => currency.ProductSymbol === 'BRL')
        .map(item => item.Amount)
        .reduce((prev, curr) => prev + curr, 0);

      return {
        totalBalance,
        errorMessage: '',
      }
    } catch (e) {
      return {
        totalBalance: 0,
        errorMessage: 'Unknown error getting user account balance',
      }
    }
  }
}

export {Coinext};
