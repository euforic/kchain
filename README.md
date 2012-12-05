#Kchain

## Keychain API in Node.js

## Supported Platforms
- Mac OS X 10.6+

## TODO
- Windows support


## API

### kchain#

Create new Kchain instance
```js
var kchain = require('kchain');
```


### kchain#get

Get a password from the keychain

```js
kchain.get({
  account: 'myacount',
  service: 'someservice'
})
```

### kchain#set

Set/Update a password from the keychain

```js
kchain.set({
  account: 'myacount',
  service: 'someservice',
  password: 'pass1234'
})
```

### kchain#rm

Remove a password from the keychain

```js
kchain.rm({
  account: 'myacount',
  service: 'someservice'
})
```