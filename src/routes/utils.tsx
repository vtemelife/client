import queryString from "query-string";
// import pathToRegexp from 'path-to-regexp-es6';

/**
 * Class to control routes
 */
export class Url {
  public url: string;
  public name?: string;

  constructor(url: string, name?: string) {
    this.url = url;
    this.name = name;
  }

  public routePath = () => {
    return this.url;
  };

  public toPath = (options?: any) => {
    let url = String(this.url);
    if (options && options.urlParams) {
      Object.keys(options.urlParams).forEach(key => {
        url = url.replace(`:${key}`, options.urlParams[key]);
      });
    }
    if (options && options.getParams) {
      url += `?${queryString.stringify(options.getParams)}`;
    }
    return url;
  };

  public buildPath = (
    urlParams: any | undefined = undefined,
    options: any | undefined = undefined
  ) => {
    let url = String(this.url);
    if (urlParams) {
      Object.keys(urlParams).forEach(key => {
        url = url.replace(`:${key}`, urlParams[key]);
      });
    }
    if (options && options.getParams) {
      url += `?${queryString.stringify(options.getParams)}`;
    }
    return url;
  };
}
