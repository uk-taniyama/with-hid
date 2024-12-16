import { findHidDevices, getHidDevices, withHid } from 'with-hid';

import type { HidDeviceQuery } from 'with-hid';

const query: HidDeviceQuery = {
  vendorId: 4489, // 0x1189
  productId: 34880, // 0x8840
  usagePage: 65280, // 0xFF00
  usage: 1, // 0x0000
};

console.log('# All devices');
const devices = getHidDevices();
devices.forEach((d) => console.log(JSON.stringify(d)));

console.log('# Find devices');
const found = findHidDevices(query);
found.forEach((d) => console.log(JSON.stringify(d)));
if (found.length !== 1) {
  process.exit(-1);
}

async function main() {
  await withHid(found[0], async (hid) => {
    console.log('SEND');
    await hid.write([
      0x03, 0xfb, 0xfb, 0xfb, 0x00, 0x00, 0x00, 0x00, // 8
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 16
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 24
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 32
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 40
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 48
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 56
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 64
      0x00, //
    ]);
    console.log('RECV');
    const res1 = await hid.read(250);
    if (res1.length === 0) {
      console.log('timeout');
    } else {
      console.log(res1);
    }
    const res2 = await hid.read(250);
    if (res2.length === 0) {
      console.log('timeout');
    } else {
      console.log(res2);
    }
  });
}
main().catch((e) => console.error(e));
