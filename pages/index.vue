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
                  color="red"
                  @click="reset"
                  :loading="loading"
                >Reset</v-btn>
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
import { Bundle } from 'arbundles'
import {
  BundleDAOClient
} from '@artbycity/bundledao-client'

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
}
</script>
