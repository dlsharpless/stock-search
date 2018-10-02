let stockList = ["FB","AAPL","TSLA","GOOG"];
let validationList = [];

let displayStockInfo = function () {
    let stock = $(this).attr("symbol");
    let queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=1`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        let stockDiv = $("<div>").addClass("stock");
        let name = $("<p>").text(`Company Name: ${response.quote.companyName}`);
        let symbol = $("<p>").text(`Stock Symbol: ${response.quote.symbol}`);
        let price = $("<p>").text(`Stock Price: ${response.quote.latestPrice}`);
        let news = $("<p>").text(`News Headline: ${response.news[0].summary}`);
        stockDiv.append(name,symbol,price,news);
        $("#stockInfo").prepend(stockDiv);
    })
}

let render = function () {
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
    let inquiry = $("#stockInput").val().trim();
    if (validationList.includes(inquiry)) {
        stockList.push(inquiry);
        $("#stockInput").val("");
    }
    render();
}

$("#addStock").on("click", addButton);
$("#stockButtons").on("click", ".stockButton", displayStockInfo);
render();