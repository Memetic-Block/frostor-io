<template>
  <div class="demo-page">
    <!-- <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-row>
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12">
                <p>
                  This demo showcases the use of the BundleDAO Client and Node
                  JavaScript libraries to sign content with a DeSo identity for
                  uploading to the Arweave network.
                </p>
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
                  v-model="files"
                  :loading="loading"
                  :disabled="(!!bundle && !!bundleDAO) || loading"
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
                  :disabled="!hasFiles || (!!bundle && !!bundleDAO)"
                >Sign</v-btn>

                <v-btn
                  @click="post"
                  :loading="loading"
                  :disabled="!bundle || !bundleDAO"
                >Post</v-btn>

                <v-btn
                  @click="getBalance"
                  :loading="loading"
                >Get Balance</v-btn>

                <v-btn
                  color="red"
                  @click="reset"
                  :loading="loading"
                >Reset</v-btn>

                <v-btn
                  color="yellow"
                  @click="test"
                  :loading="loading"
                >Test</v-btn>
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
    ></iframe> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Bundle } from 'arbundles'
import {
  BundleDAOClient,
  InjectedDeSoSigner
} from '@artbycity/bundledao-client' //'../../bundledao-client/src'
import Arweave from 'arweave'
import bs58check from 'bs58check'

import ConnectButton from '~/components/ConnectButton.vue'
import { debounce, readFileAsArrayBufferAsync } from '~/util'


@Component({
  components: {
    ConnectButton
  }
})
export default class IndexPage extends Vue {
  files: File[] | null = null
  loading: boolean = false
  bundleTxId: string = ''
  success: boolean = false
  itemTxIds: string[] = []
  prevItems: string[] = []
  bundle: Bundle | null = null
  identityUrl: string = this.$config.identityUrl
  bundleDAO: BundleDAOClient | null = null

  $refs!: {
    identity: Vue & HTMLIFrameElement
  }

  get authorized(): boolean {
    return !!this.$accessor.auth.address
  }

  get hasFiles(): boolean {
    return !!this.files && this.files.length > 0
  }

  get hasBundle(): boolean {
    return !!this.bundle
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
    this.bundleTxId = ''
    this.success = false
    this.itemTxIds = []
    this.bundle = null
    this.bundleDAO = null
  }

  @debounce
  async sign() {
    if (this.files) {
      this.loading = true
      try {
        if (this.$refs.identity.contentWindow) {
          const privateKey = {
            desoPublicKey: this.$accessor.auth.address,
            encryptedSeedHex: this.$accessor.auth.encryptedSeedHex,
            accessLevelHmac: this.$accessor.auth.accessLevelHmac
          }
          this.bundleDAO = new BundleDAOClient(
            'deso',
            privateKey,
            this.$config.bundleDAOConfig
          )

          let items = []
          for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i]
            const type = file.type
            const buffer = await readFileAsArrayBufferAsync(file)
            const data = new Uint8Array(buffer)
            const tags = [
              { name: 'Content-Type', value: type },
              { name: 'External-Network', value: 'DESO' },
              { name: 'External-Owner', value: this.$accessor.auth.address }
            ]
            const dataItem = await this.bundleDAO.createData(data, { tags })
            items.push(dataItem)
          }

          this.bundle = this.bundleDAO.createBundle(items)
        }
      } catch (e) { console.error(e) }
      this.loading = false
    }
  }

  @debounce
  async post() {
    if (this.bundle && this.bundleDAO) {
      this.loading = true
      try {
        this.bundleTxId = await this.bundleDAO.postBundle(this.bundle)
        if (this.bundleTxId) {
          this.success = true
          this.itemTxIds = this.bundle.getIds()
        }
      } catch (e) { console.error(e) }
      this.loading = false
    }
  }

  @debounce
  async getBalance() {
    const privateKey = {
      desoPublicKey: this.$accessor.auth.address,
      encryptedSeedHex: this.$accessor.auth.encryptedSeedHex,
      accessLevelHmac: this.$accessor.auth.accessLevelHmac
    }
    this.bundleDAO = new BundleDAOClient(
      'deso',
      privateKey,
      this.$config.bundleDAOConfig
    )
    try {
      const balance = await this.bundleDAO.getBalance()
      console.log('index.vue getBalance() balance', balance)
    } catch (e) {
      console.error(e)
    }
  }

  @debounce
  async test() {
    if (this.$refs.identity.contentWindow) {
      const signer = new InjectedDeSoSigner({
        desoPublicKey: this.$accessor.auth.address,
        encryptedSeedHex: this.$accessor.auth.encryptedSeedHex,
        accessLevelHmac: this.$accessor.auth.accessLevelHmac,
        identityUrl: this.$config.identityUrl,
        identityIframe: this.$refs.identity,
        window: window
      })
      const msg = 'ark linking req'
      const msgBuf = Buffer.from(msg)
      const sig = await signer.sign(msgBuf)
      const verified = InjectedDeSoSigner.verify(
        signer.publicKey,
        msgBuf,
        sig
      )
      const pk = Arweave.utils.bufferTob64Url(signer.publicKey)
      console.log('test pk', pk)
      console.log('test verified', verified)
      console.log('test signature bytelength', sig.byteLength)

      const address = this.$accessor.auth.address
      const message = Arweave.utils.bufferTob64Url(msgBuf)
      const signature = Arweave.utils.bufferTob64Url(sig)

      const deSig = Arweave.utils.b64UrlToBuffer(signature)
      console.log('test deSig bytelength', deSig.byteLength)
      // const decodedPk = Arweave.utils.b64UrlToBuffer(pk)
      // console.log('test decodedPk', )

      console.log('test address', address)
      console.log('test message', message)
      console.log('test signature', signature)
      const { data, status, statusText } = await this.$axios.get(
        `http://localhost:3001/deso-auth/${address}/${message}/${signature}`
      )
      console.log('test data, status, statusText', data, status, statusText)
    }
  }
}
</script>
