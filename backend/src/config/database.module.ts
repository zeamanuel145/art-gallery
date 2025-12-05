import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://zeamanuel1994_db_user:Juw77oSj17K6OBLd@cluster0.hmohqik.mongodb.net/?appName=Cluster0', {
      retryAttempts: 3,
      retryDelay: 5000,
      connectionFactory: (connection) => {
        console.log('✅ Connected to MongoDB successfully');
        return connection;
      },
      connectionErrorFactory: (error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('💡 To fix this:');
        console.log('   1. Install MongoDB locally, OR');
        console.log('   2. Use MongoDB Atlas (cloud), OR');
        console.log('   3. Set MONGODB_URI in .env file');
        return error;
      },
    }),
  ],
})
export class DatabaseModule {}