import { relations } from "drizzle-orm";
import { boolean, index, pgEnum, pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { subscriptionTiers, TierNames } from "../data/subscrtiptionTiers";


const createdAt = timestamp("created_at" , {withTimezone : true}).notNull().defaultNow()
const updatedAt = timestamp("updated_at" , {withTimezone : true}).notNull().defaultNow().$onUpdate(()=> new Date())

export const UserTable = pgTable("users" , {
    id : uuid("id").primaryKey().defaultRandom(),
    name: text().notNull(),
})


export const ProductTable = pgTable("products" , {
    id : uuid("id").primaryKey().defaultRandom(),
    userId : uuid().notNull().references(()=> UserTable.id , {onDelete : 'cascade'}),
    name : text("name").notNull(),
    description : text("description"),
    url: text("url").notNull(),
    createdAt,
    updatedAt
},(table) => [
    index("product.user_id_index").on(table.userId)
] )

export const ProductCustomizationTable = pgTable("product_customization" , {
    id : uuid().primaryKey().defaultRandom(),
    classPrefix : text("class_prefix"),
    productId : uuid("product_id").notNull().references(()=> ProductTable.id , {onDelete : "cascade"}).unique(),
    locationMessage : text("location_message")
    .notNull()
    .default(
        "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power , so if you need it, use code <b>{coupon}</b> to get <b>{discount}%</b> off."
    ),
    backgroundColor : text("background_color").notNull().default("hsl(193,82%,31%)"),
   
  textColor: text("text_color").notNull().default("hsl(0, 0%, 100%)"),
  fontSize: text("font_size").notNull().default("1rem"),
  bannerContainer: text("banner_container").notNull().default("body"),
  isSticky: boolean("is_sticky").notNull().default(true),
  createdAt,
  updatedAt,
})

export const ProductViewTable = pgTable("product_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => ProductTable.id, { onDelete: "cascade" }),
  countryId: uuid("country_id").references(() => CountryTable.id, {
    onDelete: "cascade",
  }),
  visitedAt: timestamp("visited_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const CountryTable = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  countryGroupId: uuid("country_group_id")
    .notNull()
    .references(() => CountryGroupTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
})

export const CountryGroupTable = pgTable("country_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  recommendedDiscountPercentage: real("recommended_discount_percentage"),
  createdAt,
  updatedAt,
})

export const CountryGroupDiscountTable = pgTable(
  "country_group_discounts",
  {
    countryGroupId: uuid("country_group_id")
      .notNull()
      .references(() => CountryGroupTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => ProductTable.id, { onDelete: "cascade" }),
    coupon: text("coupon").notNull(),
    discountPercentage: real("discount_percentage").notNull(),
    createdAt,
    updatedAt,
  },
  table => [
     primaryKey({ columns: [table.countryGroupId, table.productId] }),
  ]
)


export const TierEnum = pgEnum("tier", Object.keys(subscriptionTiers) as [TierNames])


export const UserSubscriptionTable = pgTable(
  "user_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId : uuid("user_id").notNull().references(()=>UserTable.id , {onDelete : "cascade"}),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updatedAt,
  },
  table => [
     index("user_subscriptions.clerk_user_id_index").on(
      table.userId
    ),
   
]
)





// relations
export const productRelations = relations(ProductTable , ({one,many})=>({
    ProductCustomizable : one(ProductCustomizationTable),
    user : one(UserTable , {
        fields : [ProductTable.userId],
        references : [UserTable.id]
    }),
    Productviews : many(ProductViewTable),
    countryGroupDiscounts : many(CountryGroupDiscountTable), 
    

}))

export const userRelations = relations(UserTable, ({ many }) => ({
  products: many(ProductTable),
}));

export const productCustomizationRelations = relations(
  ProductCustomizationTable,
  ({ one }) => ({
    product: one(ProductTable, {
      fields: [ProductCustomizationTable.productId],
      references: [ProductTable.id],
    }),
  })
)
export const productViewsRelations = relations(
  ProductViewTable,
  ({ one }) => ({
    Product: one(ProductTable, {
      fields: [ProductViewTable.productId],
      references: [ProductTable.id],
    }),
    country: one(CountryTable, {
      fields: [ProductViewTable.countryId],
      references: [CountryTable.id],
    }),
  })
)


export const countryRelations = relations(
  CountryTable,
  ({ one , many }) => ({
   countryGroup : one(CountryGroupTable , {
    fields : [CountryTable.countryGroupId],
    references : [CountryGroupTable.id]
   }),
   productViews : many(ProductViewTable),
  })
)

export const countryGroupRelations = relations( CountryGroupTable , ({ many})=>({

    countries : many(CountryTable),
    countryGroupDiscounts: many(CountryGroupDiscountTable)
}))

export const countryGroupDiscountRelations = relations( CountryGroupDiscountTable , ({one})=>({
     products : one(ProductTable , {
        fields : [CountryGroupDiscountTable.productId],
        references : [ProductTable.id]
     }) , 
     countryGroup : one(CountryGroupTable , {
        fields : [CountryGroupDiscountTable.countryGroupId],
        references : [CountryGroupTable.id]
     })
}))