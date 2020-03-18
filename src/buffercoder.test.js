import { BufferCoder } from './buffercoder';

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
}

it('BufferCoder encode/decode test', () => {
  const bc = new BufferCoder();
  const msg = '123';
  const text = bc.encode(msg);

  expect(bufferToHex(text)).toBe(
    '0c 00 00 00 0c 00 00 00 b1 02 00 00 31 32 33 00'
  );
  bc.decode(text, msg => {
    expect(msg).toBe('123');
  });
});
