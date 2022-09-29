# Stablecoins (USDH, USH) arbitrage

## Accounts layouts / TX params

### USH

```ts
// ---- Transactions ----
// PSM MINT
const name = 'psmMintUsh'
const accounts = [
  { name: 'payer', isMut: false, isSigner: false },
  { name: 'vaultSystemState', isMut: false, isSigner: true },
  { name: 'feePool', isMut: false, isSigner: true },
  { name: 'feePoolAssociatedUshTokenAccount', isMut: false, isSigner: true },
  { name: 'psmAccount', isMut: false, isSigner: true },
  { name: 'psmAccountAta', isMut: false, isSigner: true },
  { name: 'ownerUshAccount', isMut: false, isSigner: true },
  { name: 'ownerCollateralAccount', isMut: false, isSigner: true },
  { name: 'collateralMint', isMut: true, isSigner: true },
  { name: 'ushMint', isMut: false, isSigner: true },
  { name: 'referralState', isMut: false, isSigner: true },
  { name: 'referralAccount', isMut: false, isSigner: true },
  { name: 'systemProgram', isMut: true, isSigner: true },
  { name: 'tokenProgram', isMut: true, isSigner: true },
]
const args = [
  { name: 'collateralAmount', type: 'u64' },
  { name: 'overrideCurrentTime', type: 'i64' },
]

// PSM REDEEM
const name = 'psmRedeemUsh'
const accounts = [
  { name: 'payer', isMut: false, isSigner: false },
  { name: 'vaultSystemState', isMut: false, isSigner: true },
  { name: 'feePool', isMut: false, isSigner: true },
  { name: 'feePoolAssociatedUshTokenAccount', isMut: false, isSigner: true },
  { name: 'psmAccount', isMut: false, isSigner: true },
  { name: 'psmAccountAta', isMut: false, isSigner: true },
  { name: 'ownerUshAccount', isMut: false, isSigner: true },
  { name: 'ownerCollateralAccount', isMut: false, isSigner: true },
  { name: 'collateralMint', isMut: true, isSigner: true },
  { name: 'ushMint', isMut: false, isSigner: true },
  { name: 'referralState', isMut: false, isSigner: true },
  { name: 'referralAccount', isMut: false, isSigner: true },
  { name: 'systemProgram', isMut: true, isSigner: true },
  { name: 'tokenProgram', isMut: true, isSigner: true },
]
const args = [
  { name: 'ushAmount', type: 'u64' },
  { name: 'overrideCurrentTime', type: 'i64' },
]

// ---- Accounts ----
// PSM ACCOUNT
const address = 'Bizd3Pmkvp9C792ZNDn6ogpExqatUUHEzcvu2Q6JHDfb'
const type = {
  kind: 'struct',
  fields: [
    { name: 'collateralMint', type: 'publicKey' },
    { name: 'minCollateralRatio', type: 'u128' },
    { name: 'mintFee', type: 'u128' },
    { name: 'redeemFee', type: 'u128' },
    { name: 'totalFeesAccumulatedUsh', type: 'u128' },
    { name: 'totalFeesAccumulatedCollateral', type: 'u128' },
    { name: 'recentPrice', type: 'u128' },
    { name: 'debtLimit', type: 'u64' },
    { name: 'deposited', type: 'u64' },
    { name: 'amountMinted', type: 'u64' },
    { name: 'minSwap', type: 'u64' },
    { name: 'timeCreated', type: 'u64' },
    { name: 'timeLastInteraction', type: 'u64' },
    { name: 'priceLastUpdatedTimestamp', type: 'u64' },
    { name: 'psmStatus', type: { defined: 'PsmStatus' } },
    { name: 'collateralDecimals', type: 'u8' },
  ],
}
```
