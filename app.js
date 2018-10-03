let stockList = ["FB","AAPL","TSLA","GOOG"];
let validationList = [];

let getListedSecurities = function () {
    let rawList = [];
    let queryURL = `https://api.iextrading.com/1.0/ref-data/symbols`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        rawList = response;
        for (i = 0; i < rawList.length; i++) {
            validationList.push(rawList[i].symbol);
        }
    })
}

let displayStockInfo = function () {
    let stock = $(this).attr("symbol");
    let queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=3`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        let stockRow = $("<tr>").addClass("stock");
        let name = $("<td>").text(response.quote.companyName);
        let symbol = $("<td>").text(response.quote.symbol);
        let price = $("<td>").text(response.quote.latestPrice);
        let news = $("<td>");
        for (j = 0; j < 3; j++) {
            let story = `<a href="${response.news[j].url}">${response.news[j].headline}</a>`;
            news.append(story);
            if (j < 2) {
                news.append("<br>");
            }
        }
        stockRow.append(name,symbol,price,news);
        $("#stockInfo").prepend(stockRow);
    })
}

let renderButtons = function () {
    $("#stockButtons").empty();
    for (let i = 0; i < stockList.length; i++) {
        let newButton = $("<button>").addClass("stockButton");
        newButton.attr("symbol", stockList[i]);
        newButton.text(stockList[i]);
        $("#stockButtons").append(newButton);
    }
}

let addButton = function(event) {
    event.preventDefault();
    let inquiry = $("#stockInput").val().trim().toUpperCase();
    if (validationList.includes(inquiry) &! stockList.includes(inquiry)) {
        stockList.push(inquiry);
        $("#stockInput").val("");
    }
    renderButtons();
}

$("#addStock").on("click", addButton);
$("#stockButtons").on("click", ".stockButton", displayStockInfo);
getListedSecurities();
renderButtons();