export const round = (amount: number, decimals: number) =>
	Math.round(amount * 10 ** decimals) / 10 ** decimals

export const toRaw = (amount: number, decimals = 6) => Math.round(amount * 10 ** decimals)
