import {
  pgTable,
  index,
  pgEnum,
  text,
  char,
  date,
  uniqueIndex,
  unique,
  uuid,
  timestamp,
  foreignKey,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const month = pgEnum('month', [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'nov',
  'dec',
]);
export const type = pgEnum('type', ['easy', 'moderate', 'challenging']);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    image: text('image'),
    password: char('password', { length: 60 }).notNull(),
    dob: date('dob').notNull(),
  },
  (table) => {
    return {
      email_idx: index('email_idx').on(table.email),
    };
  }
);

export const locations = pgTable(
  'locations',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    address: text('address').notNull(),
    registered_time: timestamp('registered_time', { mode: 'string' }).defaultNow().notNull(),
    description: text('description').notNull(),
  },
  (table) => {
    return {
      address_idx: uniqueIndex('address_idx').on(table.address),
      locations_address_unique: unique('locations_address_unique').on(table.address),
    };
  }
);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    registered_time: timestamp('registered_time', { mode: 'string' }).defaultNow().notNull(),
    description: text('description').notNull(),
    picture_url: text('picture_url').notNull(),
    likes_count: integer('likes_count').default(0).notNull(),
    trail_condition: integer('trail_condition').notNull(),
    weather: integer('weather').notNull(),
    accessibility: integer('accessibility').notNull(),
    location_id: uuid('location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
    owner_id: text('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      location_id_idx: index('location_id_idx').on(table.location_id),
      owner_id_idx: index('owner_id_idx').on(table.owner_id),
    };
  }
);

export const comments = pgTable(
  'comments',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    post_id: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    registered_time: timestamp('registered_time', { mode: 'string' }).defaultNow().notNull(),
    id: uuid('id').defaultRandom().notNull(),
  },
  (table) => {
    return {
      post_id_idx: index('post_id_idx').on(table.post_id),
    };
  }
);

export const preferences = pgTable('preferences', {
  user_id: text('user_id')
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: type('type').notNull(),
  trail: text('trail').notNull(),
  distance: integer('distance').notNull(),
  altitude: integer('altitude').notNull(),
  month: month('month').notNull(),
  features: text('features').notNull(),
});

export const users_to_locations = pgTable(
  'users_to_locations',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    location_id: uuid('location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      user_id_idx: index('user_id_idx').on(table.user_id),
      users_to_locations_user_id_location_id: primaryKey({
        columns: [table.user_id, table.location_id],
        name: 'users_to_locations_user_id_location_id',
      }),
    };
  }
);

export const users_like_posts = pgTable(
  'users_like_posts',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    post_id: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      users_like_posts_user_id_post_id: primaryKey({
        columns: [table.user_id, table.post_id],
        name: 'users_like_posts_user_id_post_id',
      }),
    };
  }
);
