import { ArbitrageType, Exchange } from '../constants.js'
import { fetchJupiterPrice } from '../jupiter.js'
import { round } from '../utils/amountHelpers.js'
import { hedgeConfig } from './index.js'

export const getHigherPriceDiff = async (amountRaw: number) => {
  const execute = async (type: ArbitrageType, hedgePrice: number) => {
    const jupiterPrice = await fetchJupiterPrice({
			exchange: Exchange.Hubble,
			amountRaw,
			type,
		}) 
		if (!jupiterPrice) {
			return -100
		}
		return round(jupiterPrice / hedgePrice - 1, 6)
  }

  const redeemPriceDiff = await execute(ArbitrageType.Redeem, 1 * (1 + hedgeConfig.redeemFee))
	const mintPriceDiff = await execute(ArbitrageType.Mint, 1 * (1 + hedgeConfig.mintFee))
	console.log({ redeemPriceDiff, mintPriceDiff })
	if (Math.max(redeemPriceDiff, mintPriceDiff, 0.05) === 0.05) {
		return null
	}

	return redeemPriceDiff > mintPriceDiff ? ArbitrageType.Redeem : ArbitrageType.Mint
}
