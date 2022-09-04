import {countMoneySum, changeCashRegister} from "./change_money.js";

let coins = {};

$(document).ready(() => {
    coins = {"PENNY" : .01, "NICEL" : .05 ,"DIME" : .1, "QUARTER" : .25, "ONE" : 1, "FIVE" : 5,"TEN" : 10,"TWENTY" : 20, "HUNDRED" : 100};
    
    let selectedItem = null;
    let coinsStackHeight = 0;
    let sumToPay = 0;

    function stackCoins(coinKey) {
        return function () {
            let droppedCoin = $(this).clone();

            console.log("stack");
            user.coins[coinKey] -= 1;
            console.log($($(this).children()[0]).text());
            sumToPay += coins[coinKey];
            $(droppedCoin).css({
                "position" : "absolution",
                "top" : "50px",
                "left" : "500px"
            });

            if (!user.coins[coinKey]) this.style.opacity = "0.6";
        }
    }

    const user = {  
        init : function(coinsReference) {
            this.money = 100;
            this.coins = {...coinsReference}; // Object with coin's names : number of these coin
            Object.keys(this.coins).map(coinKey => this.coins[coinKey] = 0);
            this.coins[Object.keys(this.coins).at(-1)] = 1; // add a biggest coin to the user's pocket
            
            this.items = {};
            console.table(this.coins);
        },
        buy : function(item, cash) {
            let change = {};
            let itemPrice = item.dataset.price;
            let itemName = item.dataset.name;
    
            if (![itemName, itemPrice].every(a => !!a)) return undefined;
            
            console.log("qwertyu");
            change = changeCashRegister(Number(itemPrice), this.coins, coins);
            console.log("Change:", change);
            if (!change) return undefined;

            for (let coin in this.coins) {
                this.coins[coin] -= cash[coin] || 0;
            }
            for (let [coinName, coinNum] of change) {
                this.coins[coinName] += coinNum;
            }
            
            this.items[itemName] = this.items[itemName] + 1 || 1;
            console.table("Coins: ", this.coins);
            console.table("Items: ", this.items);
        },
        selectCoinsToPay : function(item) {
            if (!item) return undefined;
            let cash = {};
            let htmlCoins = [];
            let newCoinItem = '';
            
            $(".payment-modal").css("display", "flex");
            for (let coin in coins) {
                if (this.coins[coin]) {
                    newCoinItem = "<div class='coin-wrapper'><div class='coin'>" + coin + "<br>" + coins[coin] + "$</div>" + this.coins[coin] + "</div>";
                    $(".payment-modal > .grid").append(newCoinItem);    
                    $(".payment-modal > .grid").click(stackCoins(coin));
                } else {
                    newCoinItem = "<div class='coin-wrapper'><div class='coin' style='opacity: 0.6;'>" + coin + "<br>" + coins[coin] + "$</div>" + this.coins[coin] + "</div>";
                    $(".payment-modal > .grid").append(newCoinItem);
                }
                
            }
        }
    };
    
    user.init(coins);
    
    console.log("User: ");
    console.table(user);
    $(".vending-machine .item").click(function () {
        selectedItem = this;
        //user.buy(this, {"PENNY" : 0, "NICEL" : 0 ,"DIME" : 0, "QUARTER" : 0, "ONE" : 0, "FIVE" : 0,"TEN" : 0,"TWENTY" : 0, "ONE HUNDRED" : 1});
    });
    // complete ! 
    $(".vending-machine .pay-receiver").click(function () {
        user.selectCoinsToPay(selectedItem);
    });
});