import { hubbleConfig } from '../constants.js'
import { calculateJupiterPrice, fetchJupiterRoute } from '../jupiter.js'
import { round, toRaw } from '../utils/amountHelpers.js'

type ArbitrageType = 'redeem' | 'mint'

const fetchJupiterPrice = async (type: ArbitrageType, amountRaw: number, forceFetch = false) => {
	const jupiterRouteData = await fetchJupiterRoute(
		type === 'redeem'
			? {
					inToken: 'USDC',
					outToken: 'USDH',
					forceFetch,
					amountRaw,
			  }
			: {
					inToken: 'USDH',
					forceFetch,
					amountRaw,
			  },
	)
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
	forceFetch?: boolean
	type: ArbitrageType
}

const fetchDiff = async ({
	hubblePrice,
	amountRaw,
	type,
	forceFetch = false,
}: FetchPriceDiffParams) => {
	const jupiterPrice = await fetchJupiterPrice(type, amountRaw, forceFetch)
	return jupiterPrice && round(jupiterPrice / hubblePrice - 1, 6)
}

export const fetchPriceDifference = async (amounts: number[]) => {
	const hubblePrice = {
		redeem: 1 / (1 - hubbleConfig.burnFee),
		mint: 1 / (1 - hubbleConfig.mintFee),
	}

	const execute = async (i: number) => {
		const amountRaw = toRaw(amounts[i])
		return {
			redeem: await fetchDiff({
				hubblePrice: hubblePrice.redeem,
				type: 'redeem',
				forceFetch: i === 0,
				amountRaw,
			}),
			mint: await fetchDiff({
				hubblePrice: hubblePrice.redeem,
				type: 'mint',
				amountRaw,
			}),
		}
	}

	let priceDiffs = await execute(0)

	for (let i = 1; i < amounts.length; i++) {
		priceDiffs = await execute(i)
	}

	console.log(priceDiffs)
}
