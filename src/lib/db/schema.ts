// lib/db/schema.ts
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role').default('admin').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const appData = pgTable('app_data', {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    data: jsonb('data').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});