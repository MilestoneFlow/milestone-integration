export class TokenStore {
  private static token = "";

  public static getToken() {
    return TokenStore.token;
  }

  public static setToken(token: string) {
    TokenStore.token = token;
  }
}
