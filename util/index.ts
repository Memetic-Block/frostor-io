import _ from 'lodash'
import { ec as EC } from 'elliptic'
import bs58check from 'bs58check'

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

function publicKeyToECKeyPair(publicKey: string): EC.KeyPair {
  // Sanity check similar to Base58CheckDecodePrefix from core/lib/base58.go
  if (publicKey.length < 5) {
    throw new Error('Failed to decode public key');
  }
  const decoded = bs58check.decode(publicKey);
  const payload = Uint8Array.from(decoded).slice(3);

  const ec = new EC('secp256k1');
  return ec.keyFromPublic(payload, 'array');
}

const PUBLIC_KEY_PREFIXES = {
  mainnet: {
    bitcoin: [0x00],
    deso: [0xcd, 0x14, 0x0],
  },
  testnet: {
    bitcoin: [0x6f],
    deso: [0x11, 0xc2, 0x0],
  },
}

function seexHexToDeSoPublicKey(seedHex: string): string {
  const ec = new EC('secp256k1')
  const privateKey = ec.keyFromPrivate(seedHex)
  const prefix = PUBLIC_KEY_PREFIXES['mainnet'].deso
  const key = privateKey.getPublic().encode('array', true)
  const prefixAndKey = Uint8Array.from([...prefix, ...key])

  return bs58check.encode(Buffer.from(prefixAndKey))
}

// @debounce
// async validateMnemonic() {
//   this.loading = true
//   try {
//     const seed = bip39.mnemonicToSeedSync(this.mnemonic)
//     const keychain = HDKey.fromMasterSeed(seed).derive('m/44\'/0\'/0\'/0/0')
//     this.seedHex = keychain.privateKey.toString('hex')
//     this.publicKey = seexHexToDeSoPublicKey(this.seedHex)
//   } catch (e) { console.error(e) }
//   this.loading = false
// }
