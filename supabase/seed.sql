SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict sbYJbrlSKiSjRwycqHCuwc1w98LiMYfEadIF4wFbcqA3rHJ7LaROrefcmDWuzbm

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'efa58984-9651-40ee-94af-08775b6291bf', 'authenticated', 'authenticated', '+639771495821@palenque.dev', '$2a$10$TqYmoazZDOCnRZ9Mt0jmGOQgXRfDSXqelHaUv7054SvFj.K/IcOOu', '2026-04-08 11:28:02.77016+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-13 14:43:29.312314+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "efa58984-9651-40ee-94af-08775b6291bf", "email": "+639771495821@palenque.dev", "email_verified": true, "phone_verified": false}', NULL, '2026-04-08 11:28:02.730769+00', '2026-05-13 14:43:29.314675+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'authenticated', 'authenticated', '+639771495822@palenque.dev', '$2a$10$DrIhUC4CmUqU8gDexSUtlOnkb1IJOyusuMvN1S1SSQrG9SBw2HrV2', '2026-03-26 06:35:44.106501+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-14 15:39:34.981947+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "187fc25c-ba2c-43bf-81ad-c70c8867fe97", "email": "+639771495822@palenque.dev", "email_verified": true, "phone_verified": false}', NULL, '2026-03-26 06:35:44.068411+00', '2026-05-16 08:10:14.985704+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4cd647df-140f-4113-8d50-f7506f72c2f8', 'authenticated', 'authenticated', '+639771495823@palenque.dev', '$2a$10$e4onczzOipkFNtJXObDo/ePcboHB2nBYQOmJ3tNPA8YAYul.skfCW', '2026-03-26 06:32:51.522939+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-13 11:44:29.788623+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "4cd647df-140f-4113-8d50-f7506f72c2f8", "email": "+639771495823@palenque.dev", "email_verified": true, "phone_verified": false}', NULL, '2026-03-26 06:32:51.494931+00', '2026-05-13 11:44:29.794212+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', 'authenticated', 'authenticated', '+639771495824@palenque.dev', '$2a$10$F12wx0ezQPzJKy4VfVJmdO4hJO8mlZz0Q7kh//zJHPcumFrXeqH8y', '2026-03-17 06:09:12.972218+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-24 16:43:05.43117+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "0d1a226e-72a8-41e1-b5e5-2b05eb9b03af", "email": "+639771495824@palenque.dev", "email_verified": true, "phone_verified": false}', NULL, '2026-03-17 06:09:12.947911+00', '2026-05-24 16:43:05.454642+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{"sub": "0d1a226e-72a8-41e1-b5e5-2b05eb9b03af", "email": "+639771495824@palenque.dev", "email_verified": false, "phone_verified": false}', 'email', '2026-03-17 06:09:12.961576+00', '2026-03-17 06:09:12.961622+00', '2026-03-17 06:09:12.961622+00', '5825429e-f3de-4ddc-b35d-03958352ea6a'),
	('4cd647df-140f-4113-8d50-f7506f72c2f8', '4cd647df-140f-4113-8d50-f7506f72c2f8', '{"sub": "4cd647df-140f-4113-8d50-f7506f72c2f8", "email": "+639771495823@palenque.dev", "email_verified": false, "phone_verified": false}', 'email', '2026-03-26 06:32:51.513022+00', '2026-03-26 06:32:51.513076+00', '2026-03-26 06:32:51.513076+00', '4da3e305-26e6-4058-a645-98183d174e37'),
	('187fc25c-ba2c-43bf-81ad-c70c8867fe97', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', '{"sub": "187fc25c-ba2c-43bf-81ad-c70c8867fe97", "email": "+639771495822@palenque.dev", "email_verified": false, "phone_verified": false}', 'email', '2026-03-26 06:35:44.087374+00', '2026-03-26 06:35:44.087422+00', '2026-03-26 06:35:44.087422+00', 'd5bb150d-8199-4348-99f7-a7988b92718b'),
	('efa58984-9651-40ee-94af-08775b6291bf', 'efa58984-9651-40ee-94af-08775b6291bf', '{"sub": "efa58984-9651-40ee-94af-08775b6291bf", "email": "+639771495821@palenque.dev", "email_verified": false, "phone_verified": false}', 'email', '2026-04-08 11:28:02.758051+00', '2026-04-08 11:28:02.758109+00', '2026-04-08 11:28:02.758109+00', '71b8fee3-827e-4544-8a55-5353cf195437');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('588f2d40-ba98-4451-b3ab-c32078b2eb79', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', '2026-05-14 15:39:34.982843+00', '2026-05-16 08:10:15.000397+00', NULL, 'aal1', NULL, '2026-05-16 08:10:15.00026', 'okhttp/4.12.0', '136.158.100.99', NULL, NULL, NULL, NULL, NULL),
	('3232bc3e-5f60-4ab2-8149-b0ef7f0558ea', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-05-24 16:43:05.432553+00', '2026-05-24 16:43:05.432553+00', NULL, 'aal1', NULL, NULL, 'okhttp/4.12.0', '136.158.100.159', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('588f2d40-ba98-4451-b3ab-c32078b2eb79', '2026-05-14 15:39:34.987467+00', '2026-05-14 15:39:34.987467+00', 'password', '4dfbbe29-e202-4055-a9d6-96ec462b5b66'),
	('3232bc3e-5f60-4ab2-8149-b0ef7f0558ea', '2026-05-24 16:43:05.455285+00', '2026-05-24 16:43:05.455285+00', 'password', '656fe695-297a-49ce-8668-e32ee6277f45');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 471, 'n6zhmntfcocm', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', true, '2026-05-14 16:37:40.392494+00', '2026-05-16 08:10:14.936339+00', 'lk2yyy4iutvg', '588f2d40-ba98-4451-b3ab-c32078b2eb79'),
	('00000000-0000-0000-0000-000000000000', 472, 'n2rd5qkwbzko', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', false, '2026-05-16 08:10:14.967662+00', '2026-05-16 08:10:14.967662+00', 'n6zhmntfcocm', '588f2d40-ba98-4451-b3ab-c32078b2eb79'),
	('00000000-0000-0000-0000-000000000000', 475, 'tbxbuq64bqda', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', false, '2026-05-24 16:43:05.44612+00', '2026-05-24 16:43:05.44612+00', NULL, '3232bc3e-5f60-4ab2-8149-b0ef7f0558ea'),
	('00000000-0000-0000-0000-000000000000', 470, 'lk2yyy4iutvg', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', true, '2026-05-14 15:39:34.984681+00', '2026-05-14 16:37:40.373441+00', NULL, '588f2d40-ba98-4451-b3ab-c32078b2eb79');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: address_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."address_types" ("id", "code", "display_name", "applicable_to") VALUES
	(1, 'home', 'Home', 'user'),
	(2, 'work', 'Work', 'user'),
	(3, 'other', 'Other', 'both'),
	(4, 'pickup', 'Pickup Address', 'vendor'),
	(5, 'return', 'Return Address', 'vendor'),
	(6, 'store', 'Store Location', 'vendor');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("status", "user_id", "first_name", "last_name", "email", "delivery_address", "phone", "profile_image_path", "birth_date") VALUES
	('active', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', 'James', 'Ricarte', NULL, NULL, '+639771495824', 'profile-images/0d1a226e-72a8-41e1-b5e5-2b05eb9b03af/1775801492679.jpeg', NULL),
	('active', '4cd647df-140f-4113-8d50-f7506f72c2f8', 'Mark Joseph', 'Ante', NULL, NULL, '+639771495823', 'profile-images/4cd647df-140f-4113-8d50-f7506f72c2f8/1775801538946.jpeg', NULL),
	('active', 'efa58984-9651-40ee-94af-08775b6291bf', 'Marissa', 'Ricarte', NULL, NULL, '+639771495821', NULL, '2003-01-03'),
	('active', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'Marita', 'Ricarte', NULL, NULL, '+639771495822', NULL, '2003-01-03');


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."addresses" ("id", "owner_type", "owner_id", "address_type_id", "street_address", "barangay", "city", "province", "postal_code", "coordinates", "is_default", "created_at", "updated_at") VALUES
	(6, 'user', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', 1, '4PRC+XHQ BU Main Campus Road', 'Albay', 'Legazpi City', 'Bicol', NULL, '{"latitude":13.1426036,"longitude":123.7217541}', true, '2026-03-17 06:09:26.600348', '2026-03-17 06:09:26.600348'),
	(7, 'user', '4cd647df-140f-4113-8d50-f7506f72c2f8', 1, 'Purok 5 187 Emilio Jacinto', 'Old Albay District', 'Legazpi City', 'Bicol', '4500', '{"latitude":13.139183555041992,"longitude":123.72895807027817}', true, '2026-03-26 06:34:23.097317', '2026-03-26 06:34:23.097317'),
	(8, 'user', '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 1, '311 Brgy 16', 'Albay', 'Legazpi City', 'Bicol', NULL, '{"latitude":13.143107713286707,"longitude":123.73754248023033}', true, '2026-03-26 06:36:38.673127', '2026-03-26 06:36:38.673127'),
	(9, 'user', 'efa58984-9651-40ee-94af-08775b6291bf', 1, 'Jamaica Mansions Subdivision', 'Albay', 'Tabaco City', 'Bicol', '4511', '{"latitude":13.3523711,"longitude":123.721226}', true, '2026-04-08 11:28:59.995654', '2026-04-08 11:28:59.995654');


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."carts" ("id", "user_id", "status", "created_at", "updated_at") VALUES
	(3, '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', NULL, '2026-03-22 06:20:10.608902', '2026-03-22 06:20:10.608902'),
	(4, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', NULL, '2026-03-26 06:48:50.694873', '2026-03-26 06:48:50.694873');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("name", "image_path") VALUES
	('Others', NULL),
	('Fruits', 'category-images/Fruits.png'),
	('Meat', 'category-images/Meat.png'),
	('Poultry', 'category-images/Poultry.png'),
	('Seafood', 'category-images/Seafood.png'),
	('Vegetables', 'category-images/Vegetables.png');


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."markets" ("id", "name", "coordinates", "status", "created_at", "updated_at", "image_path") VALUES
	(1, 'Legazpi City', '{"latitude": 13.14681, "longitude": 123.75033}', 'open', '2026-03-17 15:00:13', '2026-03-17 15:00:17', 'market-images/1/legazpi.jpg'),
	(2, 'New Albay', '{"latitude":13.139,"longitude":123.743}', 'open', '2026-03-17 15:03:53', '2026-03-17 15:03:54', 'market-images/2/new_albay.jpg'),
	(3, 'Daraga', '{"latitude": 13.1502, "longitude": 123.7142}', 'open', '2026-03-17 15:09:09', '2026-03-17 15:09:12', 'market-images/3/daraga.jpg');


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."units" ("name") VALUES
	('1kg'),
	('500g'),
	('1pc'),
	('1 bundle');


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vendors" ("id", "user_id", "description", "vendor_status", "approved_at", "created_at", "updated_at", "market_id") VALUES
	(3, '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', 'Nothing', 'approved', '2026-03-22 13:21:07', '2026-03-22 13:21:01', '2026-03-22 13:21:03', 1),
	(5, '4cd647df-140f-4113-8d50-f7506f72c2f8', 'Nothing', 'approved', '2026-03-26 14:42:38', '2026-03-26 14:42:21', '2026-03-26 14:42:23', 3);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "vendor_id", "name", "category", "price", "unit", "created_at", "image_path", "stock", "status") VALUES
	(11, 3, 'Hotdog', 'Meat', 125, '500g', '2026-03-22 06:01:15.024312+00', 'product-images/vendor-3/1575ff78-c28e-4c3d-81da-48fe001d25f5.jpeg', 5, 'active'),
	(14, 3, 'Sigarilyas', 'Vegetables', 50, '1 bundle', '2026-03-24 06:55:39.46799+00', 'product-images/vendor-3/20efd9fa-0e8b-4629-9c08-8c180c613ec3.jpeg', 5, 'active'),
	(15, 5, 'Gg', 'Seafood', 180, '1kg', '2026-03-26 06:45:53.728009+00', 'product-images/vendor-5/bd6b5774-23fb-4cd2-a68a-8aa325d40f2e.jpeg', 45, 'active'),
	(16, 5, 'Talbos ng kamote', 'Vegetables', 30, '1 bundle', '2026-03-26 06:46:20.947571+00', 'product-images/vendor-5/1285fe61-4aa0-4c0b-9cae-d65b078df637.jpeg', 46, 'active'),
	(17, 3, 'Singkamas', 'Vegetables', 70, '1kg', '2026-04-09 06:56:28.731338+00', 'product-images/vendor-3/cd525aed-31e7-438a-ad2a-5e0a59c690de.jpeg', 50, 'active'),
	(18, 3, 'Reployo', 'Vegetables', 120, '1kg', '2026-04-09 08:14:28.792804+00', 'product-images/vendor-3/69b757d2-4d79-4431-89f4-36696ce427d3.jpeg', 50, 'active'),
	(13, 3, 'Longanisa', 'Meat', 280, '1kg', '2026-03-22 06:11:42.735799+00', 'product-images/vendor-3/7b11e98a-4f5c-4557-9479-2ae9e7d8fec3.jpeg', 3, 'active');


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cart_items" ("id", "cart_id", "product_id", "quantity", "unit_price", "added_at", "updated_at") VALUES
	(51, 4, 11, 1, 125, '2026-05-14 15:39:50.094315', '2026-05-14 15:39:50.094315'),
	(52, 3, 14, 1, 50, '2026-05-24 16:40:08.421873', '2026-05-24 16:40:08.421873'),
	(53, 3, 15, 1, 180, '2026-05-24 16:40:22.98116', '2026-05-24 16:40:22.98116');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."orders" ("id", "user_id", "order_number", "status", "total_amount", "payment_method", "payment_status", "shipping_address_id", "created_at") VALUES
	(18, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1774507868654430', 'pending_payment', 1255, 'cash_on_delivery', 'pending', 8, '2026-03-26 06:51:09.07561'),
	(19, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1774508160627895', 'pending_payment', 175, 'cash_on_delivery', 'pending', 8, '2026-03-26 06:56:01.010707'),
	(20, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1774943252220977', 'pending_payment', 440, 'cash_on_delivery', 'pending', 8, '2026-03-31 07:47:32.508467'),
	(21, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1775806946552304', 'pending_payment', 460, 'cash_on_delivery', 'pending', 8, '2026-04-10 07:42:27.930745'),
	(22, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1775806981848818', 'pending_payment', 80, 'cash_on_delivery', 'pending', 8, '2026-04-10 07:43:03.204016'),
	(23, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1775809832214585', 'pending_payment', 330, 'cash_on_delivery', 'pending', 8, '2026-04-10 08:30:33.650796'),
	(24, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 'ORD1776062645965422', 'pending_payment', 175, 'cash_on_delivery', 'pending', 8, '2026-04-13 06:44:06.912858'),
	(25, '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', 'ORD1779636445675778', 'pending_payment', 330, 'cash_on_delivery', 'pending', 6, '2026-05-24 15:27:26.671641');


--
-- Data for Name: vendor_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vendor_orders" ("id", "order_id", "vendor_id", "status", "subtotal", "created_at") VALUES
	(17, 19, 3, 'completed', 125, '2026-03-26 06:56:01.307748'),
	(15, 18, 3, 'completed', 965, '2026-03-26 06:51:09.339856'),
	(16, 18, 5, 'completed', 240, '2026-03-26 06:51:09.848817'),
	(18, 20, 5, 'completed', 390, '2026-03-31 07:47:32.741806'),
	(19, 21, 3, 'pending', 50, '2026-04-10 07:42:28.259786'),
	(20, 21, 5, 'pending', 360, '2026-04-10 07:42:28.754992'),
	(21, 22, 5, 'pending', 30, '2026-04-10 07:43:03.413482'),
	(22, 23, 3, 'pending', 280, '2026-04-10 08:30:34.021207'),
	(23, 24, 3, 'ready', 125, '2026-04-13 06:44:07.240155'),
	(24, 25, 3, 'pending', 280, '2026-05-24 15:27:26.993483');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."order_items" ("id", "vendor_order_id", "product_id", "product_name", "unit_price", "quantity", "created_at", "category", "unit") VALUES
	(20, 15, 13, 'Longanisa', 280, 3, '2026-03-26 06:51:09.603482', 'Seafood', '1kg'),
	(21, 15, 11, 'Hotdog', 125, 1, '2026-03-26 06:51:09.603482', 'Meat', '500g'),
	(22, 16, 15, 'Gg', 180, 1, '2026-03-26 06:51:10.068091', 'Seafood', '1kg'),
	(23, 16, 16, 'Talbos ng kamote', 30, 2, '2026-03-26 06:51:10.068091', 'Vegetables', '1 bundle'),
	(24, 17, 11, 'Hotdog', 125, 1, '2026-03-26 06:56:01.538256', 'Meat', '500g'),
	(25, 18, 15, 'Gg', 180, 2, '2026-03-31 07:47:32.968228', 'Seafood', '1kg'),
	(26, 18, 16, 'Talbos ng kamote', 30, 1, '2026-03-31 07:47:32.968228', 'Vegetables', '1 bundle'),
	(27, 19, 14, 'Sigarilyas', 50, 1, '2026-04-10 07:42:28.513341', 'Vegetables', '1 bundle'),
	(28, 20, 15, 'Gg', 180, 2, '2026-04-10 07:42:28.948872', 'Seafood', '1kg'),
	(29, 21, 16, 'Talbos ng kamote', 30, 1, '2026-04-10 07:43:03.750243', 'Vegetables', '1 bundle'),
	(30, 22, 13, 'Longanisa', 280, 1, '2026-04-10 08:30:34.353024', 'Seafood', '1kg'),
	(31, 23, 11, 'Hotdog', 125, 1, '2026-04-13 06:44:07.571474', 'Meat', '500g'),
	(32, 24, 13, 'Longanisa', 280, 1, '2026-05-24 15:27:27.283695', 'Seafood', '1kg');


--
-- Data for Name: phone_otps; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "name") VALUES
	(1, 'consumer'),
	(2, 'vendor'),
	(3, 'admin');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: vendor_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vendor_applications" ("id", "user_id", "market_id", "description", "status", "reviewed_at", "rejected_reason", "created_at") VALUES
	(14, '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', 1, 'Nothing', 'approved', '2026-03-22 13:19:53', NULL, '2026-03-22 04:47:40.726455'),
	(15, '4cd647df-140f-4113-8d50-f7506f72c2f8', 3, 'Nothing', 'approved', '2026-03-26 14:42:04', NULL, '2026-03-26 06:41:20.196319'),
	(16, 'efa58984-9651-40ee-94af-08775b6291bf', 1, NULL, 'submitted', NULL, NULL, '2026-04-12 16:45:01.299886'),
	(17, '187fc25c-ba2c-43bf-81ad-c70c8867fe97', 3, NULL, 'submitted', NULL, NULL, '2026-04-13 06:34:30.973651');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('products', 'products', NULL, '2026-03-09 04:05:13.912615+00', '2026-03-09 04:05:13.912615+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('markets', 'markets', NULL, '2026-03-18 15:18:01.930084+00', '2026-03-18 15:18:01.930084+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('categories', 'categories', NULL, '2026-04-06 07:27:22.386473+00', '2026-04-06 07:27:22.386473+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('users', 'users', NULL, '2026-04-08 15:37:15.249892+00', '2026-04-08 15:37:15.249892+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('e8300fac-161b-4d7b-85c2-41d1c3130357', 'users', 'profile-images/.emptyFolderPlaceholder', NULL, '2026-04-08 15:37:48.511958+00', '2026-04-08 16:07:11.425732+00', '2026-04-08 15:37:48.511958+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-04-08T16:07:12.000Z", "contentLength": 0, "httpStatusCode": 200}', 'db2355cd-b78f-4138-a732-8db33c48da25', NULL, '{}'),
	('bd1abee1-9640-43a9-9f5c-e8a0c5594a88', 'products', 'product-images/vendor-2/f859ebdb-e9ff-4544-8043-52eb6504ca93.jpeg', '08ea4637-acfa-460c-895a-387e11593e92', '2026-03-10 07:01:25.263924+00', '2026-03-10 07:01:25.263924+00', '2026-03-10 07:01:25.263924+00', '{"eTag": "\"4b8db00492bdd4910191e56173967225\"", "size": 78914, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-10T07:01:26.000Z", "contentLength": 78914, "httpStatusCode": 200}', 'b127ad92-a175-45d8-9788-afadedb26d18', '08ea4637-acfa-460c-895a-387e11593e92', '{}'),
	('7097386b-a515-4ad6-b706-060cba23ce0e', 'products', 'product-images/vendor-2/7361d3ad-bf89-4164-beb0-20e22b358e6e.jpeg', '08ea4637-acfa-460c-895a-387e11593e92', '2026-03-10 07:05:17.37432+00', '2026-03-10 07:05:17.37432+00', '2026-03-10 07:05:17.37432+00', '{"eTag": "\"7bcc4e815d471dac67d09569bdbea0df\"", "size": 41941, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-10T07:05:18.000Z", "contentLength": 41941, "httpStatusCode": 200}', '9e023d65-8643-48b2-b6a4-ab8825d84cb8', '08ea4637-acfa-460c-895a-387e11593e92', '{}'),
	('30bcee57-6a39-49c5-a22b-08adb973de7c', 'markets', 'market-images/1/legazpi.jpg', NULL, '2026-03-18 15:45:03.007681+00', '2026-03-18 15:47:15.101929+00', '2026-03-18 15:45:03.007681+00', '{"eTag": "\"8b2c14a2d07af16b499e7693ef67fb66\"", "size": 912889, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-18T15:47:16.000Z", "contentLength": 912889, "httpStatusCode": 200}', '4830cb0d-4e56-4ea9-85b6-5835c998c6c4', NULL, NULL),
	('112dfb99-4c82-42cf-a8c0-e57883e51b70', 'markets', 'market-images/3/daraga.jpg', NULL, '2026-03-18 15:46:39.745474+00', '2026-03-18 15:47:26.77899+00', '2026-03-18 15:46:39.745474+00', '{"eTag": "\"b6189b65864969f0d30415dd62a446cb\"", "size": 145502, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-18T15:47:27.000Z", "contentLength": 145502, "httpStatusCode": 200}', '724f9d82-f731-42e4-8f12-e6a50edd9bbd', NULL, NULL),
	('6fca9bb1-1a82-4076-ae0d-09be1faf70d5', 'markets', 'market-images/2/new_albay.jpg', NULL, '2026-03-18 15:48:53.11783+00', '2026-03-18 15:48:53.11783+00', '2026-03-18 15:48:53.11783+00', '{"eTag": "\"9e202df7fcc3bcb5c45be2ee2a7f8424-1\"", "size": 851334, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-18T15:48:53.000Z", "contentLength": 851334, "httpStatusCode": 200}', '8e24e1c0-f0a0-4aff-b062-2c6f0f1baca8', NULL, NULL),
	('4d55c8ce-a8bc-4801-b154-9face38f22a2', 'products', 'product-images/vendor-3/b44171de-be5e-4301-bc74-dd4d4f6ac27e.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-03-22 05:26:42.16297+00', '2026-03-22 05:26:42.16297+00', '2026-03-22 05:26:42.16297+00', '{"eTag": "\"30972cb64371d3e2dc59fa13428257e5\"", "size": 79045, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-22T05:26:43.000Z", "contentLength": 79045, "httpStatusCode": 200}', '0ddb808b-aca3-40c9-b1bf-b43cc9251a14', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}'),
	('6156723c-811f-4c40-9d94-9ad7e6550e50', 'products', 'product-images/vendor-3/1575ff78-c28e-4c3d-81da-48fe001d25f5.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-03-22 06:01:14.687087+00', '2026-03-22 06:01:14.687087+00', '2026-03-22 06:01:14.687087+00', '{"eTag": "\"30972cb64371d3e2dc59fa13428257e5\"", "size": 79045, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-22T06:01:15.000Z", "contentLength": 79045, "httpStatusCode": 200}', '6d5f50a6-b840-43ff-bd59-ed665f41041b', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}'),
	('ef7754c1-424a-4369-826f-96ae8b93f13d', 'products', 'product-images/vendor-3/7b11e98a-4f5c-4557-9479-2ae9e7d8fec3.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-03-22 06:11:42.362386+00', '2026-03-22 06:11:42.362386+00', '2026-03-22 06:11:42.362386+00', '{"eTag": "\"78d7f166cd72fdac2568e8f419d1098f\"", "size": 131695, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-22T06:11:43.000Z", "contentLength": 131695, "httpStatusCode": 200}', '12968b76-9afd-4cb4-b733-691098b48e72', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}'),
	('873ebdd4-782a-42b4-8d0a-648218f09ae9', 'products', 'product-images/vendor-3/20efd9fa-0e8b-4629-9c08-8c180c613ec3.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-03-24 06:55:39.083688+00', '2026-03-24 06:55:39.083688+00', '2026-03-24 06:55:39.083688+00', '{"eTag": "\"c5e27bce8e28de82de7247951dafacb7\"", "size": 35347, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-24T06:55:40.000Z", "contentLength": 35347, "httpStatusCode": 200}', 'acf2ea78-93bb-46e2-8422-94563e982759', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}'),
	('1334c023-09b2-4d2c-8bda-b35222079e69', 'products', 'product-images/vendor-5/bd6b5774-23fb-4cd2-a68a-8aa325d40f2e.jpeg', '4cd647df-140f-4113-8d50-f7506f72c2f8', '2026-03-26 06:45:53.281971+00', '2026-03-26 06:45:53.281971+00', '2026-03-26 06:45:53.281971+00', '{"eTag": "\"8a5de16cb5ebc320fe0d34117d59d51c\"", "size": 900846, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-26T06:45:54.000Z", "contentLength": 900846, "httpStatusCode": 200}', 'acf9e5ca-3649-4d3e-b4db-c6f8e022e983', '4cd647df-140f-4113-8d50-f7506f72c2f8', '{}'),
	('27dcf41e-2dbc-4142-bebb-9b61b89a505b', 'products', 'product-images/vendor-5/1285fe61-4aa0-4c0b-9cae-d65b078df637.jpeg', '4cd647df-140f-4113-8d50-f7506f72c2f8', '2026-03-26 06:46:20.623198+00', '2026-03-26 06:46:20.623198+00', '2026-03-26 06:46:20.623198+00', '{"eTag": "\"2c007258a8bc43f550030392cbd6b188\"", "size": 49618, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-26T06:46:21.000Z", "contentLength": 49618, "httpStatusCode": 200}', '9cc3db7a-bfb9-436c-981c-dfbbebf4ea6e', '4cd647df-140f-4113-8d50-f7506f72c2f8', '{}'),
	('ca7f0e3a-5ece-4a96-b1bd-c03d25a57660', 'categories', 'category-images/Fruits.png', NULL, '2026-04-06 08:14:49.087796+00', '2026-04-06 08:14:49.087796+00', '2026-04-06 08:14:49.087796+00', '{"eTag": "\"87d9764ad0921a583df3eafc5e4e665f-1\"", "size": 184881, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-06T08:14:48.000Z", "contentLength": 184881, "httpStatusCode": 200}', '6cbdc8ac-eeb7-4110-85cb-d8a55281fdda', NULL, NULL),
	('9e400c36-d0e2-49bd-8d34-4843aeb2c9bb', 'products', 'product-images/vendor-3/cd525aed-31e7-438a-ad2a-5e0a59c690de.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-04-09 06:56:28.339996+00', '2026-04-09 06:56:28.339996+00', '2026-04-09 06:56:28.339996+00', '{"eTag": "\"2258824bc581e6ab752ea8419474e89f\"", "size": 118003, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-09T06:56:29.000Z", "contentLength": 118003, "httpStatusCode": 200}', 'dae53136-4861-4399-892f-895683062f6f', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}'),
	('25700444-22c6-4f02-a578-2f917f6fd435', 'categories', 'category-images/Poultry.png', NULL, '2026-04-06 08:14:49.28559+00', '2026-04-06 08:14:49.28559+00', '2026-04-06 08:14:49.28559+00', '{"eTag": "\"7895e8237617db1ad092e72f7c58389c-1\"", "size": 197438, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-06T08:14:48.000Z", "contentLength": 197438, "httpStatusCode": 200}', '1dcea499-069f-4b18-8656-f836f9078422', NULL, NULL),
	('fe998777-a977-4fbf-bb58-f8660d6acd16', 'categories', 'category-images/Vegetables.png', NULL, '2026-04-06 08:14:49.315329+00', '2026-04-06 08:14:49.315329+00', '2026-04-06 08:14:49.315329+00', '{"eTag": "\"56b9678d4bb90d6a021f1104be23cbd7-1\"", "size": 227330, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-06T08:14:47.000Z", "contentLength": 227330, "httpStatusCode": 200}', '5920dbeb-07de-4368-b6ad-3e9de5661c11', NULL, NULL),
	('a64bc0de-5a32-4bf6-b890-0cbd15b87c5f', 'users', 'profile-images/4cd647df-140f-4113-8d50-f7506f72c2f8/1775801538946.jpeg', '4cd647df-140f-4113-8d50-f7506f72c2f8', '2026-04-10 06:12:21.071603+00', '2026-04-10 06:12:21.071603+00', '2026-04-10 06:12:21.071603+00', '{"eTag": "\"f759d690ac306572dbac8bcfffb24912\"", "size": 94164, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-10T06:12:22.000Z", "contentLength": 94164, "httpStatusCode": 200}', '7559932f-07d9-4174-93dd-3ff0ecacf983', '4cd647df-140f-4113-8d50-f7506f72c2f8', '{}'),
	('116fc067-75fa-49aa-afd2-ebb5af087e90', 'categories', 'category-images/Meat.png', NULL, '2026-04-06 08:14:49.447914+00', '2026-04-06 08:14:49.447914+00', '2026-04-06 08:14:49.447914+00', '{"eTag": "\"2b5f6d49b05a7b1ffa9efa9414208a94-1\"", "size": 251107, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-06T08:14:49.000Z", "contentLength": 251107, "httpStatusCode": 200}', '2858348c-2b3f-4048-93b7-df1138128a79', NULL, NULL),
	('0db94a40-58c1-4b7b-99c4-bc2fed4a9dd8', 'users', 'profile-images/0d1a226e-72a8-41e1-b5e5-2b05eb9b03af/1775801492679.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-04-10 06:11:34.408237+00', '2026-04-10 06:11:34.408237+00', '2026-04-10 06:11:34.408237+00', '{"eTag": "\"940f169f2ab4e2cf4ad76878a3b0080f\"", "size": 48179, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-10T06:11:35.000Z", "contentLength": 48179, "httpStatusCode": 200}', 'ec00301d-9afb-4f5d-8c24-28a45cf81cd4', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}'),
	('bebd8d70-af1f-4f1c-bf9c-e2705400712a', 'categories', 'category-images/Seafood.png', NULL, '2026-04-06 08:14:49.466141+00', '2026-04-06 08:14:49.466141+00', '2026-04-06 08:14:49.466141+00', '{"eTag": "\"8d391ee872cd3cb396ecb0eaad4ae22e-1\"", "size": 254139, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-06T08:14:49.000Z", "contentLength": 254139, "httpStatusCode": 200}', '969f60c6-cea6-4066-b426-114e4b56c0dd', NULL, NULL),
	('d5c66eb9-6eb6-4ee7-ac2b-f7c982d06882', 'products', 'product-images/vendor-3/69b757d2-4d79-4431-89f4-36696ce427d3.jpeg', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '2026-04-09 08:14:28.210961+00', '2026-04-09 08:14:28.210961+00', '2026-04-09 08:14:28.210961+00', '{"eTag": "\"58e7625bedd4c1a4ce9c4aae3ad987ec\"", "size": 104553, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-09T08:14:29.000Z", "contentLength": 104553, "httpStatusCode": 200}', '9bb5f73a-228d-4c21-b77e-7d21e273d7a0', '0d1a226e-72a8-41e1-b5e5-2b05eb9b03af', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 475, true);


--
-- Name: address_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."address_types_id_seq"', 6, true);


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."addresses_id_seq"', 9, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."cart_items_id_seq"', 53, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."carts_id_seq"', 4, true);


--
-- Name: markets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."markets_id_seq"', 3, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."order_items_id_seq"', 32, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."orders_id_seq"', 25, true);


--
-- Name: phone_otps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."phone_otps_id_seq"', 64, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 18, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 3, true);


--
-- Name: vendor_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."vendor_applications_id_seq"', 17, true);


--
-- Name: vendor_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."vendor_orders_id_seq"', 24, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."vendors_id_seq"', 5, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict sbYJbrlSKiSjRwycqHCuwc1w98LiMYfEadIF4wFbcqA3rHJ7LaROrefcmDWuzbm

RESET ALL;
