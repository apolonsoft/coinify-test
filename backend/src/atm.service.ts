import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CoinType } from './enums/coin-type.enum';
import { Coin } from './interfaces/coin.interface';
import { WithdrawResult } from './interfaces/withdraw-result.interface';

@Injectable()
export class AtmService implements OnApplicationBootstrap {
    private _allCoins: Coin[];

    async onApplicationBootstrap(): Promise<void> {

        this._fillAllCoinsArray();
        this.withdrawAmount(19421);
    }

    withdrawAmount(amount: number) {
        const coins = this._allCoins.filter(c => c.remainingCount > 0);
        const res = this._calculateWithdraw(coins, amount);
        console.log(res)
    }

    private _calculateWithdraw(coinAmountsArray: Coin[], amount: number): WithdrawResult[] {
        const finalResult: WithdrawResult[] = [];

        for (let i = 0; i < coinAmountsArray.length; i++) {
            let withdrawAmount = Math.floor(amount / coinAmountsArray[i].amount);
            amount -= (coinAmountsArray[i].amount * withdrawAmount);

            finalResult.push({
                count: withdrawAmount,
                coin: coinAmountsArray[i]
            });

        }
        return finalResult.filter(w => w.count > 0);
    }

    private _fillAllCoinsArray(): void {
        this._allCoins = [
            {
                amount: 1000,
                type: CoinType.BANKNOTE,
                remainingCount: 10
            },
            {
                amount: 500,
                type: CoinType.BANKNOTE,
                remainingCount: 20
            },
            {
                amount: 200,
                type: CoinType.BANKNOTE,
                remainingCount: 30
            },
            {
                amount: 100,
                type: CoinType.BANKNOTE,
                remainingCount: 40
            },
            {
                amount: 50,
                type: CoinType.BANKNOTE,
                remainingCount: 55
            },
            {
                amount: 20,
                type: CoinType.COIN,
                remainingCount: 100
            },
            {
                amount: 10,
                type: CoinType.COIN,
                remainingCount: 150
            },
            {
                amount: 5,
                type: CoinType.COIN,
                remainingCount: 200
            },
            {
                amount: 2,
                type: CoinType.COIN,
                remainingCount: 300
            },
            {
                amount: 1,
                type: CoinType.COIN,
                remainingCount: 550
            },
        ]
    }

}