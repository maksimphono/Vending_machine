import {countMoneySum, changeCashRegister} from "./change_money.js";

let coins = {};

$(document).ready(() => {
    coins = {"PENNY" : .01, "NICEL" : .05 ,"DIME" : .1, "QUARTER" : .25, "ONE" : 1, "FIVE" : 5,"TEN" : 10,"TWENTY" : 20, "HUNDRED" : 100};
    
    let selectedItem = null;
    let coinsStackHeight = 0;
    let sumToPay = 0;
    const user = {  
        init : function(coinsReference) {
            this.money = 100;
            this.coins = {...coinsReference}; // Object with coin's names : number of these coin
            Object.keys(this.coins).map(coinKey => this.coins[coinKey] = 0);
            this.coins[Object.keys(this.coins).at(-1)] = 1; // add a biggest coin to the user's pocket

            this.items = {};
        },
        buy : function(item, cash) {
            let change = {};
            let itemPrice = item.dataset.price;
            let itemName = item.dataset.name;
    
            if (![itemName, itemPrice].every(a => !!a)) return undefined;
            
            change = changeCashRegister(Number(itemPrice), cash, coins);
            if (!change) return undefined;

            for (let [coinName, coinNum] of change) {
                this.coins[coinName] += coinNum;
            }
            
            this.items[itemName] = this.items[itemName] + 1 || 1;
        },
        selectCoinsToPay : function(item) {
            if (!item) return undefined; 
            let i = 1;
            
            $(".payment-modal").css("display", "flex");
            for (let coin in coins) {
                $(".payment-modal > .grid > .coin-wrapper:nth-child("+ i +") > p").text(this.coins[coin]);
                $(".payment-modal > .grid > .coin-wrapper:nth-child("+ i +") > .coin").text(coin + ' ' + coins[coin] + "$").css("opacity", "1");
                $(".payment-modal > .grid > .coin-wrapper:nth-child("+ i +")").unbind();
                if (this.coins[coin]) {
                    $(".payment-modal > .grid > .coin-wrapper:nth-child("+ i +")").click(payment.addCoin(coin));
                } else {
                    
                    $(".payment-modal > .grid > .coin-wrapper:nth-child("+ i +") > .coin").css("opacity", "0.6");
                }
                i++;
                
            }
        }
    };
    const payment = {
        reset : function () {
            this.coins = {...coins};
            for (let coinKey in this.coins) {
                this.coins[coinKey] = 0;
            }
            this.sum = 0;
        },
        addCoin : function (coinKey) {
            return function () {
                if (!user.coins[coinKey] || !selectedItem) return;
                
                console.log("addCoin func");
                payment.sum += coins[coinKey];
                console.log("Payment sum:", payment.sum);
                console.log("Item price:", selectedItem.dataset.price);
                user.coins[coinKey]--;
                $(this).find("p").text(user.coins[coinKey]);
                if (!user.coins[coinKey]) $(this).find(".coin").css("opacity", "0.6");
                payment.coins[coinKey]++;
                if (payment.sum >= selectedItem.dataset.price) {
                    console.log("Sum > price");
                    user.buy(selectedItem, payment.coins);
                    selectedItem = null;
                    payment.reset();
                    console.log("Sum after buying:", payment.sum);
                    setTimeout(() => $(".payment-modal").hide(), 2000);
                    //$(".payment-modal").hide();
                    return;
                }
                //payment.stackCoins(coinKey);    
            };
        },
        stackCoins : function (coinKey) {
            return;
        }
    };
    
    user.init(coins);
    payment.reset();

    $(".vending-machine .item").click(function () {
        selectedItem = this;
        console.log("Setted item:", selectedItem);    
    });
    // complete ! 
    $(".vending-machine .pay-receiver").click(function () {
        user.selectCoinsToPay(selectedItem);
    });
});