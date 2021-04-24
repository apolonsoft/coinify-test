import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoinType } from './enums/coin-type.enum';
import { Coin } from './interfaces/coin.interface';
import { WithdrawCoin } from './interfaces/withdraw-coin.interface';
import { WithdrawResult } from './interfaces/withdraw-result.interface';

@Injectable()
export class AtmService implements OnApplicationBootstrap {
    private _allCoins: Coin[];
    private _limitedCoinMode: boolean;

    constructor(private readonly _configService: ConfigService) {
        this._limitedCoinMode = this._configService.get<boolean>('LIMITED_COIN_MODE')
    }

    async onApplicationBootstrap(): Promise<void> {
        this._fillAllCoinsArray();
    }

    withdrawAmount(amount: number): WithdrawResult {
        const coins = this._allCoins.filter(c => c.remainingCount > 0);
        const resultCoinsArray = this._calculateWithdraw(coins, amount);

        return {
            coins: resultCoinsArray,
            message: resultCoinsArray.length === 0 ? 'Insufficient Bank Notes or Coins' : ''
        };
    }

    private _calculateWithdraw(coinAmountsArray: Coin[], requestedAmount: number): WithdrawCoin[] {
        let finalResult: WithdrawCoin[] = [];

        for (let i = 0; i < coinAmountsArray.length; i++) {
            const { amount, remainingCount } = coinAmountsArray[i];
            let requestedCoinCount = Math.floor(requestedAmount / amount);
            requestedAmount -= (amount * requestedCoinCount);
            if (!this._limitedCoinMode) {
                finalResult.push({
                    count: requestedCoinCount,
                    coin: coinAmountsArray[i]
                });
            } else {
                if (requestedCoinCount <= remainingCount) {
                    finalResult.push({
                        count: requestedCoinCount,
                        coin: coinAmountsArray[i]
                    });    
                } else {
                    finalResult = [];
                    break
                }
            }
        }
        return finalResult.filter(w => w.count > 0);
    }

    private _fillAllCoinsArray(): void {
        this._allCoins = [
            {
                amount: 1000,
                type: CoinType.BANKNOTE,
                remainingCount: 10,
                payoutBox: 1
            },
            {
                amount: 500,
                type: CoinType.BANKNOTE,
                remainingCount: 20,
                payoutBox: 1
            },
            {
                amount: 200,
                type: CoinType.BANKNOTE,
                remainingCount: 30,
                payoutBox: 1
            },
            {
                amount: 100,
                type: CoinType.BANKNOTE,
                remainingCount: 40,
                payoutBox: 1
            },
            {
                amount: 50,
                type: CoinType.BANKNOTE,
                remainingCount: 55,
                payoutBox: 1
            },
            {
                amount: 20,
                type: CoinType.COIN,
                remainingCount: 100,
                payoutBox: 2
            },
            {
                amount: 10,
                type: CoinType.COIN,
                remainingCount: 150,
                payoutBox: 3
            },
            {
                amount: 5,
                type: CoinType.COIN,
                remainingCount: 200,
                payoutBox: 2
            },
            {
                amount: 2,
                type: CoinType.COIN,
                remainingCount: 300,
                payoutBox: 2
            },
            {
                amount: 1,
                type: CoinType.COIN,
                remainingCount: 550,
                payoutBox: 3
            },
        ]
    }

}