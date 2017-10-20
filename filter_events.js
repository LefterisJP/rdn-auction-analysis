var BigNumber = require('bignumber.js');
var async = require('async');
var Web3 = require('web3');
var fs = require('fs');


// ------------ parameters start ----------------
var argv = require('minimist')(process.argv.slice(2), {string: 'auction-address'});


var rpc_host = 'http://localhost';
var rpc_port = 8545;

if ('rpc-host' in argv) {
    rpc_host = argv['rpc-host'];
}

if ('rpc-port' in argv) {
    rpc_port = argv['rpc-port'];
}

if (!('auction-address' in argv)) {
    console.log("Need to provide the address of the auction");
    process.exit();
}
var auction_address = argv['auction-address'];
auction_address = auction_address.toLowerCase();

// ------------ parameters end ------------------


var web3 = new Web3(new Web3.providers.HttpProvider(rpc_host + ':' + rpc_port));
var auction_abi = [{"constant":true,"inputs":[],"name":"num_tokens_auctioned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"final_price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price_exponent","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"end_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"token_multiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price_start","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bid_threshold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"funds_claimed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token_claim_waiting_period","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"whitelister_address","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bidder_addresses","type":"address[]"}],"name":"removeFromWhitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bids","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token_address","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"startAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"received_wei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bidder_addresses","type":"address[]"}],"name":"addToWhitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner_address","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price_constant","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver_address","type":"address"}],"name":"proxyClaimTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"start_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"missingFundsToEndAuction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet_address","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalizeAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_wallet_address","type":"address"},{"name":"_whitelister_address","type":"address"},{"name":"_price_start","type":"uint256"},{"name":"_price_constant","type":"uint256"},{"name":"_price_exponent","type":"uint32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_price_start","type":"uint256"},{"indexed":true,"name":"_price_constant","type":"uint256"},{"indexed":true,"name":"_price_exponent","type":"uint32"}],"name":"Deployed","type":"event"},{"anonymous":false,"inputs":[],"name":"Setup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_start_time","type":"uint256"},{"indexed":true,"name":"_block_number","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_sender","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_missing_funds","type":"uint256"}],"name":"BidSubmission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_recipient","type":"address"},{"indexed":false,"name":"_sent_amount","type":"uint256"}],"name":"ClaimedTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_final_price","type":"uint256"}],"name":"AuctionEnded","type":"event"},{"anonymous":false,"inputs":[],"name":"TokensDistributed","type":"event"}];

var auction = web3.eth.contract(auction_abi).at(auction_address);
var whitelister = auction.whitelister_address();


var fromBlock = 4383437;
var toBlock = 'latest';
var sum = new BigNumber(0);
var threshold = new BigNumber(0.8);


function bidToString(bid) {
    return web3.fromWei(bid.amount.toString(10)) + " | " + bid.from;
}

function extractBids() {

    var i;
    var bids = [];
    var bidFilter = auction.BidSubmission({}, {fromBlock: fromBlock, toBlock: toBlock});

    bidFilter.get(function (err, bidEvents) {
        if (err) {
            console.log(err);
            return;
        }

        console.log("Total number of bids so far: " + bidEvents.length);
        console.log(JSON.stringify(bidEvents[0]));

        for (i = 0; i < bidEvents.length; i++) {
            var bid = bidEvents[i];
            bids.push({amount: bid.args._amount, from: bid.args._sender, time: web3.eth.getBlock(bid.blockNumber).timestamp});
            sum = sum.add(bid.args._amount);
        }
        console.log("Total ETH sent:" + web3.fromWei(sum));

        bids.sort(function(a, b) { return b.amont - a.amount;});
        var new_sum = new BigNumber(0);
        var highest_amount = bids[0].amount;
        for (i = 0; i < bids.length; i++) {
            console.log("second: " + i);
            new_sum = new_sum.add(bids[i].amount);
            if (new_sum.div(sum).gt(threshold)) {
                console.log(
                    "Reached the " + threshold * 100 + "% threshold after " + (i + 1) + " transactions having contributed " + web3.fromWei(new_sum) +" ETH. Highest transaction bid: " + web3.fromWei(highest_amount.toString(10)) + " ETH and lowest bid: " + web3.fromWei(bids[i].amount.toString(10)) + " ETH.");
                break;
            }
        }

        var top_n = 10;
        console.log("Top " + top_n + " bids are:");
        for (i = 0; i < top_n; i++) {
            console.log(bidToString(bids[i]));
        }
    });
}




function readBlockchain(startBlockNumber, endBlockNumber, transactions) {
    if (endBlockNumber == null) {
        endBlockNumber = web3.eth.blockNumber;
    }
    if (startBlockNumber == null) {
        console.log("readBlockChain: Should provide a startBlockNumber!");
        process.exit();
    }

    console.log("Starting blockchain search from block " + startBlockNumber + " to " + endBlockNumber);

    for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        if (i % 100 == 0) {
            console.log("Gathering non-whitelisted transactions. Blocks: "+ i + "/"+ endBlockNumber);
	    fs.writeFileSync("nonwhitelisted_transactions.log", JSON.stringify(transactions));
	    console.log("IN Progress! -- Wrote " + transactions.length + " transactions to nonwhitelisted_transactions.log");
        }
        var block = web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
            block.transactions.forEach( function(e) {
                if (e.to == auction_address && !auction.whitelist(e.from, i)) {
                    transactions.push(e);
                }
            });
        }
    }

    fs.writeFile("nonwhitelisted_transactions.log", JSON.stringify(transactions), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("FINISHED! -- Wrote " + transactions.length + " transactions to nonwhitelisted_transactions.log");
    });
}

function getNonWhitelistedTransactions(fromBlock, blocksAhead) {
    fs.readFile('nonwhitelisted_transactions.log', 'utf8', function (err, data) {
        var transactions = [];
        if (!err) {
            transactions = JSON.parse(data);
            if (transactions.length > 0) {
                fromBlock = transactions[transactions.length - 1].blockNumber;
                console.log("Restored " + transactions.length + " transactions until block " + (fromBlock - 1) + " from the saved file");
            }
        }

        var endBlock = null;
        if (blocksAhead != null) {
            endBlock = fromBlock + blocksAhead;
        }

        readBlockchain(fromBlock, endBlock, transactions);
    });
}


// extractBids();
// getNonWhitelistedTransactions(fromBlock, null);
