# dyws

Tiny douyu websocket library (< 5kb) in browser environment.

## Usage

```javascript
<script src="../dist/dyws.min.js"></script>

<script>
var roomId = '288016';
var ws = dyws.createDYWebsocket(roomId, {
  onMessage: function(msg) {
    console.log(msg);
  },
});
</script>
```

## API

### createDYWebsocket(roomId, handler, options) -> dywsInstance

- roomId: douyu room id, number
- handler: hadnler object, must have onMessage method
- options(optional): {url, group, keepLiveIntervalSecond}

url(optional): websocket url, default is wss://danmuproxy.douyu.com:8501

group(optional): join group, default is -9999

keepLiveIntervalSecond(optional): send keep alive message every n seconds

Close websocket:

use return value of createDYWebsocket, call `close` method

## Development

build: `yarn build`

test: `yarn test`

demo website: under `/demo` folder

## License

MIT
