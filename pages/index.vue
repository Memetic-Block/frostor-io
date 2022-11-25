<template>
  <div class="index-page">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Welcome to the {{ $config.eventName }}!</h1>

        <v-divider />

        <!-- <v-row v-if="!$accessor.auth.isLoggedIn">
          <v-col cols="12">
            Click "Connect" below to get started!
          </v-col>
        </v-row> -->

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
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="mnemonic"
                  label="DeSo Seed Phrase"
                  :disabled="authorized"
                  :loading="loading"
                />
                <v-btn
                  @click="validateMnemonic"
                  :disabled="authorized"
                  :loading="loading"
                >
                  Enter Seed Phrase
                </v-btn>
                or
                <v-btn
                  @click="useAlice"
                  :disabled="authorized"
                  :loading="loading"
                >Use Alice Public Test Seed Phrase</v-btn>
                <v-btn
                  color="red"
                  @click="reset"
                  :loading="loading"
                >
                  Reset
                </v-btn>
                <br /><br />
                <div v-if="publicKey">
                  <b>Public Key:&nbsp;</b><code>{{ publicKey }}</code>
                </div>
                <!-- 1) Request a derived key from the BundleDAO Node
                <br />
                <code>
                  GET /derived-key
                </code>
                <br />
                <v-btn @click="generateDerivedKey" :disabled="!!derivedPublicKey">
                  Generate Derived Key
                </v-btn>
                <br />
                <i v-if="derivedPublicKey">{{ derivedPublicKey }}</i> -->
              </v-col>
            </v-row>

            <!-- <v-row v-show="authorized">
              <v-col cols="12">
                2) Authorize derived key &amp; spending limit (coming soon!)
                <br />
                <code>POST /authorize</code>
                <br />
                <v-btn disabled>Authorize Derived Key</v-btn>
              </v-col>
            </v-row> -->

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
                  @click="post"
                  :loading="loading"
                  :disabled="(!hasFiles) || success"
                >
                  Post
                </v-btn>
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
                    <a target="_blank" :href="'http://localhost:1984/'+id">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as bip39 from 'bip39'
import HDKey from 'hdkey'
import { ec as EC } from 'elliptic'
import bs58check from 'bs58check'
import { BundleDAOClient } from '@artbycity/bundledao-client'

import { debounce, readFileAsArrayBufferAsync } from '~/util'

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

@Component
export default class IndexPage extends Vue {
  derivedPublicKey: string | null = null
  files: File[] | null = null
  mnemonic: string = ''
  publicKey: string = ''
  seedHex: string = ''
  loading: boolean = false
  bundleTxId: string = ''
  success: boolean = false
  itemTxIds: string[] = []
  prevItems: string[] = []

  get authorized(): boolean {
    return !!this.mnemonic && !!this.publicKey && !!this.seedHex
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
  async useAlice() {
    this.mnemonic =
      'twist fluid involve try decorate purse cream phone movie course iron until'
    await this.validateMnemonic()
  }

  @debounce
  async reset() {
    this.derivedPublicKey = null
    this.files = null
    this.mnemonic = ''
    this.publicKey = ''
    this.seedHex = ''
    this.loading = false
    this.bundleTxId = ''
    this.success = false
    this.itemTxIds = []
  }

  @debounce
  async generateDerivedKey() {
    // this.$deso.derive()
    this.derivedPublicKey = 'test-derived-public-key'
  }

  @debounce
  async onFileAdded(files: File[] | undefined) {
    if (files) {
      this.files = files
    }
  }

  @debounce
  async validateMnemonic() {
    this.loading = true
    try {
      const seed = bip39.mnemonicToSeedSync(this.mnemonic)
      const keychain = HDKey.fromMasterSeed(seed).derive('m/44\'/0\'/0\'/0/0')
      this.seedHex = keychain.privateKey.toString('hex')
      this.publicKey = seexHexToDeSoPublicKey(this.seedHex)
    } catch (e) { console.error(e) }
    this.loading = false
  }

  @debounce
  async post() {
    if (this.files) {
      const bundleDAO = new BundleDAOClient({
        deso: {
          seedHex: this.seedHex
        },
        bundleDAO: {
          protocol: 'http',
          host: 'localhost',
          port: 1985
        }
      })

      const items = []
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        const type = file.type
        const buffer = await readFileAsArrayBufferAsync(file)
        const data = new Uint8Array(buffer)
        const tags = [
          { name: 'Content-Type', value: type },
          { name: 'External-Network', value: 'DESO' },
          { name: 'External-Owner', value: this.publicKey },
        ]
        const dataItem = await bundleDAO.createData(data, { tags })
        items.push(dataItem)
      }

      const bundle = await bundleDAO.createBundle(items)
      this.bundleTxId = await bundleDAO.postBundle(bundle)
      if (this.bundleTxId) {
        this.success = true
        this.itemTxIds = bundle.getIds()
      }
    }
  }
}
</script>
