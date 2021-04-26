import { WithdrawCoin } from "./withdraw-coin.interface";

export interface WithdrawResult {
    withdraw: WithdrawCoin[],
    message: string
}