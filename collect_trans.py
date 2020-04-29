import os
import re
import sys
import argparse
import json
from collections import OrderedDict


def main(arguments):
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        '--src_path',
        dest='src_path',
        help='Root src path with tsx (at default ./src)'
    )
    parser.add_argument(
        '--locale',
        dest='locale',
        help='Locale (at default en)'
    )
    parser.add_argument(
        '--locale_folder',
        dest='locale_folder',
        help='Locale (at default ./src/locale)'
    )

    parser.set_defaults(
        src_path='./src',
        locale='ru',
        locale_folder='./src/locale',
    )
    args = parser.parse_args(arguments)

    json_file = os.path.join(
        args.locale_folder,
        '{locale}.json'.format(locale=args.locale)
    )
    messages = OrderedDict()
    with open(json_file) as outfile:
        messages = OrderedDict(json.load(outfile))

    for key in messages:
        messages[key]['fuzzy'] = True

    for root, dirs, files in os.walk(args.src_path):
        for file in files:
            if file.endswith(".tsx"):
                file_path = os.path.join(root, file)
                f = open(file_path, "r")
                file_data = f.read()
                file_data = file_data
                trans_strings = re.findall(
                    r'\_\(([ \t\n\r]*)[\"\'](.*)[\"\']([ \t\n\r]*)\)',
                    file_data
                )
                for trans_string in trans_strings:
                    trans_string = trans_string[1]
                    if '_(' in trans_string:
                        # workaround
                        continue
                    if not messages.get(trans_string):
                        messages[trans_string] = {
                            "files": [],
                            "translate": "",
                            "fuzzy": False,
                        }
                    else:
                        messages[trans_string]["fuzzy"] = False
                    if file_path not in messages[trans_string]['files']:
                        messages[trans_string]['files'].append(file_path)

    with open(json_file, 'w', encoding='utf-8') as outfile:
        json.dump(
            messages,
            outfile,
            sort_keys=False,
            ensure_ascii=False,
            indent=4
        )


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
