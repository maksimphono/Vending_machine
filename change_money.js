const countMoneySum = (cash, coins) => {
    let sum = 0;
    for (let key in cash){
        sum += cash[key] * coins[key];
    }
    return sum;
};

function changeCashRegister(price, _cash, coins) {
    /* price : actual price
       _cash : Object with coin's names and number of these coins
       coins : Object with coin's names and values
    */
    //console.log(price);
    //console.table(_cash);
    //console.table(coins);
    price *= 100;
    
    let cash = {..._cash};
    Object.keys(cash).map(key => {coins[key] *= 100});
    let change = {};
    let coinsEntries = Object.entries(coins);
    let changeAmount = countMoneySum(cash, coins) - price;
    
    const recursiveExchange = (amount, lvl, change) => {
        if (!amount) return change;
        if (amount < 0 || lvl < 0) return false;

        let result = false;
        let [coinName, coinVal] = coinsEntries[lvl];
        //let coinVal = Object.values(coins)[lvl];
        let coinsNumber = parseInt(amount / coinVal);
        let sumToChange = 0;
        
        if (coinVal > amount || !coinsNumber) {
            return recursiveExchange(amount, lvl - 1, change.concat([[coinName, 0]]));
        }
        for (; coinsNumber > 0; coinsNumber--){
            sumToChange = coinsNumber * coinVal;
            result = recursiveExchange(amount - sumToChange, lvl - 1, change.concat([[coinName, coinsNumber]]));
            if (result) return result;
        }
        return false;
    }

    change = recursiveExchange(changeAmount, Object.values(cash).length - 1, []);

    Object.keys(cash).map(key => {coins[key] /= 100});
    return change;
}

//changeCashRegister(1, {"PENNY" : 0, "NICEL" : 0 ,"DIME" : 0, "QUARTER" : 0, "ONE" : 0, "FIVE" : 0,"TEN" : 0,"TWENTY" : 0, "ONE HUNDRED" : 1}, {"PENNY" : .01, "NICEL" : .05 ,"DIME" : .1, "QUARTER" : .25, "ONE" : 1, "FIVE" : 5,"TEN" : 10,"TWENTY" : 20, "ONE HUNDRED" : 100});

export {countMoneySum, changeCashRegister};