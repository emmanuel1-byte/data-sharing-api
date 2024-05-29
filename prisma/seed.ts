import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const logger = new Logger();

/**
 * Seed the database with initial user data.
 *
 * This function creates two user accounts in the database with the following details:
 * - User A: email 'userA@gmail.com', password '123', role 'UserA'
 * - User B: email 'userB@gmail.com', password '321', role 'UserB'
 *
 * If the database population is successful, a success message is logged to the console.
 * If there is an error, an error is thrown with the stack trace.
 */
export async function seedDatabaseWithInitialUsers() {
  try {
    await prisma.user.create({
      data: {
        email: 'userA@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'UserA',
      },
    });

    await prisma.user.create({
      data: {
        email: 'userB@gmail.com',
        password: await bcrypt.hash('321', 10),
        role: 'UserB',
      },
    });
    logger.log('Database succesfully populated');
  } catch (err) {
    logger.error(`Failed to populate table, ${err.stack}`);
  }
}

seedDatabaseWithInitialUsers();
