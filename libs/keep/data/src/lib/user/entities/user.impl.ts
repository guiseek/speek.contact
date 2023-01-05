import {entityContainer} from '@speek/keep/utils'
import {User} from '@speek/type'
import {
  Column,
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'users',
})
@Unique(['username'])
export class UserImpl extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
  })
  username: string

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  password: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  salt: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string

  @Column({
    type: 'datetime',
  })
  birthday?: string

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  displayName: string

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  firstName: string

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  lastName: string

  @Column({
    type: 'varchar',
    default: '',
  })
  photoUrl: string

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  updatedAt: Date
}

entityContainer.add(UserImpl)
