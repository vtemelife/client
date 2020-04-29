import invariant from 'invariant';
import pathToRegexp from 'path-to-regexp-es6';
import queryString from 'query-string';

import { UUID_REGEXP, INT_REGEXP } from 'regexps';

export class Url {
  public route = '';

  constructor(route: string) {
    this.route = route;
    this.reverse = pathToRegexp.compile(route);
  }

  public validateParams(params: any) {
    Object.keys(params).forEach((key) => {
      if (key.endsWith('uuid')) {
        if (
          !String(params[key]).match(UUID_REGEXP) &&
          !String(params[key]).match(INT_REGEXP)
        ) {
          console.warn(`${key} param is not uuid/int (${params[key]})`);
        }
      }
    });
  }

  public checkPath(pathname: string) {
    const re = pathToRegexp(this.route);
    return re.test(pathname);
  }

  public buildPath(props = {} as any): string {
    const { queryParams = {}, ...params } = props;
    try {
      this.validateParams(params);
    } catch (err) {
      console.error(err, { extra: { route: this.route, props } });
    }
    const search = queryString.stringify(queryParams);
    try {
      return search
        ? `${this.reverse(params)}?${search}`
        : this.reverse(params);
    } catch (err) {
      console.error(err);
      return '#';
    }
  }

  public valueOf() {
    invariant(false, 'Use "route" or "buildPath"');
  }

  public toString() {
    invariant(false, 'Use "route" or "buildPath"');
  }
  private reverse = (params: any) => {
    return '#';
  };
}

export default function url(route: any) {
  return new Url(route);
}
