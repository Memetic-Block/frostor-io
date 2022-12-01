<template>
  <div class="index-page">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Welcome to the {{ $config.eventName }}!</h1>

        <v-divider />

        <v-row>
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12">
                <p>
                  This demo showcases the use of the BundleDAO Client and Node
                  JavaScript libraries to sign content with a DeSo identity for
                  uploading to the Arweave network.
                </p>
                <p>
                  Presented below is a form to enter a DeSo seed phrase which is
                  used to sign the Arweave ANS-104 Bundle and Data Items.  This
                  bundle is posted to a local Arweave testnet at no cost.
                </p>
                <p>
                  The full scope of this project is to enable Derived Keys to
                  sign bundles and authorized with a spending limit to pay for
                  atomic finality and permanent storage on Arweave. Coming soon!
                </p>
                <ul>
                  <li>
                    <a
                      target="_blank"
                      href="https://daodao.io/profile/BundleDAO"
                    >
                      BundleDAO on DAODAO
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://gitlab.com/art-by-city/bundledao-demo"
                    >
                      Demo App Code
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://gitlab.com/art-by-city/bundledao-client"
                    >
                      BundleDAO Client
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://gitlab.com/art-by-city/bundledao-node"
                    >
                      BundleDAO Node
                    </a>
                  </li>
                </ul>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12">
                <ConnectButton />
              </v-col>
            </v-row>

            <v-row v-show="authorized">
              <v-col cols="12">
                Choose your files
                <br />
                <v-file-input
                  multiple
                  show-size
                  @change="onFileAdded($event)"
                ></v-file-input>
              </v-col>
            </v-row>

            <v-row v-show="authorized">
              <v-col cols="12">
                (5mb limit, free for now on demo Arweave testnet)
                <br />
                <v-btn
                  @click="sign"
                  :loading="loading"
                  :disabled="!hasFiles"
                >Sign</v-btn>

                <v-btn
                  @click="post"
                  :loading="loading"
                  :disabled="!signed"
                >Post</v-btn>
              </v-col>
            </v-row>

            <v-row v-show="success">
              <v-col cols="12">
                <b>Bundle TX:</b>&nbsp;<code>{{ bundleTxId }}</code>
                <br />
                <b>Items:</b>
                <br />
                <ul>
                  <li v-for="(id, i) in itemTxIds" :key="id">
                    <a target="_blank" :href="$config.gateway+'/'+id">
                      {{ id }}
                    </a>
                  </li>
                </ul>
              </v-col>
            </v-row>

            <!-- <v-row>
              <v-col cols="12">
                <h2>Previously Posted Demo Bundles</h2>
                <v-row v-for="">
                </v-row>
              </v-col>
            </v-row> -->
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <iframe
      id="identity"
      ref="identity"
      frameborder="0"
      :src="identityUrl+'/embed'"
      style="height: 100vh; width: 100vw; display: none; position: fixed;
        z-index: 1000; left: 0; top: 0;"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as bip39 from 'bip39'
import HDKey from 'hdkey'
import { ec as EC } from 'elliptic'
import bs58check from 'bs58check'
import {
  BundleDAOClient,
  InjectedDeSoSigner
} from '@artbycity/bundledao-client'
import { createData } from 'arbundles'
import { Signer } from 'arbundles/src/signing'
import { SignatureConfig, SIG_CONFIG } from 'arbundles/src/constants'
import { ethers } from 'ethers'
import EthereumSigner from 'arbundles/src/signing/chains/ethereumSigner'
import secp256k1 from 'secp256k1'
import { arrayify, hashMessage } from 'ethers/lib/utils'
import base64url from 'base64url'

import ConnectButton from '~/components/ConnectButton.vue'
import { debounce, readFileAsArrayBufferAsync, uuid } from '~/util'


const ec = new EC('secp256k1')
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
  const privateKey = ec.keyFromPrivate(seedHex)
  const prefix = PUBLIC_KEY_PREFIXES['mainnet'].deso
  const key = privateKey.getPublic().encode('array', true)
  const prefixAndKey = Uint8Array.from([...prefix, ...key])

  return bs58check.encode(Buffer.from(prefixAndKey))
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

@Component({
  components: {
    ConnectButton
  }
})
export default class IndexPage extends Vue {
  files: File[] | null = null
  loading: boolean = false
  signed: boolean = false
  bundleTxId: string = ''
  success: boolean = false
  itemTxIds: string[] = []
  prevItems: string[] = []

