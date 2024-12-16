import { isMatch } from 'lodash-es';
import HID from 'node-hid';

import type EventEmitter from 'node:events';

export type HidDevice = HID.Device;
export type HidDeviceQuery = Partial<HidDevice>;

/**
 * Retrieves the list of all connected HID devices.
 */
export function getHidDevices() {
  return HID.devices();
}

/**
 * Finds devices that match the given query criteria.
 */
export function findHidDevices(query: HidDeviceQuery) {
  return getHidDevices().filter((i) => isMatch(i, query));
}

export type Hid = HID.HIDAsync;
export type HidIO = Omit<Hid, keyof EventEmitter | 'close' | 'read'> & {
  read(timeoutMs?: number): Promise<Buffer>;
};

export function normalizeBuffer(buffer: Buffer | undefined): Buffer {
  if (buffer == null) {
    return Buffer.alloc(0);
  }
  return buffer;
}

/* eslint-disable no-param-reassign */
/**
 * Enhances the provided `Hid` object by wrapping its `read` method
 * to normalize its output before returning it. This function modifies
 * the original `Hid` object and returns it as a new type `HidIO`.
 *
 */
export function wrapHid(hid: Hid) {
  // Save the original `read` method of the `hid` object for later use.
  const hidRead = hid.read;

  // Override the `read` method of the `hid` object.
  hid.read = async function wrapRead(time_out: number | undefined): Promise<Buffer> {
    const buffer = await hidRead.call(hid, time_out);
    return normalizeBuffer(buffer);
  };

  return hid as HidIO;
}
/* eslint-enable no-param-reassign */

/**
 * Performs HID communication by opening a connection, executing a specified process,
 * and then closing the connection once the process is complete.
 */
export async function withHid<T>(device: HidDevice, process: (hid: HidIO) => Promise<T>): Promise<T> {
  const hid = await HID.HIDAsync.open(device.path!);
  try {
    return await process(wrapHid(hid));
  } finally {
    await hid.close();
  }
}
