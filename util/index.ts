import _ from 'lodash'

export type AnyFunction = ((...args: any) => any)

const _debounce = (
  _target: Object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<AnyFunction>
) => {
  const timeout = 300
  if (descriptor.value) {
    descriptor.value = _.debounce(
      descriptor.value,
      timeout,
      { leading: true, trailing: false }
    )
  }

  return descriptor
}

export const debounce: MethodDecorator = <AnyFunction>_debounce

export const readFileAsArrayBufferAsync = (blob: Blob):
  Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = async (error) => {
      reject(error)
    }
    reader.onload = (evt) => {
      if (!evt.target || !evt.target.result) {
        reject('Error reading file')
      }

      resolve(reader.result as ArrayBuffer)
    }
    reader.readAsArrayBuffer(blob)
  })
}

export function longTo32ByteArray(long: number): Uint8Array {
  // we want to represent the input as a 8-bytes array
  const byteArray = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ];

  for (let index = 0; index < byteArray.length; index++) {
    const byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return Buffer.from(byteArray);
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
