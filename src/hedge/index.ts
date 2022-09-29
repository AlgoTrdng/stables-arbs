import { PublicKey } from '@solana/web3.js'

import { connection, ANCHOR_ACCOUNT_DISCRIMINATOR } from '../constants.js'
import { forceFetch } from '../utils/forceFetch.js'
import { PSM_ACCOUNT_LAYOUT } from './layouts.js'

const PSM_ACCOUNT = new PublicKey('Bizd3Pmkvp9C792ZNDn6ogpExqatUUHEzcvu2Q6JHDfb')

export const fetchHedgeConfig = async () => {
  const psmAccount = await forceFetch(() => connection.getAccountInfo(PSM_ACCOUNT))
  const { mintFee, redeemFee } = PSM_ACCOUNT_LAYOUT.decode(psmAccount.data.slice(ANCHOR_ACCOUNT_DISCRIMINATOR))
  const denominator = 100000000000000n
  const mintFeeBps = mintFee / denominator
  const redeemFeeBps = redeemFee / denominator

  return {
    mintFee: Number(mintFeeBps) / 10000,
    redeemFee: Number(redeemFeeBps) / 10000,
  }
}

export const fetchHedgeAvailableRedeem = async () => {
  const psmAccount = await forceFetch(() => connection.getAccountInfo(PSM_ACCOUNT))
  const { deposited } = PSM_ACCOUNT_LAYOUT.decode(psmAccount.data.slice(ANCHOR_ACCOUNT_DISCRIMINATOR))
  return Number(deposited)
}