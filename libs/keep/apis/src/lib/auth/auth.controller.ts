import {Post, Get, Body, Request, UseGuards, Controller} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import {
  AuthRequestDto,
  AuthResponseDto,
  AuthService,
  AuthUserResponseDto,
  CheckUserDto,
  CheckUserResponseDto,
  CreateUserDto,
  UserResponseDto,
} from '@speek/keep/data'
import {AuthUserRequest} from '@speek/type'
import {Allowed} from '@speek/keep/utils'
import {JwtAuthGuard, LocalAuthGuard} from './guards'

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Allowed()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({summary: 'Sign in'})
  @ApiResponse({status: 401, description: 'Unauthorized.'})
  @ApiResponse({
    status: 200,
    description: 'The access token',
    type: AuthResponseDto,
  })
  @ApiBody({type: AuthRequestDto})
  signIn(@Request() req: AuthUserRequest) {
    return this.authService.login(req.user)
  }

  @Allowed()
  @Post('check')
  @ApiOperation({summary: 'Check user availability'})
  @ApiResponse({
    status: 200,
    description: 'The check user response',
    type: CheckUserResponseDto,
  })
  async checkUsername(@Body() {username}: CheckUserDto) {
    return this.authService.checkUser({username})
  }

  @Allowed()
  @Post('register')
  @ApiOperation({summary: 'Sign up'})
  @ApiResponse({status: 401, description: 'Unauthorized.'})
  @ApiResponse({
    status: 200,
    description: 'The auth user record',
    type: UserResponseDto,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Authenticated user'})
  @ApiResponse({status: 401, description: 'Unauthorized.'})
  @ApiResponse({
    status: 200,
    description: 'The auth user record',
    type: AuthUserResponseDto,
  })
  getProfile(@Request() req: AuthUserRequest) {
    return req.user
  }
}
