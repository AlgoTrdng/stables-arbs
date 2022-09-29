import { PublicKey } from '@solana/web3.js'

import { connection, ANCHOR_ACCOUNT_DISCRIMINATOR } from '../constants.js'
import { PSM_RESERVER_ACCOUNT_LAYOUT } from './layouts.js'

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
