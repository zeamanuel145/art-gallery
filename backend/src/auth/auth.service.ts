import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, username: string) {
    try {
      console.log('🔐 Hashing password for registration');
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = { name: username, email, password: hashedPassword };
      console.log('👤 Creating user with data:', { name: username, email });
      const created = await this.usersService.create(userData);
      console.log('✅ User created successfully');
      return {
        message: 'User created successfully',
        user: {
          id: (created as any)._id.toString(),
          username: (created as any).name,
          email: created.email,
        },
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('🔍 Looking for user with email:', email);
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        console.log('❌ User not found');
        throw new UnauthorizedException('User not found');
      }
      console.log('👤 User found, verifying password');

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        throw new UnauthorizedException('Invalid credentials');
      }
      console.log('✅ Password valid, generating token');

      const payload = { email: user.email, sub: (user as any)._id.toString() };
      const token = this.jwtService.sign(payload);
      console.log('🎫 Token generated successfully');

      return { 
        token, 
        user: { 
          id: (user as any)._id.toString(), 
          username: (user as any).name, 
          email: user.email 
        } 
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'If email exists, reset link sent' }; // Don't reveal if email exists
    
    // TODO: Implement email service
    return { message: 'Password reset email sent' };
  }
}
