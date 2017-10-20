import json
import click


@click.option(
    '--txfilename',
    required=True,
    help='Filename to load transactions from'
)
@click.option(
    '--whitelister',
    required=True,
    help='Address of the whitelister'
)
@click.group(invoke_without_command=True)
@click.pass_context
def main(ctx, **kwargs):
    whitelister = kwargs['whitelister'].lower()
    with open(kwargs['txfilename']) as f:
        txdata = json.loads(f.read())

    sum = 0
    num = 0
    addresses = set()
    for tx in txdata:
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

    
if __name__ == "__main__":
    main()
