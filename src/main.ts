import {Coinext} from './coinext';

async function main() {

  const coinext = new Coinext();

  await coinext.connect();

  const {
    isAuthenticatorEnabled,
    authenticated
  } = await coinext.login('', '');

  console.log('authorized', authenticated);
  console.log('isAuthenticatorEnabled', isAuthenticatorEnabled);

  await coinext.disconnect();
}

main().finally();