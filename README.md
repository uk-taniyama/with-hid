# with-hid

The 'withHid' function simplifies working with 'node-hid' by automating device connection and disconnection. 

## Example

```ts
import { withHid, findHidDevices } from 'with-hid';

async function example() {
  const devices = findHidDevices({ vendorId: 0x1234, productId: 0x5678 });

  if (devices.length === 0) {
    console.error('No matching HID devices found.');
    return;
  }

  const result = await withHid(devices[0], async (hid) => {
    // Perform read/write operations on the HID device
    await hid.write([0x01, 0x02, 0x03, 0x04]);
    const response = await hid.read(5000); // Read with a timeout
    console.log('Received data:', response);
    return response.toString('hex');
  });

  console.log('Processed result:', result);
}
```
