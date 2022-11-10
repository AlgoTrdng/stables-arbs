import { ArbitrageType, Exchange } from '../constants.js'
import { fetchJupiterPrice } from '../jupiter.js'
import { round } from '../utils/amountHelpers.js'
import { hubbleConfig } from './index.js'

type FetchPriceDiffParams = {
	amountRaw: number
	i: number
}

export const getHigherPriceDiff = async ({
	amountRaw,
	i,
}: FetchPriceDiffParams) => {
	const execute = async (type: ArbitrageType, hubblePrice: number) => {
		const jupiterPrice = await fetchJupiterPrice({
			forceFetch: i === 0 && type === ArbitrageType.Redeem,
			exchange: Exchange.Hubble,
			amountRaw,
			type,
		}) 
		if (!jupiterPrice) {
			return -100
		}
		console.log(jupiterPrice, hubblePrice)
		return round(jupiterPrice / hubblePrice - 1, 6)
	}

	const redeemPriceDiff = await execute(ArbitrageType.Redeem, 1 * (1 + hubbleConfig.redeemFee))
	const mintPriceDiff = await execute(ArbitrageType.Mint, 1 * (1 + hubbleConfig.mintFee))
	console.log({ redeemPriceDiff, mintPriceDiff })
	if (Math.max(redeemPriceDiff, mintPriceDiff, 0.05) === 0.05) {
		return null
	}

	return redeemPriceDiff > mintPriceDiff ? ArbitrageType.Redeem : ArbitrageType.Mint
}