  $refs!: {
    identity: Vue & HTMLIFrameElement
  }

  identityUrl: string = this.$config.identityUrl

  get authorized(): boolean {
    return !!this.$accessor.auth.address
  }

  get hasFiles(): boolean {
    return !!this.files && this.files.length > 0
  }

  // fetchOnServer = false
  // async fetch() {}

  // @debounce
  // async debouncedFetch() {
  //   if (!this.$fetchState.pending) {
  //     this.$fetch()
  //   }
  // }

  @debounce
  async reset() {
    this.files = null
    this.loading = false
    this.signed = false
    this.bundleTxId = ''
    this.success = false
    this.itemTxIds = []
  }

  @debounce
  async onFileAdded(files: File[] | undefined) {
    if (files) {
      this.files = files
    }
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

  @debounce
  async sign() {
    if (this.files) {
      this.loading = true
      try {
        if (this.$refs.identity.contentWindow) {

        const bundleDAO = new BundleDAOClient({
          bundleDAO: this.$config.bundleDAOConfig,
          deso: {

          }
        })



          const signer = new InjectedDeSoSigner(
            this.$accessor.auth.address,
            (id, message) => {
              console.log('signing with identity service', id)
              this.$refs.identity.contentWindow!.postMessage({
                id,
                service: 'identity',
                method: 'signETH',
                payload: {
                  unsignedHashes: [ message ],
                  encryptedSeedHex: this.$accessor.auth.encryptedSeedHex,
                  accessLevel: this.$accessor.auth.accessLevel,
                  accessLevelHmac: this.$accessor.auth.accessLevelHmac
                }
              }, { targetOrigin: this.$config.identityUrl })
            }
          )

          const file = this.files![0]
          const type = file.type
          const buffer = await readFileAsArrayBufferAsync(file)
          const data = new Uint8Array(buffer)
          const tags = [
            { name: 'Content-Type', value: type },
            { name: 'External-Network', value: 'DESO' },
          ]
          const dataItem = createData(data, signer, { tags })
          await dataItem.sign(signer)
          console.log('[INJECTED] dataItem signed?', dataItem.isSigned())
          console.log('[INJECTED] dataItem verified?', InjectedDeSoSigner.verify(
            dataItem.rawOwner,//signer.publicKey,
            await dataItem.getSignatureData(),
            dataItem.rawSignature
          ))
          console.log('[INJECTED] dataItem valid?', await dataItem.isValid())
          this.signed = true
        }
      } catch (e) { console.error(e) }
      this.loading = false
    }
  }

  @debounce
  async post() {
    if (this.files) {
      this.loading = true
      try {


        // const signer = new DeSoSigner(this.mnemonic)
        // const signer2 = new EthereumSigner(this.seedHex)

        // console.log('[DESOSIGNER] public key', signer.publicKey.toString('hex'))
        // console.log('[ETHEREUMSIGNER] public key', signer2.publicKey.toString('hex'))

        const items = []
        for (let i = 0; i < this.files.length; i++) {
          // const file = this.files[i]
          // const type = file.type
          // const buffer = await readFileAsArrayBufferAsync(file)
          // const data = new Uint8Array(buffer)
          // const tags = [
          //   { name: 'Content-Type', value: type },
          //   { name: 'External-Network', value: 'DESO' },
          //   { name: 'External-Owner', value: publicKey },
          // ]
          // const dataItem = await bundleDAO.createData(data, { tags })
          const data = 'test string'
          // const dataItem = createData(data, signer)
          // await dataItem.sign(signer)
          // console.log('[DESOSIGNER] data item valid?', await dataItem.isValid())
          // const dataItem2 = await create

          // const dataItem2 = createData(data, signer2)
          // await dataItem2.sign(signer2)
          // console.log('[ETHEREUMSIGNER] data item valid?', await dataItem2.isValid())

          // items.push(dataItem2)
        }

        // const bundle = await bundleDAO.createBundle(items)
        // this.bundleTxId = await bundleDAO.postBundle(bundle)
        // if (this.bundleTxId) {
        //   this.success = true
        //   this.itemTxIds = bundle.getIds()
        // }
      } catch (e) { console.error(e) }
      this.loading = false
    }
  }
}
</script>
