import { Connection, PublicKey } from '@solana/web3.js'

import { PSM_RESERVER_ACCOUNT_LAYOUT } from './layouts/hubble.js'

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
	return {
		mintFee: Number(mintFeeBps) / 100,
		burnFee: Number(burnFeeBps) / 100,
	}
}

export const hubbleConfig = await fetchHubblePsmFees()
