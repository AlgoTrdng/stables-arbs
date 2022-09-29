import { struct, u8, Structure } from '@solana/buffer-layout'
import { u64, publicKey } from '@solana/buffer-layout-utils'
import { PublicKey } from '@solana/web3.js'

export type PsmArgsLayout = {
	amount: bigint
}

export const PSM_ARGS_LAYOUT = struct<PsmArgsLayout>([u64('amount')])

type WithdrawalCapsLayout = {
	configCapacity: bigint
	currentTotal: bigint
	lastIntervalStartTimestamp: bigint
	configIntervalLengthSeconds: bigint
}

const withdrawalCaps = (prop: string) =>
	new Structure<WithdrawalCapsLayout>(
		[
			u64('configCapacity'),
			u64('currentTotal'),
			u64('lastIntervalStartTimestamp'),
			u64('configIntervalLengthSeconds'),
		],
		prop,
	)

export type PsmReserveAccountLayout = {
	version: bigint
	bump: number
	borrowingMarketState: PublicKey
	depositedStablecoin: bigint
	maxCapacity: bigint
	mintedUsdh: bigint
	stablecoinMintDecimals: number
	stablecoinMint: PublicKey
	psmVault: PublicKey
	psmVaultAuthority: PublicKey
	psmVaultAuthoritySeed: bigint
	withdrawalCapUsdh: WithdrawalCapsLayout
	withdrawalCapStable: WithdrawalCapsLayout
	mintFeeBps: bigint
	burnFeeBps: bigint
	treasuryVaultOtherStable: PublicKey
	treasuryVaultOtherStableAuthority: PublicKey
}

export const PSM_RESERVER_ACCOUNT_LAYOUT = struct<PsmReserveAccountLayout>([
	u64('version'),
	u8('bump'),
	publicKey('borrowingMarketState'),
	u64('depositedStablecoin'),
	u64('maxCapacity'),
	u64('mintedUsdh'),
	u8('stablecoinMintDecimals'),
	publicKey('stablecoinMint'),
	publicKey('psmVault'),
	publicKey('psmVaultAuthority'),
	u64('psmVaultAuthoritySeed'),
	withdrawalCaps('withdrawalCapUsdh'),
	withdrawalCaps('withdrawalCapStable'),
	u64('mintFeeBps'),
	u64('burnFeeBps'),
	publicKey('treasuryVaultOtherStable'),
	publicKey('treasuryVaultOtherStableAuthority'),
])
