import { relations } from "drizzle-orm/relations";
import { users, posts, locations, comments, preferences, users_to_locations, users_like_posts } from "./schema";

export const postsRelations = relations(posts, ({one, many}) => ({
	user: one(users, {
		fields: [posts.owner_id],
		references: [users.id]
	}),
	location: one(locations, {
		fields: [posts.location_id],
		references: [locations.id]
	}),
	comments: many(comments),
	users_like_posts: many(users_like_posts),
}));

export const usersRelations = relations(users, ({many}) => ({
	posts: many(posts),
	comments: many(comments),
	preferences: many(preferences),
	users_to_locations: many(users_to_locations),
	users_like_posts: many(users_like_posts),
}));

export const locationsRelations = relations(locations, ({many}) => ({
	posts: many(posts),
	users_to_locations: many(users_to_locations),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.post_id],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [comments.user_id],
		references: [users.id]
	}),
}));

export const preferencesRelations = relations(preferences, ({one}) => ({
	user: one(users, {
		fields: [preferences.user_id],
		references: [users.id]
	}),
}));

export const users_to_locationsRelations = relations(users_to_locations, ({one}) => ({
	location: one(locations, {
		fields: [users_to_locations.location_id],
		references: [locations.id]
	}),
	user: one(users, {
		fields: [users_to_locations.user_id],
		references: [users.id]
	}),
}));

export const users_like_postsRelations = relations(users_like_posts, ({one}) => ({
	post: one(posts, {
		fields: [users_like_posts.post_id],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [users_like_posts.user_id],
		references: [users.id]
	}),
}));