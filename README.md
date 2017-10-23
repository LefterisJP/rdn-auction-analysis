# RDN Auction Analysis

## Installation

You need npm, and an ethereum client synced in the mainnet.


To install npm dependencies do

```
npm install
```


For the python analysis script dependencies create a python 3 virtualenv and install the requirements with

```
pip install -r requirements.txt
```

## Running the node.js data extractor

To extract data for analysis from the blockchain run:

```
npm start -- --auction-address "THEAUCTION" --rpc-host http://localhost --rpc-port 9191 --action extract-bids
```

to extract all the bid data in JSON formt in a local file called `bids.log`.

```
npm start -- --auction-address "THEAUCTION" --rpc-host http://localhost --rpc-port 9393 --action extract-transactions
```

to extract full transaction data based on set parameters for the entire duration of the auction.

Replace host/port with the ones of the node you are interacting with.

## Running the python analyzer

If you have a [plot.ly](https://plot.ly/) account you can enter the credentials via the `--plotly-user` and `--plotly-key` arguments.

To also publish the plot online if you have plot.ly credentials give the `--plot-online` argument.

Depending on what you want to analyze and do provide the appropriate `--action` value and point to the data to analyze (previously extracted by node.js) with `--data`.

### Creating a 24h rolling sum

To create a 24h rolling sum of the bids of the auction provide the `--action 24h-rolling-sum` argument. This will give a bar chart of the bids over time overlaid by a line chart of the 24h rolling sum of the bids.

As an example command:

```
python analyzer.py --data bids.log  --action 24h-rolling-sum
```

