ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;