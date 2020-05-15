export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationTimestamp: number
  ) {}

  get token() {
    if (
      !this._tokenExpirationTimestamp ||
      new Date().getTime() > this._tokenExpirationTimestamp
    ) {
      return null;
    }
    return this._token;
  }

  get expiration() {
    return this._tokenExpirationTimestamp;
  }
}
