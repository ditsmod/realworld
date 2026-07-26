import type { ResultSetHeader } from 'mysql2';
import { injectable } from '@ditsmod/core';
import { CustomError } from '@ditsmod/core/errors';
import { DictService } from '@ditsmod/i18n';
import { injectRepository } from '@ditsmod/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '#entities';
import { ServerDict } from '#service/openapi-with-params/locales/current/index.js';
import { CryptoService } from '#service/auth/crypto.service.js';
import { DbUser, EmailOrUsername } from './types.js';
import { LoginDto, PutUserDto, SignUpFormDto, UserSessionDto } from './users.dto.js';

@injectable()
export class DbService {
  constructor(
    @injectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private dictService: DictService,
    private cryptoService: CryptoService
  ) {}

  /**
   * Returns inserted user ID or throw an error about user exists.
   */
  async signUpUser(signUpFormData: SignUpFormDto): Promise<number> {
    const { email, username, password } = signUpFormData.user;
    await this.checkUserExists({ email, username });
    const user = this.userRepo.create({
      email,
      username,
      password: this.cryptoService.getCryptedPassword(password),
    });
    const saved = await this.userRepo.save(user);
    return saved.userId;
  }

  async checkUserExists({ email, username }: EmailOrUsername) {
    const existing = await this.userRepo.findOne({
      where: [{ email }, { username }],
    });
    if (existing) {
      const dict = this.dictService.getDictionary(ServerDict);
      throw new CustomError({
        msg1: dict.usernameOrEmailAlreadyExists('email-or-username'),
        level: 'trace',
      });
    }
  }

  /**
   * Returns user ID or throw an error about user exists.
   */
  async signInUser({ email, password }: LoginDto): Promise<DbUser> {
    const user = await this.userRepo.findOne({
      select: { userId: true, username: true, email: true, bio: true, image: true },
      where: {
        email,
        password: this.cryptoService.getCryptedPassword(password),
      },
    });
    return user as DbUser;
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepo.findOne({
      select: { username: true, email: true, bio: true, image: true },
      where: { userId },
    });
    return user as Omit<UserSessionDto, 'token'>;
  }

  async putCurrentUser(userId: number, pubUser: PutUserDto) {
    const { email, username, password, image, bio } = pubUser;
    const updateData: Partial<UserEntity> = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = password;
    if (image !== undefined) updateData.image = image;
    if (bio !== undefined) updateData.bio = bio;

    const result = await this.userRepo.update(userId, updateData);
    return { affectedRows: result.affected || 0 } as unknown as ResultSetHeader;
  }
}
