import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CreateProfileDto } from './dto/CreateProfile.dto';
import { CreatePostDto } from './dto/CreatePost.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: number) {
    this.usersService.deleteUser(id);
  }

  @Post(':id/profile')
  createUserProfile(
    @Param('id') id: number,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.usersService.createProfile(id, createProfileDto);
  }

  @Post(':id/posts')
  createPosts(@Param('id') id: number, @Body() createPostDto: CreatePostDto) {
    return this.usersService.createPost(id, createPostDto);
  }
}
