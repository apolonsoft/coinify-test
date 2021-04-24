import { CoinType } from './../enums/coin-type.enum'
export interface Coin {
    amount: number
    remainingCount: number
    type: CoinType
}