import {countMoneySum, changeCashRegister} from "./change_money.js";

let coins = {};

$(document).ready(() => {
    coins = {"PENNY" : .01, "NICEL" : .05 ,"DIME" : .1, "QUARTER" : .25, "ONE" : 1, "FIVE" : 5,"TEN" : 10,"TWENTY" : 20, "HUNDRED" : 100};
    
    let selectedItem = null;
    let coinsStackHeight = 0;
    let sumToPay = 0;
    
    /*
    function stackCoins(coinKey) {
        return function () {
            let droppedCoin = $(this).clone();

            console.log(droppedCoin);
            user.coins[coinKey] -= 1;
            console.log($($($(this).children()[0]).children()[0]));
            sumToPay += coins[coinKey];
            $(droppedCoin).css({
                "position" : "absolution",
                "top" : "50px",
                "left" : "500px"
            });

            if (!user.coins[coinKey]) this.style.opacity = "0.6";
        }
    }
    */
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
            
            console.log("Buy");
            console.table("Cash: ", cash);
            change = changeCashRegister(Number(itemPrice), cash, coins);
            console.log("Change:", change);
            if (!change) return undefined;

            //for (let coin in this.coins) {
                //this.coins[coin] -= cash[coin] || 0;
            //}
            for (let [coinName, coinNum] of change) {
                this.coins[coinName] += coinNum;
            }
            
            this.items[itemName] = this.items[itemName] + 1 || 1;
            console.table("User Coins: ", this.coins);
            console.table("User Items: ", this.items);
        },
        selectCoinsToPay : function(item) {
            if (!item) return undefined;
            let cash = {};
            let htmlCoins = [];
            let newCoinItem = '';
            
            $(".payment-modal").css("display", "flex");
            for (let coin in coins) {
                if (this.coins[coin]) {
                    newCoinItem = $("<div class='coin-wrapper'><div class='coin'>" + coin + "<br>" + coins[coin] + "$</div>" + this.coins[coin] + "</div>");
                    //newCoinJQItem.click(stackCoins(coin));
                    newCoinItem.click(payment.addCoin(coin));
                    $(".payment-modal > .grid").append(newCoinItem);    
                } else {
                    newCoinItem = $("<div class='coin-wrapper'><div class='coin' style='opacity: 0.6;'>" + coin + "<br>" + coins[coin] + "$</div>" + this.coins[coin] + "</div>");
                    $(".payment-modal > .grid").append(newCoinItem);
                }
                
            }
        }
    };
    const payment = {
        reset : function () {
            this.coins = {...coins};
            for (let coinKey in this.coins) {
                this.coins[coinKey] = 0;
            }
            payment.sum = 0;
        },
        addCoin : function (coinKey) {
            return function () {
                if (!user.coins[coinKey]) return;
                
                payment.sum += coins[coinKey];
                
                user.coins[coinKey]--;
                payment.coins[coinKey]++;
                console.log("Price:", selectedItem.dataset.price);
                console.log("SUm:", payment.sum);
                if (payment.sum >= selectedItem.dataset.price) {
                    user.buy(selectedItem, payment.coins);
                    selectedItem = {};
                    payment.reset();
                    $(".payment-modal").hide();
                    console.log(user.coins);
                    return;
                }
                console.table(payment.coins);
                payment.stackCoins(coinKey);    
            };
        },
        stackCoins : function (coinKey) {
            //$("<div id='pay'></div>").appendTo(".payment-modal");
            //$(".payment-modal > #pay").text(this.sum);
            return;
        }
    };
    
    user.init(coins);
    payment.reset();

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