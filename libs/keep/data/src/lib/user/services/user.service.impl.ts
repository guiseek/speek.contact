import {Repository} from 'typeorm'
import {CreateUserDto} from '../dto/create-user.dto'
import {UpdateUserDto} from '../dto/update-user.dto'
import {UserService} from '../ports/user.service'
import {User} from '@speek/type'

export class UserServiceImpl implements UserService {
  constructor(private userRepository: Repository<User>) {}

  async findAll() {
    return this.userRepository.find()
  }

  async createOne(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto)
  }

  async findOneById(id: number) {
    return this.userRepository.findOneBy({id})
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({username})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id})
    if (!user) throw new Error(`User with id ${id} not found`)
    return this.userRepository.save({id, ...updateUserDto})
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({id})
    if (!user) throw new Error(`User with id ${id} not found`)
    return this.userRepository.remove(user)
  }
}
