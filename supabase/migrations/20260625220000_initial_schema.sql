


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."application_status_enum" AS ENUM (
    'submitted',
    'approved',
    'rejected'
);


ALTER TYPE "public"."application_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."market_status_enum" AS ENUM (
    'open',
    'closed'
);


ALTER TYPE "public"."market_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."orders_status_enum" AS ENUM (
    'pending_payment',
    'paid',
    'cancelled',
    'completed'
);


ALTER TYPE "public"."orders_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."owner_type_enum" AS ENUM (
    'user',
    'vendor'
);


ALTER TYPE "public"."owner_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."payment_method_enum" AS ENUM (
    'cash_on_delivery',
    'e_payment'
);


ALTER TYPE "public"."payment_method_enum" OWNER TO "postgres";


CREATE TYPE "public"."payment_status_enum" AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);


ALTER TYPE "public"."payment_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."product_status_enum" AS ENUM (
    'active',
    'disabled',
    'suspended',
    'deleted'
);


ALTER TYPE "public"."product_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."status_enum" AS ENUM (
    'active',
    'suspended',
    'deleted'
);


ALTER TYPE "public"."status_enum" OWNER TO "postgres";


CREATE TYPE "public"."vendor_orders_status_enum" AS ENUM (
    'pending',
    'preparing',
    'ready',
    'completed',
    'cancelled',
    'confirmed'
);


ALTER TYPE "public"."vendor_orders_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."vendor_status_enum" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'suspended'
);


ALTER TYPE "public"."vendor_status_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_top_products_by_category"("category_name" "text", "result_limit" integer DEFAULT 8) RETURNS TABLE("id" bigint, "name" "text", "category" "text", "price" numeric, "unit" "text", "image_path" "text", "vendor_first_name" "text", "vendor_last_name" "text", "vendor_profile_image_path" "text", "total_quantity" bigint)
    LANGUAGE "sql" STABLE
    AS $$
  select
    p.id,
    p.name,
    p.category,
    p.price,
    p.unit,
    p.image_path,
    u.first_name as vendor_first_name,
    u.last_name as vendor_last_name,
    u.profile_image_path as vendor_profile_image_path,
    coalesce(sum(case when o.id is not null then oi.quantity else 0 end), 0)::bigint as total_quantity
  from public.products p
  join public.vendors v on v.id = p.vendor_id
  join public.users u on u.user_id = v.user_id
  left join public.order_items oi on oi.product_id = p.id
  left join public.vendor_orders vo
    on vo.id = oi.vendor_order_id
   and vo.status <> 'cancelled'
  left join public.orders o
    on o.id = vo.order_id
   and o.status in ('paid', 'completed')
  where p.category = category_name
    and p.status = 'active'
    and p.stock > 0
    and v.vendor_status = 'approved'
  group by p.id, u.first_name, u.last_name, u.profile_image_path
  order by total_quantity desc, p.created_at desc
  limit result_limit;
$$;


