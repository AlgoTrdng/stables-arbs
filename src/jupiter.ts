import { Jupiter } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'
import JSBI from 'jsbi'

import { solPublicKey } from './config.js'
import { connection, Mints, Token } from './constants.js'
import { round } from './utils/amountHelpers.js'

export const jupiter = await Jupiter.load({
	cluster: 'mainnet-beta',
	user: new PublicKey(solPublicKey),
	connection,
})

const jsbiToNumber = (num: JSBI) => Number(num.toString())

export type JupiterRouteParams = {
	inToken: Token
	outToken?: Token
	amountRaw: number
	forceFetch?: boolean
}

export const fetchJupiterRoute = async ({
	inToken,
	amountRaw,
	outToken = 'USDC',
	forceFetch = false,
}: JupiterRouteParams) => {
	try {
		const { routesInfos } = await jupiter.computeRoutes({
			inputMint: Mints[inToken],
			outputMint: Mints[outToken],
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
		return { inAmountRaw: jsbiToNumber(inAmount), outAmountRaw: jsbiToNumber(outAmount) }
	} catch (error) {
		console.error(error)
		return null
	}
}

type JupiterPriceAmounts = {
	inAmountRaw: number
	outAmountRaw: number
}

type JupiterPriceDecimals = {
	inDecimals: number
	outDecimals: number
}

export const calculateJupiterPrice = (
	amounts: JupiterPriceAmounts,
	decimals: JupiterPriceDecimals,
) => {
	const { inAmountRaw, outAmountRaw } = amounts
	const { inDecimals, outDecimals } = decimals
	const input = inAmountRaw / 10 ** inDecimals
	const output = outAmountRaw / 10 ** outDecimals
	return round(output / input, 6)
}
