export class Api {
  private playerName: string;
  private email: string;
  private password: string;

  constructor() {
    this.playerName = 'ds-cloav';
    this.email = 'DSCloav@gmail.com';
    this.password = 'HUFE6587@jceda';

    this.getTicket();
  }

  private generateB64Creds(): string {
    return btoa(this.email + ':' + this.password);
  }

  private async getTicket() {
    const url = 'https://public-ubiservices.ubi.com/v3/profiles/sessions';
    const data = {
      playerName: this.playerName
    }

    const params = {
      headers: [
        'Accept: */*',
        'Accept-Encoding: gzip, deflate, br',
        'Accept-Language: en-GB,en;q=0.5',
        'Connection: keep-alive',
        'Origin: https://www.ubisoft.com',
        'Ubi-AppId: 3587dcbb-7f81-457c-9781-0e3f29f6f56a',
        'Ubi-SessionId: 22060f4d-0e94-4bea-aec8-68f807bc5f64',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
        'Host: public-ubiservices.ubi.com',
        'Cache-Control: no-cache',
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' + this.generateB64Creds(),
        'X-Requested-With: XMLHttpRequest',
        'Referer: https://public-ubiservices.ubi.com/Default/Login?appId=3587dcbb-7f81-457c-9781-0e3f29f6f56a&lang=en-US&nextUrl=https%3A%2F%2Fclub.ubisoft.com%2Flogged-in.html%3Flocale%3Den-US',
        'Content-Lenght: 19',
        'expiration: null',
      ],
      data: data,
      method: 'POST'
    }

    fetch()
      .then(
        data =>
      )

    console.log(url);
    console.log(data);
    console.log(params);
  }
}
