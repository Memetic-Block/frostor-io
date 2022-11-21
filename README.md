# Art By City - Tezos Arweave Bundles Demo

## Abstract
There is a severe lack of Arweave adoption & support in the Tezos ecosystem for on-chain asset and data storage.  The ArBundles library doesn't support signing or creation of Arweave L2 data items from a Tezos wallet keypair and there is no open source API or service available to ensure Arweave bundle transactions created in such a way are posted to the Arweave network and un-bundled.

This project aims to address both issues by providing a wrapper library for the ArBundles library that adds Tezos wallet keypair support for the signing and creation of Arweave L2 data items and by providing an open-source API & service capable of accepting such bundle transactions and posting them to the Arweave network via Arweave utility wallet.

## Overview

This repo is a demo NuxtJS webapp to show off a simple use case of creating, signing, and posting JSON data to the Arweave network using a Tezos wallet keypair - as well as the REST API "bundler node" that posts this bundle to the Arweave network on behalf of the Tezos wallet's identity.  The two major components in use are the JS library [Tezos ArBundles](https://gitlab.com/art-by-city/tezos-arbundles) & REST API provided by [Tezos Bundler](https://gitlab.com/art-by-city/tezos-bundler) - both developed for the 2022 Metamorphosis Hackathon Build for Builders Bounty.

A `bundle` is an [ANS-104](https://github.com/joshbenaron/arweave-standards/blob/ans104/ans/ANS-104.md) compliant transaction on Arweave.  ANS-104 bundles are useful for storage of assets from wallet identities originating on external blockchains such as Tezos.  Bundles are comprised of `DataItem` which are signed directly by the originating blockchain keypair.  `DataItem` are similar to Arweave L1 transactions lacking a few fields and support from a few Arweave Gateway endpoints.

## Demo

A testnet demo is hosted at: https://tezos-arweave-bundles-demo.artby.city

Messages posted by the form are signed with the publcly available Flextesa Alice keypair and posted to a local Arweave testnet.  Posted messages are queried from the local Arweave testnet and aggregated below the form.

# Backlog & Future Work

## `tezos-arbundles`
- Finish development of `InjectedTezosSigner` for use in browser environments from `beacon-sdk`
- Explore `SmartWeave` contract interaction with `TezosSigner`, allowing cross-chain smart contract execution on Arweave from Tezos wallet keypairs using RedStone Gateway Sequencer
- Stream signing of data item
- Stream posting of data item

## `tezos-bundler`
- Design & implement secure payment/escrow system for Tezos Bundler Nodes to accept XTZ in exchange for guaranteed finality and unbundling of data items posted to Arweave and signed with Tezos wallet keypair
- Stream support for uploading bundles
- Test coverage & alpha/beta testing
- ~1 month dev for MVP, ~3 month dev for production (1 FTE)

## Demo Build Setup
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev:demo

# build for production and launch server
$ npm run build
$ npm run start:demo
```
