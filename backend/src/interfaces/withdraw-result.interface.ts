import { WithdrawCoin } from "./withdraw-coin.interface";

export interface WithdrawResult {
    coins: WithdrawCoin[],
    message: string
}