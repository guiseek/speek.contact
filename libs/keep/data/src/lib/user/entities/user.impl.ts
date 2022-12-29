import {entityContainer} from '@speek/keep/utils'
import {
  Column,
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
@Unique(['username'])
export class UserImpl extends BaseEntity {
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
    type: 'date',
    nullable: true,
  })
  birthday?: Date

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  name: string

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
