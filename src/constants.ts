import { Connection, PublicKey } from '@solana/web3.js'

import { PSM_RESERVER_ACCOUNT_LAYOUT } from './hubble/layouts.js'

export const connection = new Connection('https://ssc-dao.genesysgo.net/')

const ANCHOR_ACCOUNT_DISCRIMINATOR = 8

const fetchHubblePsmFees = async () => {
	const psmReserveAccount = new PublicKey('7AvwRQhSKtUUbEcP4eqYZbbKWgYyygehAqEp68nnc747')
	const accountInfo = await connection.getAccountInfo(psmReserveAccount)

	if (!accountInfo) {
		throw Error('Could not fetch PSM_RESERVE account info')
	}

	const decoded = PSM_RESERVER_ACCOUNT_LAYOUT.decode(
		accountInfo.data.slice(ANCHOR_ACCOUNT_DISCRIMINATOR),
	)
	const { mintFeeBps, burnFeeBps } = decoded
	const denominator = 10000
	return {
		mintFee: Number(mintFeeBps) / denominator,
		burnFee: Number(burnFeeBps) / denominator,
	}
}

export const hubbleConfig = await fetchHubblePsmFees()

export const Mints = {
	USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
	USDH: new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX'),
	USH: new PublicKey('9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6'),
}
export type Token = keyof typeof Mints