ALTER FUNCTION "public"."get_top_products_by_category"("category_name" "text", "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_top_products_by_market"("target_market_id" bigint, "result_limit" integer DEFAULT 8) RETURNS TABLE("id" bigint, "name" "text", "category" "text", "price" numeric, "unit" "text", "image_path" "text", "vendor_first_name" "text", "vendor_last_name" "text", "vendor_profile_image_path" "text", "total_quantity" bigint)
    LANGUAGE "sql" STABLE
    AS $$
  select
    p.id,
    p.name,
    p.category,
    p.price,
    p.unit,
    p.image_path,
    u.first_name as vendor_first_name,
    u.last_name as vendor_last_name,
    u.profile_image_path as vendor_profile_image_path,
    coalesce(sum(case when o.id is not null then oi.quantity else 0 end), 0)::bigint as total_quantity
  from public.products p
  join public.vendors v on v.id = p.vendor_id
  join public.users u on u.user_id = v.user_id
  left join public.order_items oi on oi.product_id = p.id
  left join public.vendor_orders vo
    on vo.id = oi.vendor_order_id
   and vo.status <> 'cancelled'
  left join public.orders o
    on o.id = vo.order_id
   and o.status in ('paid', 'completed')
  where v.market_id = target_market_id
    and p.status = 'active'
    and p.stock > 0
    and v.vendor_status = 'approved'
  group by p.id, u.first_name, u.last_name, u.profile_image_path
  order by total_quantity desc, p.created_at desc
  limit result_limit;
$$;


ALTER FUNCTION "public"."get_top_products_by_market"("target_market_id" bigint, "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_top_vendors_by_category"("category_name" "text", "result_limit" integer DEFAULT 6) RETURNS TABLE("vendor_id" bigint, "vendor_first_name" "text", "vendor_last_name" "text", "vendor_profile_image_path" "text", "vendor_description" "text", "market_name" "text", "total_quantity" bigint)
    LANGUAGE "sql" STABLE
    AS $$
  select
    v.id as vendor_id,
    u.first_name as vendor_first_name,
    u.last_name as vendor_last_name,
    u.profile_image_path as vendor_profile_image_path,
    v.description as vendor_description,
    m.name as market_name,
    coalesce(sum(case when o.id is not null then oi.quantity else 0 end), 0)::bigint as total_quantity
  from public.vendors v
  join public.users u on u.user_id = v.user_id
  left join public.markets m on m.id = v.market_id
  join public.products p
    on p.vendor_id = v.id
   and p.category = category_name
   and p.status = 'active'
   and p.stock > 0
  left join public.order_items oi on oi.product_id = p.id
  left join public.vendor_orders vo
    on vo.id = oi.vendor_order_id
   and vo.status <> 'cancelled'
  left join public.orders o
    on o.id = vo.order_id
   and o.status in ('paid', 'completed')
  where v.vendor_status = 'approved'
  group by v.id, u.first_name, u.last_name, u.profile_image_path, v.description, m.name
  order by total_quantity desc, v.approved_at desc nulls last, v.created_at desc
  limit result_limit;
$$;


ALTER FUNCTION "public"."get_top_vendors_by_category"("category_name" "text", "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_top_vendors_by_market"("target_market_id" bigint, "result_limit" integer DEFAULT 6) RETURNS TABLE("vendor_id" bigint, "vendor_first_name" "text", "vendor_last_name" "text", "vendor_profile_image_path" "text", "vendor_description" "text", "total_quantity" bigint)
    LANGUAGE "sql" STABLE
    AS $$
  select
    v.id as vendor_id,
    u.first_name as vendor_first_name,
    u.last_name as vendor_last_name,
    u.profile_image_path as vendor_profile_image_path,
    v.description as vendor_description,
    coalesce(sum(case when o.id is not null then oi.quantity else 0 end), 0)::bigint as total_quantity
  from public.vendors v
  join public.users u on u.user_id = v.user_id
  left join public.products p
    on p.vendor_id = v.id
   and p.status = 'active'
   and p.stock > 0
  left join public.order_items oi on oi.product_id = p.id
  left join public.vendor_orders vo
    on vo.id = oi.vendor_order_id
   and vo.status <> 'cancelled'
  left join public.orders o
    on o.id = vo.order_id
   and o.status in ('paid', 'completed')
  where v.market_id = target_market_id
    and v.vendor_status = 'approved'
  group by v.id, u.first_name, u.last_name, u.profile_image_path, v.description
  order by total_quantity desc, v.approved_at desc nulls last, v.created_at desc
  limit result_limit;
$$;


ALTER FUNCTION "public"."get_top_vendors_by_market"("target_market_id" bigint, "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment"("order_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
update orders
set views = views + 1 -- increments is done here
where order_id = id;
$$;


ALTER FUNCTION "public"."increment"("order_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_product_suggestions"("search_query" "text", "suggestion_limit" integer DEFAULT 8) RETURNS TABLE("suggestion" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public'
    AS $$
  with normalized as (
    select trim(coalesce(search_query, '')) as q
  ),
  raw_suggestions as (
    select p.name as suggestion, 1 as priority
    from products p
    cross join normalized n
    where n.q <> ''
      and coalesce(p.stock, 0) > 0
      and p.name ilike '%' || n.q || '%'

    union all

    select p.category as suggestion, 2 as priority
    from products p
    cross join normalized n
    where n.q <> ''
      and coalesce(p.stock, 0) > 0
      and coalesce(p.category, '') <> ''
      and p.category ilike '%' || n.q || '%'

    union all

    select trim(concat(coalesce(u.first_name, ''), ' ', coalesce(u.last_name, ''))) as suggestion, 3 as priority
    from products p
    join vendors v on v.id = p.vendor_id
    join users u on u.user_id = v.user_id
    cross join normalized n
    where n.q <> ''
      and coalesce(p.stock, 0) > 0
      and trim(concat(coalesce(u.first_name, ''), ' ', coalesce(u.last_name, ''))) <> ''
      and trim(concat(coalesce(u.first_name, ''), ' ', coalesce(u.last_name, ''))) ilike '%' || n.q || '%'
  ),
  deduplicated as (
    select
      suggestion,
      min(priority) as priority
    from raw_suggestions
    where coalesce(suggestion, '') <> ''
    group by suggestion
  )
  select suggestion
  from deduplicated
  order by priority asc, char_length(suggestion) asc, suggestion asc
  limit greatest(coalesce(suggestion_limit, 8), 1);
$$;


ALTER FUNCTION "public"."search_product_suggestions"("search_query" "text", "suggestion_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_products"("search_query" "text", "sort_option" "text" DEFAULT 'newest'::"text", "result_limit" integer DEFAULT 50) RETURNS TABLE("id" bigint, "name" "text", "categories" "text", "price" numeric, "unit" "text", "image_path" "text", "vendor_first_name" "text", "vendor_last_name" "text", "vendor_profile_image_path" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public'
    AS $$
  with normalized as (
    select trim(coalesce(search_query, '')) as q
  ),
  matched_products as (
    select
      p.id,
      p.name,
      p.category as categories,
      p.price,
      p.unit,
      p.image_path,
      u.first_name as vendor_first_name,
      u.last_name as vendor_last_name,
      u.profile_image_path as vendor_profile_image_path,
      p.created_at,
      case
        when p.name ilike n.q || '%' then 1
        when p.name ilike '%' || n.q || '%' then 2
        when coalesce(p.category, '') ilike '%' || n.q || '%' then 3
        when trim(concat(coalesce(u.first_name, ''), ' ', coalesce(u.last_name, ''))) ilike '%' || n.q || '%' then 4
        else 5
      end as relevance_rank
    from products p
    join vendors v on v.id = p.vendor_id
    join users u on u.user_id = v.user_id
    cross join normalized n
    where n.q <> ''
      and coalesce(p.stock, 0) > 0
      and (
        p.name ilike '%' || n.q || '%'
        or coalesce(p.category, '') ilike '%' || n.q || '%'
        or trim(concat(coalesce(u.first_name, ''), ' ', coalesce(u.last_name, ''))) ilike '%' || n.q || '%'
      )
  )
  select
    id,
    name,
    categories,
    price,
    unit,
    image_path,
    vendor_first_name,
    vendor_last_name,
    vendor_profile_image_path
  from matched_products
  order by
    case when sort_option = 'price_low' then price end asc nulls last,
    case when sort_option = 'price_high' then price end desc nulls last,
    case when sort_option = 'newest' then created_at end desc nulls last,
    case when sort_option not in ('price_low', 'price_high', 'newest') then relevance_rank end asc,
    relevance_rank asc,
    created_at desc,
    name asc
  limit greatest(coalesce(result_limit, 50), 1);
$$;


ALTER FUNCTION "public"."search_products"("search_query" "text", "sort_option" "text", "result_limit" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."address_types" (
    "id" bigint NOT NULL,
    "code" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "applicable_to" "text" NOT NULL
);


ALTER TABLE "public"."address_types" OWNER TO "postgres";


ALTER TABLE "public"."address_types" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."address_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" bigint NOT NULL,
    "owner_type" "public"."owner_type_enum" NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "address_type_id" bigint NOT NULL,
    "street_address" "text" NOT NULL,
    "barangay" "text" NOT NULL,
    "city" "text" NOT NULL,
    "province" "text" NOT NULL,
    "postal_code" "text",
    "coordinates" json NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


ALTER TABLE "public"."addresses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."addresses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" bigint NOT NULL,
    "cart_id" bigint NOT NULL,
    "product_id" bigint NOT NULL,
    "quantity" bigint DEFAULT '1'::bigint NOT NULL,
    "unit_price" double precision NOT NULL,
    "added_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


ALTER TABLE "public"."cart_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cart_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "status" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


ALTER TABLE "public"."carts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."carts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "name" "text" NOT NULL,
    "image_path" "text"
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."markets" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "coordinates" json NOT NULL,
    "status" "public"."market_status_enum" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "image_path" "text"
);


ALTER TABLE "public"."markets" OWNER TO "postgres";


ALTER TABLE "public"."markets" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."markets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" bigint NOT NULL,
    "vendor_order_id" bigint NOT NULL,
    "product_id" bigint NOT NULL,
    "product_name" "text" NOT NULL,
    "unit_price" double precision NOT NULL,
    "quantity" bigint DEFAULT '1'::bigint NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "category" "text" DEFAULT 'Others'::"text" NOT NULL,
    "unit" "text" NOT NULL
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


ALTER TABLE "public"."order_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."order_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "order_number" "text" NOT NULL,
    "status" "public"."orders_status_enum" NOT NULL,
    "total_amount" double precision NOT NULL,
    "payment_method" "public"."payment_method_enum" NOT NULL,
    "payment_status" "public"."payment_status_enum" NOT NULL,
    "shipping_address_id" bigint NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


ALTER TABLE "public"."orders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."phone_otps" (
    "phone" "text" NOT NULL,
    "otp_hash" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."phone_otps" OWNER TO "postgres";


ALTER TABLE "public"."phone_otps" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."phone_otps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" bigint NOT NULL,
    "vendor_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "price" double precision NOT NULL,
    "unit" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image_path" "text",
    "stock" bigint NOT NULL,
    "status" "public"."product_status_enum" DEFAULT 'active'::"public"."product_status_enum" NOT NULL
);


ALTER TABLE "public"."products" OWNER TO "postgres";


ALTER TABLE "public"."products" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."products_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


ALTER TABLE "public"."roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."units" (
    "name" "text" NOT NULL
);


ALTER TABLE "public"."units" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" bigint NOT NULL,
    "role_id" bigint NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "status" "public"."status_enum" DEFAULT 'active'::"public"."status_enum" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "delivery_address" "text",
    "phone" "text" NOT NULL,
    "profile_image_path" "text",
    "birth_date" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendor_applications" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "market_id" bigint NOT NULL,
    "description" "text",
    "status" "public"."application_status_enum" DEFAULT 'submitted'::"public"."application_status_enum" NOT NULL,
    "reviewed_at" timestamp without time zone,
    "rejected_reason" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."vendor_applications" OWNER TO "postgres";


ALTER TABLE "public"."vendor_applications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."vendor_applications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."vendor_orders" (
    "id" bigint NOT NULL,
    "order_id" bigint NOT NULL,
    "vendor_id" bigint NOT NULL,
    "status" "public"."vendor_orders_status_enum" NOT NULL,
    "subtotal" double precision NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."vendor_orders" OWNER TO "postgres";


ALTER TABLE "public"."vendor_orders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."vendor_orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."vendors" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "description" "text",
    "vendor_status" "public"."vendor_status_enum" DEFAULT 'pending'::"public"."vendor_status_enum" NOT NULL,
    "approved_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "market_id" bigint NOT NULL
);


ALTER TABLE "public"."vendors" OWNER TO "postgres";


ALTER TABLE "public"."vendors" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."vendors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."address_types"
    ADD CONSTRAINT "address_types_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."address_types"
    ADD CONSTRAINT "address_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."markets"
    ADD CONSTRAINT "markets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."phone_otps"
    ADD CONSTRAINT "phone_otps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."vendor_applications"
    ADD CONSTRAINT "vendor_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendor_orders"
    ADD CONSTRAINT "vendor_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_address_type_id_fkey" FOREIGN KEY ("address_type_id") REFERENCES "public"."address_types"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_vendor_order_id_fkey" FOREIGN KEY ("vendor_order_id") REFERENCES "public"."vendor_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("name") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."units"("name") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_applications"
    ADD CONSTRAINT "vendor_applications_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_applications"
    ADD CONSTRAINT "vendor_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_orders"
    ADD CONSTRAINT "vendor_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_orders"
    ADD CONSTRAINT "vendor_orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



CREATE POLICY "Enable delete for authenticated users only" ON "public"."addresses" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for authenticated users only" ON "public"."cart_items" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for authenticated users only" ON "public"."products" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for authenticated users only" ON "public"."users" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."addresses" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."cart_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."carts" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."order_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."orders" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."vendor_applications" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."vendor_orders" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."users" FOR INSERT TO "anon" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."address_types" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."addresses" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."markets" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."products" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."vendors" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."cart_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."carts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."order_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."orders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."units" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."vendor_applications" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."vendor_orders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."addresses" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."cart_items" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."carts" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."orders" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."products" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."users" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."vendor_orders" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."vendors" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."address_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."carts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."markets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."phone_otps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."units" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendor_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendor_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendors" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."get_top_products_by_category"("category_name" "text", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_top_products_by_category"("category_name" "text", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_top_products_by_category"("category_name" "text", "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_top_products_by_market"("target_market_id" bigint, "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_top_products_by_market"("target_market_id" bigint, "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_top_products_by_market"("target_market_id" bigint, "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_top_vendors_by_category"("category_name" "text", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_top_vendors_by_category"("category_name" "text", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_top_vendors_by_category"("category_name" "text", "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_top_vendors_by_market"("target_market_id" bigint, "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_top_vendors_by_market"("target_market_id" bigint, "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_top_vendors_by_market"("target_market_id" bigint, "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment"("order_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment"("order_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment"("order_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."search_product_suggestions"("search_query" "text", "suggestion_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_product_suggestions"("search_query" "text", "suggestion_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_product_suggestions"("search_query" "text", "suggestion_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_products"("search_query" "text", "sort_option" "text", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_products"("search_query" "text", "sort_option" "text", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_products"("search_query" "text", "sort_option" "text", "result_limit" integer) TO "service_role";


















GRANT ALL ON TABLE "public"."address_types" TO "anon";
GRANT ALL ON TABLE "public"."address_types" TO "authenticated";
GRANT ALL ON TABLE "public"."address_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."address_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."address_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."address_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."carts" TO "anon";
GRANT ALL ON TABLE "public"."carts" TO "authenticated";
GRANT ALL ON TABLE "public"."carts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."carts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."carts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."carts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."markets" TO "anon";
GRANT ALL ON TABLE "public"."markets" TO "authenticated";
GRANT ALL ON TABLE "public"."markets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."markets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."markets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."markets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."phone_otps" TO "anon";
GRANT ALL ON TABLE "public"."phone_otps" TO "authenticated";
GRANT ALL ON TABLE "public"."phone_otps" TO "service_role";



GRANT ALL ON SEQUENCE "public"."phone_otps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."phone_otps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."phone_otps_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."units" TO "anon";
GRANT ALL ON TABLE "public"."units" TO "authenticated";
GRANT ALL ON TABLE "public"."units" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."vendor_applications" TO "anon";
GRANT ALL ON TABLE "public"."vendor_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_applications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."vendor_applications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."vendor_applications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."vendor_applications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."vendor_orders" TO "anon";
GRANT ALL ON TABLE "public"."vendor_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_orders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."vendor_orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."vendor_orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."vendor_orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."vendors" TO "anon";
GRANT ALL ON TABLE "public"."vendors" TO "authenticated";
GRANT ALL ON TABLE "public"."vendors" TO "service_role";



GRANT ALL ON SEQUENCE "public"."vendors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."vendors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."vendors_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































