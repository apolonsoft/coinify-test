import { CoinType } from "src/enums/coin-type.enum";

export interface WithdrawCoin {
    count: number
    payoutBox: string,
    payoutBoxNum:number
    amount:number
}