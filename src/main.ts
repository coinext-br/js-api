import {Coinext} from './coinext';

async function main() {

  const coinext = new Coinext();

  await coinext.connect();

  const {
    authenticated,
    errorMessage,
    isAuthenticatorEnabled
  } = await coinext.loginBySecret()


  console.log('authorized', authenticated);
  console.log('errorMessage', errorMessage);
  console.log('isAuthenticatorEnabled', isAuthenticatorEnabled);


  coinext.disconnect();
}

main().finally();