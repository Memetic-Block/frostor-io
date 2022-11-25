import Arweave from 'arweave'
import BundleDAONode from '@artbycity/bundledao-node'

import testweaveJWK from './testweave-keyfile.json'

const ARWEAVE_PROTOCOL = process.env.ARWEAVE_PROTOCOL || 'http'
const ARWEAVE_HOST = process.env.ARWEAVE_HOST || 'localhost'
const ARWEAVE_PORT = process.env.ARWEAVE_PORT
  ? Number.parseInt(process.env.ARWEAVE_PORT)
  : 1984

const arweave = new Arweave({
  protocol: ARWEAVE_PROTOCOL,
  host: ARWEAVE_HOST,
  port: ARWEAVE_PORT
})

const bob = 'favorite dutch must lift cart supreme bicycle elbow travel coin fruit learn'

const bundleDAONode = new BundleDAONode(bob, testweaveJWK, arweave, '')
const callback = bundleDAONode.app.callback()

export default callback
