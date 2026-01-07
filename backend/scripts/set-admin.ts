import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/user.schema';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function setAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const userModel = app.get(getModelToken(User.name));

  try {
    const email = 'zeamanuel1994@email.com';
    const password = 'zxcvbnm';

    // Find user by email
    let user = await usersService.findByEmail(email);

    if (!user) {
      console.log(`User with email ${email} not found. Creating new user...`);
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the user if it doesn't exist
      user = await userModel.create({
        email,
        password: hashedPassword,
        name: 'Admin User',
        username: email.split('@')[0],
        role: 'admin',
      });
      console.log(`✅ User created with admin role: ${email}`);
    } else {
      console.log(`User found. Updating to admin role and setting password...`);
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update existing user to admin and set password
      await userModel.findByIdAndUpdate(user._id, {
        role: 'admin',
        password: hashedPassword,
      });
      console.log(`✅ User ${email} updated to admin role`);
    }

    console.log(`\n🎉 Success! User ${email} is now an admin.`);
    console.log(`You can now login with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack:', error.stack);
    }
  } finally {
    await app.close();
  }
}

setAdmin();

