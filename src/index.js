import { MsgCoder } from "./msgcoder";
import { BufferCoder } from "./buffercoder";
/*
roomId: douyu room id, number
handler: hadnler object, must have onMessage method
options(optional): 
  url(optional): websocket url, default is wss://danmuproxy.douyu.com:8501
  grouop(optional): join group, default is -9999
  keepLiveIntervalSecond(optional): send keep alive message every n seconds
*/
export function createDYWebsocket(roomId, handler, options) {
  if (options === undefined) {
    options = {};
  }
  // buffer coder instance for websocket
  const bc = new BufferCoder();

  function encode(msg) {
    const payload = MsgCoder.encode(msg);
    const data = bc.encode(payload);
    return data;
  }

  function decode(data, callback) {
    bc.decode(data, function(payload) {
      const msg = MsgCoder.decode(payload);
      return callback(null, msg);
    });
  }

  const url = options.url || "wss://danmuproxy.douyu.com:8501";
  let websocket = new WebSocket(url);
  // deafult onmessage data type is 'bolb'
  // change it to arraybuffer
  websocket.binaryType = "arraybuffer";

  let keepliveTimer = null;

  websocket.onopen = function(evt) {
    // login request
    const loginreqCommand = {
      type: "loginreq",
      roomid: roomId
    };
    websocket.send(encode(loginreqCommand));
    // start keepalive routine
    const intervalSecond = options.keepLiveIntervalSecond || 45;
    keepliveTimer = setInterval(function() {
      const keepliveCommand = {
        type: "mrkl"
      };
      websocket.send(encode(keepliveCommand));
    }, intervalSecond * 1000);
  };
  websocket.onclose = function(evt) {
    // stop interval
    if (keepliveTimer !== null) {
      clearInterval(keepliveTimer);
    }

    if (handler.onClose !== undefined) {
      handler.onClose();
    }
  };
  websocket.onmessage = function(evt) {
    decode(evt.data, function(err, msg) {
      handler.onMessage(msg);
      if (msg.type === "loginres") {
        // join group
        const joinGroupCommand = {
          type: "joingroup",
          rid: roomId,
          gid: options.group || "-9999"
        };

        websocket.send(encode(joinGroupCommand));
      }
    });
  };
  websocket.onerror = function(evt) {};
  return websocket;
}
