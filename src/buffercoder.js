/* buffer layer 
arraybuffer <-> string
*/
export class BufferCoder {
  constructor() {
    this.buffer = new ArrayBuffer(0);
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();
    this.littleEndian = !0;
    this.readLength = 0;
  }

  concat() {
    for (var e = [], len = 0; len < arguments.length; len++) {
      e[len] = arguments[len];
    }
    return e.reduce(function(e, t) {
      var r = t instanceof ArrayBuffer ? new Uint8Array(t) : t,
        n = new Uint8Array(e.length + r.length);
      n.set(e, 0);
      n.set(r, e.length);
      return n;
    }, new Uint8Array(0));
  }

  /* notice: buffer coder will decode data as straming ,
      so one raw block will generate 0 to multiple messages
      */
  decode(raw, callback, isLittle) {
    void 0 === isLittle && (isLittle = this.littleEndian);
    this.buffer = this.concat(this.buffer, raw).buffer;
    for (this.buffer && this.buffer.byteLength > 0; ; ) {
      if (0 === this.readLength) {
        if (this.buffer.byteLength < 4) return;
        this.readLength = new DataView(this.buffer).getUint32(0, isLittle);
        this.buffer = this.buffer.slice(4);
      }
      if (this.buffer.byteLength < this.readLength) return;
      var text = this.decoder.decode(this.buffer.slice(8, this.readLength - 1));
      this.buffer = this.buffer.slice(this.readLength);
      this.readLength = 0;
      callback(text);
    }
  }
  encode(text, isLittle) {
    void 0 === isLittle && (isLittle = this.littleEndian);
    text = this.concat(this.encoder.encode(text), Uint8Array.of(0));
    var value = 8 + text.length;
    var result = new DataView(new ArrayBuffer(value + 4));
    var offset = 0;
    result.setUint32(offset, value, isLittle);
    offset += 4;
    result.setUint32(offset, value, isLittle);
    offset += 4;
    result.setInt16(offset, 689, isLittle);
    offset += 2;
    result.setInt8(offset, 0);
    offset += 1;
    result.setInt8(offset, 0);
    offset += 1;
    new Uint8Array(result.buffer).set(text, offset);
    return result.buffer;
  }
}
