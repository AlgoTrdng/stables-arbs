import { getHigherPriceDiff as getHubbleHigherPriceDiff } from './hubble/priceDifference.js'
import { getHigherPriceDiff as getHedgeHigherPriceDiff } from './hedge/priceDifference.js'


await getHubbleHigherPriceDiff({
  amountRaw: 10000000,
  i: 0,
})
await getHedgeHigherPriceDiff(10000000)

while (true) {}
