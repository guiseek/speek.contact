import {Get, Body, Patch, Param, Delete, Controller} from '@nestjs/common'
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger'
import {UpdateUserDto, UserResponseDto, UserService} from '@speek/keep/data'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return (await this.userService.findAll()).map(
      (user) => new UserResponseDto(user)
    )
  }

  @Get(':idOrUsername')
  async findOne(@Param('idOrUsername') idOrUsername: string) {
    if (isNaN(+idOrUsername)) {
      return new UserResponseDto(
        await this.userService.findOneByUsername(idOrUsername)
      )
    } else {
      return new UserResponseDto(
        await this.userService.findOneById(+idOrUsername)
      )
    }
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update user'})
  @ApiResponse({status: 401, description: 'Unauthorized.'})
  @ApiResponse({
    status: 200,
    description: 'The access token',
    type: UserResponseDto,
  })
  @ApiBody({type: UpdateUserDto})
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new UserResponseDto(
      await this.userService.update(+id, updateUserDto)
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new UserResponseDto(await this.userService.remove(+id))
  }
}
