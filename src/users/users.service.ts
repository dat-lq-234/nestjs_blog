import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserParams } from './dto/UpdateUser.dto';
import { CreateProfileDto } from './dto/CreateProfile.dto';
import { Profile } from 'src/entities/Profile';
import { CreatePostDto } from './dto/CreatePost.dto';
import { Post } from 'src/entities/Post';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.find({ relations: ['profile'] });
    if (!users || users.length === 0) return null;
    return users.map((el) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...rest } = el;
      return rest;
    });
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
      hashedPassword: `hashed:${createUserDto.password}`,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserParams: UpdateUserParams) {
    const updatedData = {
      ...updateUserParams,
      hashedPassword: updateUserParams.password,
    };
    delete updatedData.password;
    await this.userRepository.update({ id }, updatedData);
  }

  deleteUser(id: number) {
    this.userRepository.update({ id }, { isDeleted: true });
  }

  async createProfile(id: number, createProfileDto: CreateProfileDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const newProfile = this.profileRepository.create({ ...createProfileDto });
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }

  async createPost(id: number, createPostDto: CreatePostDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    const post = this.postRepository.create({ ...createPostDto, user });
    const savedPost = await this.postRepository.save(post);
    return savedPost;
  }
}
