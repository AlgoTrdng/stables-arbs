import { struct, u8 } from '@solana/buffer-layout'
import { publicKey, u128, u64 } from '@solana/buffer-layout-utils'
import { PublicKey } from '@solana/web3.js'

export const InstructionNamespace = {
  mint: Buffer.from('63deddcee395339d', 'hex'),
  redeem: Buffer.from('ba3b98a0cc7b66bf', 'hex'),
}

type PsmMintLayout = {
  collateralAmount: bigint
}

type PsmRedeemLayout = {
  ushAmount: bigint
}

const PSM_MINT_DATA_LAYOUT = struct<PsmMintLayout>([
  u64('collateralAmount'),
])
const PSM_REDEEM_DATA_LAYOUT = struct<PsmRedeemLayout>([
  u64('ushAmount'),
])

export const buildInstructionArguments = (amount: number, type: keyof typeof InstructionNamespace) => {
  const data = Buffer.alloc(8 * 3)
  data.set(InstructionNamespace[type])
  switch (type) {
    case 'mint': {
      PSM_MINT_DATA_LAYOUT.encode({
        collateralAmount: BigInt(amount),
      }, data, 8)
      break
    }
    default: {
      PSM_REDEEM_DATA_LAYOUT.encode({
        ushAmount: BigInt(amount),
      }, data, 8)
    }
  }
  return data
}

export enum PsmStatus {
  'PsmEnabled',
  'PsmDisabled',
  'MintOnly',
  'RedeemOnly',
}

type PsmAccountLayout = {
  collateralMint: PublicKey
  minCollateralRatio: bigint
  mintFee: bigint
  redeemFee: bigint
  totalFeesAccumulatedUsh: bigint
  totalFeesAccumulatedCollateral: bigint
  recentPrice: bigint
  debtLimit: bigint
  deposited: bigint
  amountMinted: bigint
  minSwap: bigint
  timeCreated: bigint
  timeLastInteraction: bigint
  priceLastUpdatedTimestamp: bigint
  psmStatus: number
  collateralDecimals: number
}

export const PSM_ACCOUNT_LAYOUT = struct<PsmAccountLayout>([
  publicKey('collateralMint'),
  u128('minCollateralRatio'),
  u128('mintFee'),
  u128('redeemFee'),
  u128('totalFeesAccumulatedUsh'),
  u128('totalFeesAccumulatedCollateral'),
  u128('recentPrice'),
  u64('debtLimit'),
  u64('deposited'),
  u64('amountMinted'),
  u64('minSwap'),
  u64('timeCreated'),
  u64('timeLastInteraction'),
  u64('priceLastUpdatedTimestamp'),
  u8('psmStatus'),
  u8('collateralDecimals'),
])
