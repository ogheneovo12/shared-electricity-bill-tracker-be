import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { AccessTokenGuard } from 'src/auth/guards';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AdminGuard } from 'src/common/guards/admin-guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { AdminEditUserDto, EditUserDto } from './dtos/edit-user.dto';
import { UserService } from './user.service';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AdminGuard)
  @Post('create')
  async ceateUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(AdminGuard)
  @Post(':id/toggle-admin-role')
  async toggleAdmin(@Param('id', IsObjectIdPipe) userId: string) {
    return this.userService.toggleUserAdminRole(userId);
  }

  @Patch('')
  async updateProfile(
    @GetUser('_id') userId: string,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.updateUser(userId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('edit-user/:userId')
  async editUser(
    @Param('userId', IsObjectIdPipe) userId: string,
    @Body() dto: AdminEditUserDto,
  ) {
    return this.userService.updateUser(userId, dto);
  }
}
