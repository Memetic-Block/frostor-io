import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

import { accessorType } from '~/store'

export type DeSoIdentityMessage = {
  id: string,
  method: string,
  payload: any,
  service: 'identity'
}

export type DeSoLoginPayload = {
  publicKeyAdded?: string,
  signedUp: boolean,
  users: { [address: string]: {
    accessLevel: number,
    accessLevelHmac: string,
    btcDepositAddress: string,
    derivedPublicKeyBase58Check?: string,
    encryptedMessagingKeyRandomness?: string | number,
    encryptedSeedHex: string,
    ethDepositAddress: string,
    hasExtraText: boolean,
    loginMethod: string,
    network: string,
    verion: 2
  }}
}

export type DeSoDerivePayload = {
  derivedSeedHex: string,
  derivedPublicKeyBase58Check: string,
  publicKeyBase58Check: string,
  btcDepositAddress: string,
  ethDepositAddress: string,
  expirationBlock: number,
  network: string,
  accessSignature: string,
  jwt: string,
  derivedJwt: string
}

export class DeSoPlugin {
  private $store!: typeof accessorType
  private win: Window | null = null
  private identityBaseUrl: string = 'https://identity.deso.org'

  constructor($store: typeof accessorType, identityBaseUrl?: string) {
    if (identityBaseUrl) {
      this.identityBaseUrl = identityBaseUrl
    }
    this.$store = $store
    this.listen()
  }

  login() {
    this.openWindow('/log-in?accessLevelRequest=4')
  }

  logout() {
    this.openWindow('/logout')
  }

  derive() {
    const limit = {
      'GlobalDESOLimit': 10000000,
      // 'TransactionCountLimitMap': {
      //   'BASIC_TRANSFER': 1
      // },
      // 'CreatorCoinOperationLimitMap': {},
      // 'DAOCoinOperationLimitMap': {},
      // 'NFTOperationLimitMap': {}
    }
    const limitEncoded = encodeURIComponent(JSON.stringify(limit))
    const bob = 'BC1YLieYKGmJQWYnn1zJovTXuSZZ4EKMDUfgwKgSD6KMStsLmqGaxz8'
    this.openWindow(
      `/derive?transactionSpendingLimitResponse=${limitEncoded}&derivedPublicKey=${bob}`
    )
  }

  private openWindow(url: string) {
    const h = 1000
    const w = 800
    const y = window.outerHeight / 2 + window.screenY - h / 2
    const x = window.outerWidth / 2 + window.screenX - w / 2
    this.win = window.open(
      this.identityBaseUrl + url,
      'hello-auth-please',
      `toolbar=no, width=${w}, height=${h}, top=${y}, left=${x}`
    )
  }

  private listen() {
    window.addEventListener('message', (event) => this.handleMessage(event))
  }

  private handleMessage(event: MessageEvent<any>) {
    switch (event.data.service) {
      case 'identity':
        this.handleIdentityMessage(event.data, event.source!)
        break
      default:
        console.log('got other service message', event.data)
        break
    }
  }

  private handleIdentityMessage(
    message: DeSoIdentityMessage,
    source: MessageEventSource
  ) {
    console.log('got identity message', message)
    switch (message.method) {
      case 'initialize':
        source.postMessage({
          id: message.id,
          service: 'identity',
          payload: {}
        }, { targetOrigin: this.identityBaseUrl })
        break
      case 'login':
        const loginPayload: DeSoLoginPayload = message.payload
        if (loginPayload.publicKeyAdded) {
          const address = loginPayload.publicKeyAdded
          const encryptedSeedHex = loginPayload.users[address].encryptedSeedHex
          const accessLevel = loginPayload.users[address].accessLevel
          const accessLevelHmac = loginPayload.users[address].accessLevelHmac
          this.$store.auth.connect({ address, encryptedSeedHex, accessLevel, accessLevelHmac })
        } else {
          this.$store.auth.disconnect()
        }
        this.win?.close()
        break
      case 'derive':
        const derivePayload: DeSoDerivePayload = message.payload
        console.log('derivePayload', derivePayload)
        break
      default:
        break
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $deso: DeSoPlugin
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $deso: DeSoPlugin
  }

  interface Context {
    $deso: DeSoPlugin
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $deso: DeSoPlugin
  }
}

export default ({ $config, $accessor }: Context, inject: Inject) => {
  inject('deso', new DeSoPlugin($accessor, $config.identityUrl))
}
