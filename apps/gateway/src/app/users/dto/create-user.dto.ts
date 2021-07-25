export class CreateUserDto {
  email: string;
  name: string;
  username: string;
  dateCreated: Date;
  lastLogin: Date;
  permission: string;
  pushToken: string;
  accountId: string;
}
