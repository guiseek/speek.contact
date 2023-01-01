import {JwtService} from '@nestjs/jwt'
import {CreateUserDto, UserResponseDto} from '../../user/dto'
import {createPassword, validatePassword} from '../utilities'
import {AuthRequestDto, AuthResponseDto, CheckUserDto} from '../dto'
import {UserService} from '../../user/ports/user.service'
import {AuthService} from '../ports/auth.service'
import {User} from '@speek/type'

export class AuthServiceImpl implements AuthService {
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

  async checkUser({username}: CheckUserDto) {
    const user = await this.userService.findOneByUsername(username)
    const message = user ? 'Já está sendo usado' : 'Disponível para uso'
    return {exists: !!user, message}
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
    const {id, email, displayName} = user
    const payload = {sub: id, email, displayName}
    return new AuthResponseDto(this.jwtService.sign(payload))
  }
}
