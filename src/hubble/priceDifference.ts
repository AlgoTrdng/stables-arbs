import { ArbitrageType } from '../constants.js'
import { calculateJupiterPrice, fetchJupiterRoute, JupiterRouteParams } from '../jupiter.js'
import { round } from '../utils/amountHelpers.js'

const jupiterParams: Record<ArbitrageType, Omit<JupiterRouteParams, 'amountRaw'>> = {
	redeem: {
		inToken: 'USDC',
		outToken: 'USDH',
	},
	mint: {
		inToken: 'USDH',
	},
}

const fetchJupiterPrice = async (type: ArbitrageType, amountRaw: number, forceFetch = false) => {
	const params = {
		...jupiterParams[type],
		forceFetch,
		amountRaw,
	}
	const jupiterRouteData = await fetchJupiterRoute(params)
	return (
		jupiterRouteData &&
		calculateJupiterPrice(jupiterRouteData, {
			inDecimals: 6,
			outDecimals: 6,
		})
	)
}

type FetchPriceDiffParams = {
	hubblePrice: number
	amountRaw: number
	i: number
}

export const getHigherPriceDiff = async ({
	hubblePrice,
	amountRaw,
	i,
}: FetchPriceDiffParams) => {
	const execute = async (type: ArbitrageType) => {
		const jupiterPrice = await fetchJupiterPrice(type, amountRaw, i === 0) 
		if (!jupiterPrice) {
			return -100
		}
		return round(jupiterPrice / hubblePrice - 1, 6)
	}

	const redeemPriceDiff = await execute(ArbitrageType.Redeem)
	const mintPriceDiff = await execute(ArbitrageType.Mint)

	if (Math.max(redeemPriceDiff, mintPriceDiff, 0.05) === 0.05) {
		return null
	}

	return redeemPriceDiff > mintPriceDiff ? ArbitrageType.Redeem : ArbitrageType.Mint
}
