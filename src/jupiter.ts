import { Jupiter } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'
import JSBI from 'jsbi'

import { SOL_PUBLIC_KEY } from './config.js'
import { ArbitrageType, connection, Exchange, Mints, Token } from './constants.js'
import { round } from './utils/amountHelpers.js'

export const jupiter = await Jupiter.load({
	cluster: 'mainnet-beta',
	user: new PublicKey(SOL_PUBLIC_KEY),
	connection,
})

const jsbiToNumber = (num: JSBI) => Number(num.toString())

type JupiterPriceAmounts = {
	inAmountRaw: number
	outAmountRaw: number
}

export const calculateJupiterPrice = (
	amounts: JupiterPriceAmounts,
) => {
	const { inAmountRaw, outAmountRaw } = amounts
	const input = inAmountRaw / 10 ** 6
	const output = outAmountRaw / 10 ** 6
	return round(output / input, 6)
}

export type RouteTokens = {
	inToken: Token
	outToken?: Token
}

const params: Record<Exchange, Record<ArbitrageType, RouteTokens>> = {
	hubble: {
		redeem: {
			inToken: 'USDC',
			outToken: 'USDH',
		},
		mint: {
			inToken: 'USDH',
		},
	},
	hedge: {
		redeem: {
			inToken: 'USDC',
			outToken: 'USH',
		},
		mint: {
			inToken: 'USH',
		},
	},
}

type FetchJupiterPriceParams = {
	type: ArbitrageType
	exchange: Exchange
	amountRaw: number
	forceFetch?: boolean
}

export const fetchJupiterPrice = async ({
	type,
	exchange,
	amountRaw,
	forceFetch,
}: FetchJupiterPriceParams) => {
	const { inToken, outToken } = params[exchange][type]

	try {
		const { routesInfos } = await jupiter.computeRoutes({
			inputMint: Mints[inToken],
			outputMint: Mints[outToken || 'USDC'],
			amount: JSBI.BigInt(amountRaw),
			slippage: 5,
			forceFetch,
		})
		if (!routesInfos.length) {
			console.error(`Could not fetch any routes for: ${inToken}/${outToken}, amount: ${amountRaw}`)
			return null
		}
		const [bestRoute] = routesInfos
		const { inAmount, outAmount } = bestRoute
		const inAmountRaw = jsbiToNumber(inAmount) / 10 ** 6
		const outAmountRaw = jsbiToNumber(outAmount) / 10 ** 6

		const price = calculateJupiterPrice({ inAmountRaw, outAmountRaw })
		return price
	} catch (error) {
		console.error(error)
		return null
	}
}
