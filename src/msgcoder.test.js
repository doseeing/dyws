import { MsgCoder } from './msgcoder';

it('MsgCoder encode/decode test', () => {
  const e = {
    type: 'loginreq',
    roomid: '196',
    dfl: 'sn@A=105@Sss@A=1',
    username: '',
    uid: '',
  };
  const r = MsgCoder.encode(e);
  expect(r).toBe(
    'type@=loginreq/roomid@=196/dfl@=sn@AA=105@ASss@AA=1/username@=/uid@=/'
  );
  const e2 = MsgCoder.decode(r);
  expect(e2).toEqual(e);
});
