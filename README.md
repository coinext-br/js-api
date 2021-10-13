# js-api

Public Coinext Javascript API.  
It is written in vanilla JS typed using Typescript.

## Installing in a external project

Simply add the package to your `package.json` and install it using your favorite package manager.

## Installing the development environment

1.  Clone the repo
    ```
    git clone https://github.com/coinext-br/js-api.git
    ```
2.  Install the node modules
    ```
    yarn
    ```
3.  Build the project
    ```
    yarn run build
    ```

## Usage

All of the API functionalities can be called using the `Coinext` class methods. Each time it is instantiated, a new WebSocket connection is established.  
Example of usage:
```javascript
const coinext = new Coinext();
await coinext.connect();
const instruments = coinext.getInstruments();
await coinext.disconnect();
```