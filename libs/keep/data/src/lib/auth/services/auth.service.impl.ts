import {JwtService} from '@nestjs/jwt'
import {CreateUserDto, UserResponseDto} from '../../user/dto'
import {createPassword, validatePassword} from '../utilities'
import {AuthRequestDto, AuthResponseDto, CheckUserDto} from '../dto'
import {UserService} from '../../user/ports/user.service'
import {User} from '@speek/type'

export class AuthServiceImpl {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser({username, password}: AuthRequestDto) {
    const user = await this.userService.findOneByUsername(username)
    if (user && validatePassword(password, user.password)) {
      return user
    }
    return null
  }

  async checkUser(user: CheckUserDto) {
    return this.userService.findOneByUsername(user.username)
  }

  async createUser(user: CreateUserDto) {
    const {password, salt} = createPassword(user.password)
    return new UserResponseDto(
      await this.userService.createOne({
        ...user,
        password,
        salt,
      })
    )
  }

  async login(user: User) {
    const payload = {username: user.username, sub: user.id}
    return new AuthResponseDto(this.jwtService.sign(payload))
  }
}
