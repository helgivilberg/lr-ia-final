import { injectable } from 'inversify'

@injectable()
export class Config {
  constructor() {
    this.apiUrl = 'https://api.logicroom.co/secure-api/helgivilberg@gmail.com'
  }
}
