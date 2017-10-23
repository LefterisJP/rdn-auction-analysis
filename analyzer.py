import json
import click
import sys
import datetime
import plotly
import plotly.graph_objs as go


def toEth(x):
    if isinstance(x, str):
        x = float(x)
    return x / (10 ** 18)


def tsToDate(ts, formatstr='%Y/%m/%d %H:%M:%S'):
    return datetime.datetime.utcfromtimestamp(ts).strftime(formatstr)


def analyze_transactions(whitelister, data):
    sum = 0
    num = 0
    addresses = set()
    for tx in data:
        value = int(tx['value'])
        if tx['from'] != whitelister and value > 0:
            if value > 2.5 * (10 ** 18):
                eth_value = value / (10 ** 18)
                print("Most probably failed tx -- eth value: {} txhash: {}".format(eth_value, tx['hash']))
                continue
            sum += value
            num += 1
            addresses.add(tx['from'])

    print("Sum is {} ETH from {} transactions and {} unique addresses ".format(sum/(10 ** 18), num, len(addresses)))


def get_24h_rolling_sum(data, plot_online):
    if plot_online:
        plot = plotly.plot.plot
    else:
        plot = plotly.offline.plot

    data_start_index = 0

    rolling_average_24 = []
    rolling_sum = 0
    for x in data:
        try:
            rolling_sum += float((x['amount']))
        except:
            import pdb
            pdb.set_trace()
        while x['time'] - data[data_start_index]['time'] > 86400:
            rolling_sum -= float(data[data_start_index]['amount'])
            data_start_index += 1

        rolling_average_24.append((x['time'], rolling_sum))

    bids_data = go.Bar(
        x=[tsToDate(x['time']) for x in data],
        y=[toEth(x['amount']) for x in data],
        name='Bids'
    )
    rolling_data = go.Scatter(
        x=[tsToDate(x[0]) for x in rolling_average_24],
        y=[toEth(x[1]) for x in rolling_average_24],
        name='24h rolling sum'
    )
    plot([bids_data, rolling_data], filename='line-mode')


@click.option(
    '--data',
    required=True,
    help='Filename to load data from'
)
@click.option(
    '--whitelister',
    required=False,
    help='Address of the whitelister'
)
@click.option(
    '--action',
    required=True,
    type=click.Choice(['analyze-transactions', '24h-rolling-sum']),
    help='The command to run'
)
@click.option(
    '--plotly-user',
    help='plotly user credentials',
)
@click.option(
    '--plotly-key',
    help='plotly api key',
)
@click.option('--plot-online', is_flag=True)
@click.group(invoke_without_command=True)
@click.pass_context
def main(ctx, action, whitelister, plotly_user, **kwargs):
    if whitelister:
        whitelister = kwargs['whitelister'].lower()
    with open(kwargs['data']) as f:
        data = json.loads(f.read())

    if plotly_user:
        plotly.tools.set_credentials_file(
            username=plotly_user,
            api_key=kwargs['plotly_key'],
        )

    if action == 'analyze-transactions':
        analyze_transactions(whitelister, data)
    elif action == '24h-rolling-sum':
        get_24h_rolling_sum(data, kwargs['plot_online'])
    else:
        print("Action {} is illegal -- should never happen".format(action));
        sys.exit(1)


if __name__ == "__main__":
    main()
