import { injectable, inject } from 'inversify'
import { Config } from './Config'
import { UserModel } from '../Authentication/UserModel'

@injectable()
export class HttpGateway {
  @inject(Config)
  config

  @inject(UserModel)
  userModel

  get = async (path) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    console.log("ok?", response.ok)
    console.log("status?", response.status)
    const dto = response.json()
    return dto
  }

  post = async (path, requestDto) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'POST',
      body: JSON.stringify(requestDto),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }

  delete = async (path) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }
}
