import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoinType } from './enums/coin-type.enum';
import { Coin } from './interfaces/coin.interface';
import { WithdrawCoin } from './interfaces/withdraw-coin.interface';
import { WithdrawResult } from './interfaces/withdraw-result.interface';
import * as _ from 'lodash'

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
            withdraw: resultCoinsArray,
            message: resultCoinsArray.length === 0 ? 'Insufficient Bank Notes or Coins' : null
        };
    }

    private _calculateWithdraw(coinAmountsArray: Coin[], requestedAmount: number): WithdrawCoin[] {
        let finalResult: WithdrawCoin[] = [];
        for (let i = 0; i < coinAmountsArray.length; i++) {
            const { amount, remainingCount, payoutBoxNum, payoutBox } = coinAmountsArray[i];
            let requestedCoinCount = Math.floor(requestedAmount / amount);
            requestedAmount -= (amount * requestedCoinCount);

            const item : WithdrawCoin= {
                count: requestedCoinCount,
                payoutBoxNum,
                payoutBox,
                amount
            }
            if (!this._limitedCoinMode) {
                finalResult.push(item);
            } else {
                if (requestedCoinCount <= remainingCount) {
                    finalResult.push(item);
                } else {
                    finalResult = [];
                    break
                }
            }
        }
        return _.groupBy(finalResult.filter(w => w.count > 0), function (itm) {
            return itm.payoutBox;
        });
    }

    private _fillAllCoinsArray(): void {
        this._allCoins = [
            {
                amount: 1000,
                type: CoinType.BANKNOTE,
                remainingCount: 10,
                payoutBox: 'Notes',
                payoutBoxNum:1
            },
            {
                amount: 500,
                type: CoinType.BANKNOTE,
                remainingCount: 20,
                payoutBox: 'Notes',
                payoutBoxNum:1

            },
            {
                amount: 200,
                type: CoinType.BANKNOTE,
                remainingCount: 30,
                payoutBox: 'Notes',
                payoutBoxNum:1

            },
            {
                amount: 100,
                type: CoinType.BANKNOTE,
                remainingCount: 40,
                payoutBox: 'Notes',
                payoutBoxNum:1

            },
            {
                amount: 50,
                type: CoinType.BANKNOTE,
                remainingCount: 55,
                payoutBox: '1: Notes',
                payoutBoxNum:1

            },
            {
                amount: 20,
                type: CoinType.COIN,
                remainingCount: 100,
                payoutBox: '2 : > 20mm',
                payoutBoxNum:2

            },
            {
                amount: 10,
                type: CoinType.COIN,
                remainingCount: 150,
                payoutBox: '3: <= 20mm',
                payoutBoxNum:3
            },
            {
                amount: 5,
                type: CoinType.COIN,
                remainingCount: 200,
                payoutBox: '2 : > 20mm',
                payoutBoxNum:2

            },
            {
                amount: 2,
                type: CoinType.COIN,
                remainingCount: 300,
                payoutBox: '2 : > 20mm',
                payoutBoxNum:2

            },
            {
                amount: 1,
                type: CoinType.COIN,
                remainingCount: 550,
                payoutBox: '3: <= 20mm',
                payoutBoxNum:3

            },
        ]
    }

}