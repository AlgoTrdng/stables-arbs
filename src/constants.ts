import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { SOL_PRIVATE_KEY } from './config'

export enum Exchange {
	Hubble = 'hubble',
	Hedge = 'hedge',
}

export enum ArbitrageType {
	Mint = 'mint',
	Redeem = 'redeem',
}

export const Mints = {
	USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
	USDH: new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX'),
	USH: new PublicKey('9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6'),
}
export type Token = keyof typeof Mints

export const ANCHOR_ACCOUNT_DISCRIMINATOR = 8

export const connection = new Connection('https://rpc.ankr.com/solana', 'confirmed')

const pk = new Uint8Array(SOL_PRIVATE_KEY.split(',').map((x) => Number(x)))
export const solWallet = Keypair.fromSecretKey(pk)
