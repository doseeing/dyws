/* message layer: like JSON protocol
string <-> object
*/
export class MsgCoder {
  static encode(e, t) {
    if ("string" === typeof e) return e;
    var r = Object.prototype.toString.call(e);
    var n = "[object Array]" === r;
    var o =
      "[object Object]" === r &&
      (null === Object.getPrototypeOf(e) || Object === e.constructor);
    return n || o
      ? Object.keys(e).reduce(function(t, r) {
          return (
            t +
            (n
              ? ""
              : r.replace(/@|\//g, function(e) {
                  return "@" + ("@" === e ? "A" : "S");
                }) + "@=") +
            MsgCoder.encode(e[r], !0).replace(/@|\//g, function(e) {
              return "@" + ("@" === e ? "A" : "S");
            }) +
            "/"
          );
        }, "")
      : (t ||
          console.error(
            "%c [@shark/net - encode]: Illegal parameter!\n  The argument must be a valid string, a plain object or a array!!!",
            "color: #f0f; font-size: 20px;",
            e
          ),
        t ? String(e) : "");
  }
  static decode(text) {
    var n, u;
    if ("string" === typeof text && text) {
      for (
        var source =
            "/" !== text.charAt(text.length - 1) ? text.concat("/") : text,
          length = source.length,
          result = /@=/g.test(source) ? {} : [],
          pos = 0,
          o = "",
          s = "";
        pos < length;

      ) {
        var a = source.charAt(pos);
        if ("/" === a) {
          if (Array.isArray(result)) {
            result.push(s);
          } else {
            result[o] = s;
            o = (n = ["", ""])[0];
            s = n[1];
          }
        } else if ("@" === a) {
          pos += 1;
          switch (source.charAt(pos)) {
            case "A":
              s += "@";
              break;
            case "S":
              s += "/";
              break;
            case "=":
              o = (u = [s, ""])[0];
              s = u[1];
              break;
            default:
              break;
          }
        } else s += a;
        pos += 1;
      }
      return result;
    }
    console.error(
      "%c [@shark/net - decode]: Illegal parameter!\n  The argument must be a valid string!!!",
      "color: #f0f; font-size: 20px;",
      text
    );
  }
}
