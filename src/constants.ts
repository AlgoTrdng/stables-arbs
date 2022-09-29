import { Connection, PublicKey } from '@solana/web3.js'

export enum ArbitrageType {
	Mint = 'mint',
	Redeem = 'redeem',
}

export const connection = new Connection('https://ssc-dao.genesysgo.net/', 'confirmed')

export const Mints = {
	USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
	USDH: new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX'),
	USH: new PublicKey('9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6'),
}
export type Token = keyof typeof Mints

export const ANCHOR_ACCOUNT_DISCRIMINATOR = 8
