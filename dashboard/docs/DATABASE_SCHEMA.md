# Chababia Database Schema

Source: PocketBase collection metadata and SQLite DDL generated from a fresh database with all project migrations applied.

- PocketBase: 0.39.0
- SQLite database used for generation: fresh temporary DB with all migrations applied
- Migration source: `pb_migrations/`
- Collections: 20 total (15 application, 5 PocketBase system)
- SQLite schema objects: 66

Note: this documents the fully migrated project schema. If an existing runtime `pb_data/data.db` was created before the latest migrations, run `./pocketbase migrate up` before comparing it to this file.

Rule notation: `null` means PocketBase superuser-only. `""` means public/no rule expression.

## Applied Migrations

| Migration | Applied At |
|---|---|
| `1640988000_aux_init.go` | `1780438016190715` |
| `1640988000_init.go` | `1780438016202287` |
| `1717233556_v0.23_migrate.go` | `1780438016202376` |
| `1717233557_v0.23_migrate2.go` | `1780438016202554` |
| `1717233558_v0.23_migrate3.go` | `1780438016204807` |
| `1717233559_v0.23_migrate4.go` | `1780438016204922` |
| `1748700001_init_core_collections.js` | `1780438016233267` |
| `1748700002_content_collections.js` | `1780438016244367` |
| `1748700003_engagement_collections.js` | `1780438016259661` |
| `1748700004_translation_collections.js` | `1780438016273691` |
| `1748700009_seed_demo.js` | `1780438016304711` |
| `1748700010_fix_recommendation_requests.js` | `1780438016309310` |
| `1748700011_add_timestamps.js` | `1780438016433664` |
| `1748700012_audit_and_verification.js` | `1780438016575875` |
| `1748700013_content_reports.js` | `1780438016578633` |
| `1763020353_update_default_auth_alert_templates.go` | `1780438016205178` |
| `1778828400_normalize_indexes.go` | `1780438016208831` |

## Application Collections

### activities

| Property | Value |
|---|---|
| id | `pbc_1262591861` |
| type | `base` |
| system | `false` |
| listRule | `status = 'published'` |
| viewRule | `status = 'published'` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `title` | `text` | `text724990059` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `short_description` | `text` | `text2615518641` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `full_description` | `text` | `text3378348551` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `commune` | `text` | `text3806515694` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `wilaya` | `text` | `text3479892795` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `category` | `relation` | `relation105650625` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_3292755704","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 8 | `establishment` | `relation` | `relation3689918958` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_2072812114","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 9 | `activity_mode` | `select` | `select2483985465` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["physical","online","hybrid"]}` |
| 10 | `online_link` | `url` | `url1013815639` | `false` | `false` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 11 | `start_datetime` | `date` | `date2363064568` | `true` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 12 | `end_datetime` | `date` | `date1253069639` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 13 | `registration_deadline` | `date` | `date2293367674` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 14 | `capacity` | `number` | `number3051925876` | `false` | `false` | `false` | `{"help":"","max":null,"min":null,"onlyInt":false,"presentable":false}` |
| 15 | `requires_registration` | `bool` | `bool2442715427` | `false` | `false` | `false` | `{"help":"","presentable":false}` |
| 16 | `is_free` | `bool` | `bool3638423529` | `false` | `false` | `false` | `{"help":"","presentable":false}` |
| 17 | `age_min` | `number` | `number970622150` | `false` | `false` | `false` | `{"help":"","max":null,"min":null,"onlyInt":false,"presentable":false}` |
| 18 | `age_max` | `number` | `number98024351` | `false` | `false` | `false` | `{"help":"","max":null,"min":null,"onlyInt":false,"presentable":false}` |
| 19 | `language` | `select` | `select3571151285` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm","mixed"]}` |
| 20 | `accessibility_notes` | `text` | `text3219457237` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 21 | `required_documents` | `text` | `text3426758988` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 22 | `bandwidth_level` | `select` | `select969915637` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["low","medium","high"]}` |
| 23 | `replay_available` | `bool` | `bool2263078744` | `false` | `false` | `false` | `{"help":"","presentable":false}` |
| 24 | `image` | `file` | `file3309110367` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"maxSize":307200,"mimeTypes":["image/jpeg","image/png","image/webp"],"presentable":false,"protected":false,"thumbs":["400x0","100x100"]}` |
| 25 | `contact_phone` | `text` | `text1768261586` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 26 | `contact_email` | `email` | `email3401084027` | `false` | `false` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 27 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["draft","published","cancelled","archived"]}` |
| 28 | `last_verified_at` | `date` | `date1971122381` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 29 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 30 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 31 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 32 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE INDEX idx_activities_status         ON activities(status)`
- `CREATE INDEX idx_activities_start_datetime ON activities(start_datetime)`
- `CREATE INDEX idx_activities_commune        ON activities(commune)`
- `CREATE INDEX idx_activities_wilaya         ON activities(wilaya)`
- `CREATE INDEX idx_activities_category       ON activities(category)`
- `CREATE INDEX idx_activities_establishment  ON activities(establishment)`

### activity_translations

| Property | Value |
|---|---|
| id | `pbc_3698240847` |
| type | `base` |
| system | `false` |
| listRule | `""` |
| viewRule | `""` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `activity` | `relation` | `relation2893285722` | `true` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_1262591861","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `language` | `select` | `select3571151285` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm"]}` |
| 4 | `title` | `text` | `text724990059` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `short_description` | `text` | `text2615518641` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `full_description` | `text` | `text3378348551` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 8 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 9 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 10 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE UNIQUE INDEX idx_activity_translations_activity_lang ON activity_translations(activity, language)`

### announcements

| Property | Value |
|---|---|
| id | `pbc_3866499052` |
| type | `base` |
| system | `false` |
| listRule | `status = 'published'` |
| viewRule | `status = 'published'` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `title` | `text` | `text724990059` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `content` | `text` | `text4274335913` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `priority` | `select` | `select1655102503` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["normal","high","urgent"]}` |
| 5 | `related_establishment` | `relation` | `relation868055921` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_2072812114","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 6 | `related_activity` | `relation` | `relation183977975` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_1262591861","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 7 | `language` | `select` | `select3571151285` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm","all"]}` |
| 8 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["draft","published","archived"]}` |
| 9 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 10 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 11 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 12 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 13 | `last_verified_at` | `date` | `date1971122381` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |

Indexes:

- `CREATE INDEX idx_announcements_status   ON announcements(status)`
- `CREATE INDEX idx_announcements_language ON announcements(language)`

### categories

| Property | Value |
|---|---|
| id | `pbc_3292755704` |
| type | `base` |
| system | `false` |
| listRule | `""` |
| viewRule | `""` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `name` | `text` | `text1579384326` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `icon` | `text` | `text1704208859` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `status` | `select` | `select2063623452` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["active","inactive"]}` |
| 5 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 6 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 7 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 8 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- none

### category_translations

| Property | Value |
|---|---|
| id | `pbc_251743388` |
| type | `base` |
| system | `false` |
| listRule | `""` |
| viewRule | `""` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `category` | `relation` | `relation105650625` | `true` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_3292755704","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `language` | `select` | `select3571151285` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm"]}` |
| 4 | `name` | `text` | `text1579384326` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 6 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 7 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 8 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE UNIQUE INDEX idx_category_translations_category_lang ON category_translations(category, language)`

### content_reports

| Property | Value |
|---|---|
| id | `pbc_1079743332` |
| type | `base` |
| system | `false` |
| listRule | `null` |
| viewRule | `null` |
| createRule | `@request.auth.id != ''` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `reporter` | `relation` | `relation1993793778` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"_pb_users_auth_","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `target_type` | `select` | `select1103511960` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["activity","establishment","announcement","newsletter","document"]}` |
| 4 | `target_id` | `text` | `text361630566` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `reason` | `select` | `select1001949196` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["outdated_info","wrong_contact","cancelled","wrong_location","other"]}` |
| 6 | `details` | `text` | `text1915095946` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["new","reviewed","resolved","dismissed"]}` |
| 8 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 9 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 10 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 11 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE INDEX idx_content_reports_status ON content_reports(status)`
- `CREATE INDEX idx_content_reports_target ON content_reports(target_type, target_id)`

### documents

| Property | Value |
|---|---|
| id | `pbc_3332084752` |
| type | `base` |
| system | `false` |
| listRule | `status = 'published'` |
| viewRule | `status = 'published'` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `title` | `text` | `text724990059` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `description` | `text` | `text1843675174` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `file` | `file` | `file2359244304` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"maxSize":10485760,"mimeTypes":["application/pdf"],"presentable":false,"protected":false,"thumbs":null}` |
| 5 | `language` | `select` | `select3571151285` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm","all"]}` |
| 6 | `category` | `select` | `select105650625` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["orientation","health","legal","training","volunteering","science","arts","general"]}` |
| 7 | `establishment` | `relation` | `relation3689918958` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_2072812114","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 8 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["draft","published","archived"]}` |
| 9 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 10 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 11 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 12 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 13 | `last_verified_at` | `date` | `date1971122381` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |

Indexes:

- `CREATE INDEX idx_documents_status   ON documents(status)`
- `CREATE INDEX idx_documents_language ON documents(language)`
- `CREATE INDEX idx_documents_category ON documents(category)`

### establishment_translations

| Property | Value |
|---|---|
| id | `pbc_2319774029` |
| type | `base` |
| system | `false` |
| listRule | `""` |
| viewRule | `""` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `establishment` | `relation` | `relation3689918958` | `true` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_2072812114","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `language` | `select` | `select3571151285` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm"]}` |
| 4 | `description` | `text` | `text1843675174` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `services_text` | `text` | `text3216179062` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `accessibility_text` | `text` | `text3459903157` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 8 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 9 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 10 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE UNIQUE INDEX idx_establishment_translations_establishment_lang ON establishment_translations(establishment, language)`

### establishments

| Property | Value |
|---|---|
| id | `pbc_2072812114` |
| type | `base` |
| system | `false` |
| listRule | `status = 'published'` |
| viewRule | `status = 'published'` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `name` | `text` | `text1579384326` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `type` | `select` | `select2363381545` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["youth_house","youth_hostel","sports_complex","youth_camp","polyvalent_hall","scientific_leisure_center"]}` |
| 4 | `commune` | `text` | `text3806515694` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `wilaya` | `text` | `text3479892795` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `address` | `text` | `text223244161` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `latitude` | `number` | `number1092145443` | `false` | `false` | `false` | `{"help":"","max":null,"min":null,"onlyInt":false,"presentable":false}` |
| 8 | `longitude` | `number` | `number2246143851` | `false` | `false` | `false` | `{"help":"","max":null,"min":null,"onlyInt":false,"presentable":false}` |
| 9 | `phone` | `text` | `text1146066909` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 10 | `email` | `email` | `email3885137012` | `false` | `false` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 11 | `opening_hours` | `text` | `text641777931` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 12 | `services` | `text` | `text1932714345` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 13 | `accessibility_notes` | `text` | `text3219457237` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 14 | `image` | `file` | `file3309110367` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"maxSize":307200,"mimeTypes":["image/jpeg","image/png","image/webp"],"presentable":false,"protected":false,"thumbs":["400x0","100x100"]}` |
| 15 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["draft","published","archived"]}` |
| 16 | `last_verified_at` | `date` | `date1971122381` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 17 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 18 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 19 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 20 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE INDEX idx_establishments_status  ON establishments(status)`
- `CREATE INDEX idx_establishments_commune ON establishments(commune)`
- `CREATE INDEX idx_establishments_type    ON establishments(type)`

### newsletters

| Property | Value |
|---|---|
| id | `pbc_2118001528` |
| type | `base` |
| system | `false` |
| listRule | `status = 'published'` |
| viewRule | `status = 'published'` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `title` | `text` | `text724990059` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `content` | `text` | `text4274335913` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `language` | `select` | `select3571151285` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm","all"]}` |
| 5 | `target_commune` | `text` | `text696936581` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `target_wilaya` | `text` | `text3328185483` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `related_activity` | `relation` | `relation183977975` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_1262591861","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 8 | `related_establishment` | `relation` | `relation868055921` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_2072812114","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 9 | `thumbnail` | `file` | `file3277268710` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"maxSize":307200,"mimeTypes":["image/jpeg","image/png","image/webp"],"presentable":false,"protected":false,"thumbs":["400x0"]}` |
| 10 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["draft","published","archived"]}` |
| 11 | `published_at` | `date` | `date3772055009` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 12 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 13 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 14 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 15 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 16 | `last_verified_at` | `date` | `date1971122381` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |

Indexes:

- `CREATE INDEX idx_newsletters_status          ON newsletters(status)`
- `CREATE INDEX idx_newsletters_language        ON newsletters(language)`
- `CREATE INDEX idx_newsletters_target_commune  ON newsletters(target_commune)`

### project_submissions

| Property | Value |
|---|---|
| id | `pbc_3072047238` |
| type | `base` |
| system | `false` |
| listRule | `user = @request.auth.id` |
| viewRule | `user = @request.auth.id` |
| createRule | `@request.auth.id != ''` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `user` | `relation` | `relation2375276105` | `true` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"_pb_users_auth_","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `establishment` | `relation` | `relation3689918958` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_2072812114","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 4 | `project_title` | `text` | `text946041333` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `category` | `select` | `select105650625` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["Sports","Culture","Training","Volunteering","Health Awareness","Science","Arts","Environment","Youth Orientation","Camps and Trips","Coding","Design","Robotics","Photography","Debate"]}` |
| 6 | `commune` | `text` | `text3806515694` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `short_description` | `text` | `text2615518641` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 8 | `needed_support` | `text` | `text1928527532` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 9 | `contact_phone` | `text` | `text1768261586` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 10 | `optional_document` | `file` | `file2944675610` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"maxSize":5242880,"mimeTypes":["application/pdf"],"presentable":false,"protected":false,"thumbs":null}` |
| 11 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["submitted","reviewed","accepted","rejected","needs_more_info"]}` |
| 12 | `assigned_mentor` | `text` | `text402901584` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 13 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 14 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 15 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 16 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE INDEX idx_project_submissions_user   ON project_submissions(user)`
- `CREATE INDEX idx_project_submissions_status ON project_submissions(status)`

### recommendation_requests

| Property | Value |
|---|---|
| id | `pbc_4126289403` |
| type | `base` |
| system | `false` |
| listRule | `null` |
| viewRule | `null` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `commune` | `text` | `text3806515694` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `wilaya` | `text` | `text3479892795` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `establishment_type` | `select` | `select597949498` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["youth_house","youth_hostel","sports_complex","youth_camp","polyvalent_hall","scientific_leisure_center"]}` |
| 5 | `input_summary` | `text` | `text3678338979` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `model_provider` | `text` | `text1478369919` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 7 | `model_api_used` | `text` | `text2456437768` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 8 | `suggestions_json` | `text` | `text3271144450` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 9 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["pending","completed","failed","cached"]}` |
| 10 | `admin_user` | `relation` | `relation2911524009` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"_pb_users_auth_","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 11 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 12 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 13 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 14 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE INDEX idx_recommendation_requests_admin_user ON recommendation_requests(admin_user)`
- `CREATE INDEX idx_recommendation_requests_status     ON recommendation_requests(status)`

### registrations

| Property | Value |
|---|---|
| id | `pbc_3135925398` |
| type | `base` |
| system | `false` |
| listRule | `user = @request.auth.id` |
| viewRule | `user = @request.auth.id` |
| createRule | `@request.auth.id != ''` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `user` | `relation` | `relation2375276105` | `true` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"_pb_users_auth_","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `activity` | `relation` | `relation2893285722` | `true` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"pbc_1262591861","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 4 | `full_name` | `text` | `text3687080900` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `phone` | `text` | `text1146066909` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `email` | `email` | `email3885137012` | `false` | `false` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 7 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["registered","waiting_list","cancelled","attended"]}` |
| 8 | `qr_code` | `text` | `text2106269621` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 9 | `checked_in_at` | `date` | `date1323900893` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 10 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 11 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 12 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 13 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |

Indexes:

- `CREATE INDEX idx_registrations_user     ON registrations(user)`
- `CREATE INDEX idx_registrations_activity ON registrations(activity)`
- `CREATE INDEX idx_registrations_status   ON registrations(status)`

### talent_showcase

| Property | Value |
|---|---|
| id | `pbc_564396698` |
| type | `base` |
| system | `false` |
| listRule | `status = 'published'` |
| viewRule | `status = 'published'` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `user` | `relation` | `relation2375276105` | `false` | `false` | `false` | `{"cascadeDelete":false,"collectionId":"_pb_users_auth_","help":"","maxSelect":1,"minSelect":0,"presentable":false}` |
| 3 | `title` | `text` | `text724990059` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `description` | `text` | `text1843675174` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `category` | `select` | `select105650625` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["Sports","Culture","Training","Volunteering","Health Awareness","Science","Arts","Environment","Youth Orientation","Camps and Trips","Coding","Design","Robotics","Photography","Debate"]}` |
| 6 | `media` | `file` | `file1781309708` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"maxSize":307200,"mimeTypes":["image/jpeg","image/png","image/webp"],"presentable":false,"protected":false,"thumbs":["400x0","100x100"]}` |
| 7 | `external_link` | `url` | `url2746481117` | `false` | `false` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 8 | `status` | `select` | `select2063623452` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["draft","published","archived"]}` |
| 9 | `published_at` | `date` | `date3772055009` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |
| 10 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 11 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 12 | `created_by` | `text` | `text3725765462` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 13 | `updated_by` | `text` | `text385774305` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 14 | `last_verified_at` | `date` | `date1971122381` | `false` | `false` | `false` | `{"help":"","max":"","min":"","presentable":false}` |

Indexes:

- `CREATE INDEX idx_talent_showcase_status   ON talent_showcase(status)`
- `CREATE INDEX idx_talent_showcase_category ON talent_showcase(category)`

### users

| Property | Value |
|---|---|
| id | `_pb_users_auth_` |
| type | `auth` |
| system | `false` |
| listRule | `null` |
| viewRule | `id = @request.auth.id` |
| createRule | `""` |
| updateRule | `id = @request.auth.id` |
| deleteRule | `null` |
| options | `{"authRule":"","manageRule":null,"authAlert":{"enabled":true,"emailTemplate":{"subject":"Login from a new location","body":"<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location:</p>\n<p><em>{ALERT_INFO}</em></p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>If this was you, you may disregard this email.</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"}},"oauth2":{"providers":null,"mappedFields":{"id":"","name":"","username":"","avatarURL":""},"enabled":false},"passwordAuth":{"enabled":true,"identityFields":["email"]},"mfa":{"enabled":false,"duration":600,"rule":""},"otp":{"enabled":false,"duration":180,"length":8,"emailTemplate":{"subject":"OTP for {APP_NAME}","body":"<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"}},"authToken":{"secret":"6LozyuVkRXQQRU7ROfsH0keRclkZiH85stTqU6WG1HWe8fLjvU","duration":432000},"passwordResetToken":{"secret":"ab7ITcmR2IzCf8w7KLWTdDaXRkqjoCdXhNTEBSFMUAornLrpWE","duration":1800},"emailChangeToken":{"secret":"9FXvhGwf9EucCHkI4MxftfcOKdvzev87FZaSI0pmZLyTqUOoUF","duration":1800},"verificationToken":{"secret":"rKGYoG3IOwbEg1q0tHXh2aEjL5L8TmUxPwwqFKPkuMbjrXgMOV","duration":86400},"fileToken":{"secret":"ltPveLmod46E0sEpe4q9fDanGe5LJlgu35v9PakwgOjgyCqEhm","duration":180},"verificationTemplate":{"subject":"Verify your {APP_NAME} email","body":"<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p><i>If you didn't recently register, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"},"resetPasswordTemplate":{"subject":"Reset your {APP_NAME} password","body":"<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"},"confirmEmailChangeTemplate":{"subject":"Confirm your {APP_NAME} new email address","body":"<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"}}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `password` | `password` | `password901924565` | `true` | `true` | `true` | `{"cost":0,"help":"","max":0,"min":8,"pattern":"","presentable":false}` |
| 3 | `tokenKey` | `text` | `text2504183744` | `true` | `true` | `true` | `{"autogeneratePattern":"[a-zA-Z0-9]{50}","help":"","max":60,"min":30,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `email` | `email` | `email3885137012` | `true` | `true` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 5 | `emailVisibility` | `bool` | `bool1547992806` | `false` | `true` | `false` | `{"help":"","presentable":false}` |
| 6 | `verified` | `bool` | `bool256245529` | `false` | `true` | `false` | `{"help":"","presentable":false}` |
| 7 | `created` | `autodate` | `autodate2990389176` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 8 | `updated` | `autodate` | `autodate3332085495` | `false` | `false` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |
| 9 | `full_name` | `text` | `text3687080900` | `true` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 10 | `phone` | `text` | `text1146066909` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 11 | `role` | `select` | `select1466534506` | `true` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["youth","super_admin","wilaya_admin","establishment_manager","content_editor","attendance_staff"]}` |
| 12 | `preferred_language` | `select` | `select3256700378` | `false` | `false` | `false` | `{"help":"","maxSelect":1,"presentable":false,"values":["ar","fr","tzm"]}` |
| 13 | `commune` | `text` | `text3806515694` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 14 | `wilaya` | `text` | `text3479892795` | `false` | `false` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 15 | `interests` | `select` | `select3367241194` | `false` | `false` | `false` | `{"help":"","maxSelect":15,"presentable":false,"values":["Sports","Culture","Training","Volunteering","Health Awareness","Science","Arts","Environment","Youth Orientation","Camps and Trips","Coding","Design","Robotics","Photography","Debate"]}` |

Indexes:

- `CREATE UNIQUE INDEX \`idx_tokenKey__pb_users_auth_\` ON \`users\` (\`tokenKey\`)`
- `CREATE UNIQUE INDEX \`idx_email__pb_users_auth_\` ON \`users\` (\`email\`) WHERE \`email\` != ''`
- `CREATE INDEX idx_users_role    ON users(role)`
- `CREATE INDEX idx_users_commune ON users(commune)`

## PocketBase System Collections

### _authOrigins

| Property | Value |
|---|---|
| id | `pbc_4275539003` |
| type | `base` |
| system | `true` |
| listRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| viewRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `collectionRef` | `text` | `text455797646` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `recordRef` | `text` | `text127846527` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `fingerprint` | `text` | `text4228609354` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `created` | `autodate` | `autodate2990389176` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 6 | `updated` | `autodate` | `autodate3332085495` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |

Indexes:

- `CREATE UNIQUE INDEX \`idx_authOrigins_unique_pairs\` ON \`_authOrigins\` (collectionRef, recordRef, fingerprint)`

### _externalAuths

| Property | Value |
|---|---|
| id | `pbc_2281828961` |
| type | `base` |
| system | `true` |
| listRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| viewRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `collectionRef` | `text` | `text455797646` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `recordRef` | `text` | `text127846527` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `provider` | `text` | `text2462348188` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `providerId` | `text` | `text1044722854` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `created` | `autodate` | `autodate2990389176` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 7 | `updated` | `autodate` | `autodate3332085495` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |

Indexes:

- `CREATE UNIQUE INDEX \`idx_externalAuths_record_provider\` ON \`_externalAuths\` (collectionRef, recordRef, provider)`
- `CREATE UNIQUE INDEX \`idx_externalAuths_collection_provider\` ON \`_externalAuths\` (collectionRef, provider, providerId)`

### _mfas

| Property | Value |
|---|---|
| id | `pbc_2279338944` |
| type | `base` |
| system | `true` |
| listRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| viewRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `collectionRef` | `text` | `text455797646` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `recordRef` | `text` | `text127846527` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `method` | `text` | `text1582905952` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 5 | `created` | `autodate` | `autodate2990389176` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 6 | `updated` | `autodate` | `autodate3332085495` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |

Indexes:

- `CREATE INDEX \`idx_mfas_collectionRef_recordRef\` ON \`_mfas\` (collectionRef,recordRef)`

### _otps

| Property | Value |
|---|---|
| id | `pbc_1638494021` |
| type | `base` |
| system | `true` |
| listRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| viewRule | `@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `collectionRef` | `text` | `text455797646` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 3 | `recordRef` | `text` | `text127846527` | `true` | `true` | `false` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `password` | `password` | `password901924565` | `true` | `true` | `true` | `{"cost":8,"help":"","max":0,"min":0,"pattern":"","presentable":false}` |
| 5 | `sentTo` | `text` | `text3866985172` | `false` | `true` | `true` | `{"autogeneratePattern":"","help":"","max":0,"min":0,"pattern":"","presentable":false,"primaryKey":false}` |
| 6 | `created` | `autodate` | `autodate2990389176` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 7 | `updated` | `autodate` | `autodate3332085495` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |

Indexes:

- `CREATE INDEX \`idx_otps_collectionRef_recordRef\` ON \`_otps\` (collectionRef, recordRef)`

### _superusers

| Property | Value |
|---|---|
| id | `pbc_3142635823` |
| type | `auth` |
| system | `true` |
| listRule | `null` |
| viewRule | `null` |
| createRule | `null` |
| updateRule | `null` |
| deleteRule | `null` |
| options | `{"authRule":"","manageRule":null,"authAlert":{"enabled":true,"emailTemplate":{"subject":"Login from a new location","body":"<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location:</p>\n<p><em>{ALERT_INFO}</em></p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>If this was you, you may disregard this email.</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"}},"oauth2":{"providers":null,"mappedFields":{"id":"","name":"","username":"","avatarURL":""},"enabled":false},"passwordAuth":{"enabled":true,"identityFields":["email"]},"mfa":{"enabled":false,"duration":600,"rule":""},"otp":{"enabled":false,"duration":180,"length":8,"emailTemplate":{"subject":"OTP for {APP_NAME}","body":"<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"}},"authToken":{"secret":"zHkj3VtHlbmCFhY57mu3Y1Yu0FsHzk8g7x13mXwoBZLqV16lja","duration":86400},"passwordResetToken":{"secret":"yHvVetV12nBpR4szrLyZuoB1C8HalUBabpJc3fpKOtfhyoO8Cr","duration":1800},"emailChangeToken":{"secret":"FJZbFT8yPsAgbmwUS1w1hI5txpzF0vaixbVix7dLvw9FNjrJZ6","duration":1800},"verificationToken":{"secret":"eGcQN7twqGRk8utYilhXg4xfQkwfRInlY7DkWUd1DypZOgYrF9","duration":86400},"fileToken":{"secret":"u7hOpw00GHcvg7aWHWxxb6bPCjKmBMkR11qG8h48ouSla8ABOa","duration":180},"verificationTemplate":{"subject":"Verify your {APP_NAME} email","body":"<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p><i>If you didn't recently register, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"},"resetPasswordTemplate":{"subject":"Reset your {APP_NAME} password","body":"<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"},"confirmEmailChangeTemplate":{"subject":"Confirm your {APP_NAME} new email address","body":"<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"}}` |

Fields:

| # | name | type | id | required | system | hidden | config |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `text` | `text3208210256` | `true` | `true` | `false` | `{"autogeneratePattern":"[a-z0-9]{15}","help":"","max":15,"min":15,"pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true}` |
| 2 | `password` | `password` | `password901924565` | `true` | `true` | `true` | `{"cost":0,"help":"","max":0,"min":8,"pattern":"","presentable":false}` |
| 3 | `tokenKey` | `text` | `text2504183744` | `true` | `true` | `true` | `{"autogeneratePattern":"[a-zA-Z0-9]{50}","help":"","max":60,"min":30,"pattern":"","presentable":false,"primaryKey":false}` |
| 4 | `email` | `email` | `email3885137012` | `true` | `true` | `false` | `{"exceptDomains":null,"help":"","onlyDomains":null,"presentable":false}` |
| 5 | `emailVisibility` | `bool` | `bool1547992806` | `false` | `true` | `false` | `{"help":"","presentable":false}` |
| 6 | `verified` | `bool` | `bool256245529` | `false` | `true` | `false` | `{"help":"","presentable":false}` |
| 7 | `created` | `autodate` | `autodate2990389176` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":false,"presentable":false}` |
| 8 | `updated` | `autodate` | `autodate3332085495` | `false` | `true` | `false` | `{"onCreate":true,"onUpdate":true,"presentable":false}` |

Indexes:

- `CREATE UNIQUE INDEX \`idx_tokenKey_pbc_3142635823\` ON \`_superusers\` (\`tokenKey\`)`
- `CREATE UNIQUE INDEX \`idx_email_pbc_3142635823\` ON \`_superusers\` (\`email\`) WHERE \`email\` != ''`

## Raw SQLite DDL

This section is the exact SQLite schema generated by PocketBase for the migrated database.

### table: _authOrigins

```sql
CREATE TABLE `_authOrigins` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `fingerprint` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
```

### table: _collections

```sql
CREATE TABLE `_collections` (
				`id`         TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL,
				`system`     BOOLEAN DEFAULT FALSE NOT NULL,
				`type`       TEXT DEFAULT "base" NOT NULL,
				`name`       TEXT UNIQUE NOT NULL,
				`fields`     JSON DEFAULT "[]" NOT NULL,
				`indexes`    JSON DEFAULT "[]" NOT NULL,
				`listRule`   TEXT DEFAULT NULL,
				`viewRule`   TEXT DEFAULT NULL,
				`createRule` TEXT DEFAULT NULL,
				`updateRule` TEXT DEFAULT NULL,
				`deleteRule` TEXT DEFAULT NULL,
				`options`    JSON DEFAULT "{}" NOT NULL,
				`created`    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
				`updated`    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
			);
```

### table: _externalAuths

```sql
CREATE TABLE `_externalAuths` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `provider` TEXT DEFAULT '' NOT NULL, `providerId` TEXT DEFAULT '' NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
```

### table: _mfas

```sql
CREATE TABLE `_mfas` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `method` TEXT DEFAULT '' NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
```

### table: _migrations

```sql
CREATE TABLE `_migrations` (file VARCHAR(255) PRIMARY KEY NOT NULL, applied INTEGER NOT NULL);
```

### table: _otps

```sql
CREATE TABLE `_otps` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `sentTo` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
```

### table: _params

```sql
CREATE TABLE `_params` (
			`id`      TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL,
			`value`   JSON DEFAULT NULL,
			`created` TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			`updated` TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
		);
```

### table: _superusers

```sql
CREATE TABLE `_superusers` (`created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `tokenKey` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL);
```

### table: activities

```sql
CREATE TABLE `activities` (`accessibility_notes` TEXT DEFAULT '' NOT NULL, `activity_mode` TEXT DEFAULT '' NOT NULL, `age_max` NUMERIC DEFAULT 0 NOT NULL, `age_min` NUMERIC DEFAULT 0 NOT NULL, `bandwidth_level` TEXT DEFAULT '' NOT NULL, `capacity` NUMERIC DEFAULT 0 NOT NULL, `category` TEXT DEFAULT '' NOT NULL, `commune` TEXT DEFAULT '' NOT NULL, `contact_email` TEXT DEFAULT '' NOT NULL, `contact_phone` TEXT DEFAULT '' NOT NULL, `end_datetime` TEXT DEFAULT '' NOT NULL, `establishment` TEXT DEFAULT '' NOT NULL, `full_description` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `image` TEXT DEFAULT '' NOT NULL, `is_free` BOOLEAN DEFAULT FALSE NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `last_verified_at` TEXT DEFAULT '' NOT NULL, `online_link` TEXT DEFAULT '' NOT NULL, `registration_deadline` TEXT DEFAULT '' NOT NULL, `replay_available` BOOLEAN DEFAULT FALSE NOT NULL, `required_documents` TEXT DEFAULT '' NOT NULL, `requires_registration` BOOLEAN DEFAULT FALSE NOT NULL, `short_description` TEXT DEFAULT '' NOT NULL, `start_datetime` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, `wilaya` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: activity_translations

```sql
CREATE TABLE `activity_translations` (`activity` TEXT DEFAULT '' NOT NULL, `full_description` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `short_description` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: announcements

```sql
CREATE TABLE `announcements` (`content` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `priority` TEXT DEFAULT '' NOT NULL, `related_activity` TEXT DEFAULT '' NOT NULL, `related_establishment` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL, "last_verified_at" TEXT DEFAULT '' NOT NULL);
```

### table: categories

```sql
CREATE TABLE `categories` (`icon` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: category_translations

```sql
CREATE TABLE `category_translations` (`category` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `name` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: content_reports

```sql
CREATE TABLE `content_reports` (`created` TEXT DEFAULT '' NOT NULL, `created_by` TEXT DEFAULT '' NOT NULL, `details` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `reason` TEXT DEFAULT '' NOT NULL, `reporter` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `target_id` TEXT DEFAULT '' NOT NULL, `target_type` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `updated_by` TEXT DEFAULT '' NOT NULL);
```

### table: documents

```sql
CREATE TABLE `documents` (`category` TEXT DEFAULT '' NOT NULL, `description` TEXT DEFAULT '' NOT NULL, `establishment` TEXT DEFAULT '' NOT NULL, `file` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL, "last_verified_at" TEXT DEFAULT '' NOT NULL);
```

### table: establishment_translations

```sql
CREATE TABLE `establishment_translations` (`accessibility_text` TEXT DEFAULT '' NOT NULL, `description` TEXT DEFAULT '' NOT NULL, `establishment` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `services_text` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: establishments

```sql
CREATE TABLE `establishments` (`accessibility_notes` TEXT DEFAULT '' NOT NULL, `address` TEXT DEFAULT '' NOT NULL, `commune` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `image` TEXT DEFAULT '' NOT NULL, `last_verified_at` TEXT DEFAULT '' NOT NULL, `latitude` NUMERIC DEFAULT 0 NOT NULL, `longitude` NUMERIC DEFAULT 0 NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `opening_hours` TEXT DEFAULT '' NOT NULL, `phone` TEXT DEFAULT '' NOT NULL, `services` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `type` TEXT DEFAULT '' NOT NULL, `wilaya` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: newsletters

```sql
CREATE TABLE `newsletters` (`content` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `language` TEXT DEFAULT '' NOT NULL, `published_at` TEXT DEFAULT '' NOT NULL, `related_activity` TEXT DEFAULT '' NOT NULL, `related_establishment` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `target_commune` TEXT DEFAULT '' NOT NULL, `target_wilaya` TEXT DEFAULT '' NOT NULL, `thumbnail` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL, "last_verified_at" TEXT DEFAULT '' NOT NULL);
```

### table: project_submissions

```sql
CREATE TABLE `project_submissions` (`assigned_mentor` TEXT DEFAULT '' NOT NULL, `category` TEXT DEFAULT '' NOT NULL, `commune` TEXT DEFAULT '' NOT NULL, `contact_phone` TEXT DEFAULT '' NOT NULL, `establishment` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `needed_support` TEXT DEFAULT '' NOT NULL, `optional_document` TEXT DEFAULT '' NOT NULL, `project_title` TEXT DEFAULT '' NOT NULL, `short_description` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `user` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: recommendation_requests

```sql
CREATE TABLE `recommendation_requests` (`admin_user` TEXT DEFAULT '' NOT NULL, `commune` TEXT DEFAULT '' NOT NULL, `establishment_type` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `input_summary` TEXT DEFAULT '' NOT NULL, `model_api_used` TEXT DEFAULT '' NOT NULL, `model_provider` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `suggestions_json` TEXT DEFAULT '' NOT NULL, `wilaya` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: registrations

```sql
CREATE TABLE `registrations` (`activity` TEXT DEFAULT '' NOT NULL, `checked_in_at` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `full_name` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `phone` TEXT DEFAULT '' NOT NULL, `qr_code` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `user` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL);
```

### table: talent_showcase

```sql
CREATE TABLE `talent_showcase` (`category` TEXT DEFAULT '' NOT NULL, `description` TEXT DEFAULT '' NOT NULL, `external_link` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `media` TEXT DEFAULT '' NOT NULL, `published_at` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, `user` TEXT DEFAULT '' NOT NULL, "created" TEXT DEFAULT '' NOT NULL, "updated" TEXT DEFAULT '' NOT NULL, "created_by" TEXT DEFAULT '' NOT NULL, "updated_by" TEXT DEFAULT '' NOT NULL, "last_verified_at" TEXT DEFAULT '' NOT NULL);
```

### table: users

```sql
CREATE TABLE `users` (`created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `tokenKey` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL, "full_name" TEXT DEFAULT '' NOT NULL, "phone" TEXT DEFAULT '' NOT NULL, "role" TEXT DEFAULT '' NOT NULL, "preferred_language" TEXT DEFAULT '' NOT NULL, "commune" TEXT DEFAULT '' NOT NULL, "wilaya" TEXT DEFAULT '' NOT NULL, `interests` JSON DEFAULT '[]' NOT NULL);
```

### index: idx__collections_type

```sql
CREATE INDEX idx__collections_type on `_collections` (`type`);
```

### index: idx_activities_category

```sql
CREATE INDEX `idx_activities_category` ON `activities` (`category`);
```

### index: idx_activities_commune

```sql
CREATE INDEX `idx_activities_commune` ON `activities` (`commune`);
```

### index: idx_activities_establishment

```sql
CREATE INDEX `idx_activities_establishment` ON `activities` (`establishment`);
```

### index: idx_activities_start_datetime

```sql
CREATE INDEX `idx_activities_start_datetime` ON `activities` (`start_datetime`);
```

### index: idx_activities_status

```sql
CREATE INDEX `idx_activities_status` ON `activities` (`status`);
```

### index: idx_activities_wilaya

```sql
CREATE INDEX `idx_activities_wilaya` ON `activities` (`wilaya`);
```

### index: idx_activity_translations_activity_lang

```sql
CREATE UNIQUE INDEX `idx_activity_translations_activity_lang` ON `activity_translations` (
  `activity`,
  `language`
);
```

### index: idx_announcements_language

```sql
CREATE INDEX `idx_announcements_language` ON `announcements` (`language`);
```

### index: idx_announcements_status

```sql
CREATE INDEX `idx_announcements_status` ON `announcements` (`status`);
```

### index: idx_authOrigins_unique_pairs

```sql
CREATE UNIQUE INDEX `idx_authOrigins_unique_pairs` ON `_authOrigins` (
  `collectionRef`,
  `recordRef`,
  `fingerprint`
);
```

### index: idx_category_translations_category_lang

```sql
CREATE UNIQUE INDEX `idx_category_translations_category_lang` ON `category_translations` (
  `category`,
  `language`
);
```

### index: idx_content_reports_status

```sql
CREATE INDEX `idx_content_reports_status` ON `content_reports` (`status`);
```

### index: idx_content_reports_target

```sql
CREATE INDEX `idx_content_reports_target` ON `content_reports` (
  `target_type`,
  `target_id`
);
```

### index: idx_documents_category

```sql
CREATE INDEX `idx_documents_category` ON `documents` (`category`);
```

### index: idx_documents_language

```sql
CREATE INDEX `idx_documents_language` ON `documents` (`language`);
```

### index: idx_documents_status

```sql
CREATE INDEX `idx_documents_status` ON `documents` (`status`);
```

### index: idx_email__pb_users_auth_

```sql
CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != '';
```

### index: idx_email_pbc_3142635823

```sql
CREATE UNIQUE INDEX `idx_email_pbc_3142635823` ON `_superusers` (`email`) WHERE `email` != '';
```

### index: idx_establishment_translations_establishment_lang

```sql
CREATE UNIQUE INDEX `idx_establishment_translations_establishment_lang` ON `establishment_translations` (
  `establishment`,
  `language`
);
```

### index: idx_establishments_commune

```sql
CREATE INDEX `idx_establishments_commune` ON `establishments` (`commune`);
```

### index: idx_establishments_status

```sql
CREATE INDEX `idx_establishments_status` ON `establishments` (`status`);
```

### index: idx_establishments_type

```sql
CREATE INDEX `idx_establishments_type` ON `establishments` (`type`);
```

### index: idx_externalAuths_collection_provider

```sql
CREATE UNIQUE INDEX `idx_externalAuths_collection_provider` ON `_externalAuths` (
  `collectionRef`,
  `provider`,
  `providerId`
);
```

### index: idx_externalAuths_record_provider

```sql
CREATE UNIQUE INDEX `idx_externalAuths_record_provider` ON `_externalAuths` (
  `collectionRef`,
  `recordRef`,
  `provider`
);
```

### index: idx_mfas_collectionRef_recordRef

```sql
CREATE INDEX `idx_mfas_collectionRef_recordRef` ON `_mfas` (
  `collectionRef`,
  `recordRef`
);
```

### index: idx_newsletters_language

```sql
CREATE INDEX `idx_newsletters_language` ON `newsletters` (`language`);
```

### index: idx_newsletters_status

```sql
CREATE INDEX `idx_newsletters_status` ON `newsletters` (`status`);
```

### index: idx_newsletters_target_commune

```sql
CREATE INDEX `idx_newsletters_target_commune` ON `newsletters` (`target_commune`);
```

### index: idx_otps_collectionRef_recordRef

```sql
CREATE INDEX `idx_otps_collectionRef_recordRef` ON `_otps` (
  `collectionRef`,
  `recordRef`
);
```

### index: idx_project_submissions_status

```sql
CREATE INDEX `idx_project_submissions_status` ON `project_submissions` (`status`);
```

### index: idx_project_submissions_user

```sql
CREATE INDEX `idx_project_submissions_user` ON `project_submissions` (`user`);
```

### index: idx_recommendation_requests_admin_user

```sql
CREATE INDEX `idx_recommendation_requests_admin_user` ON `recommendation_requests` (`admin_user`);
```

### index: idx_recommendation_requests_status

```sql
CREATE INDEX `idx_recommendation_requests_status` ON `recommendation_requests` (`status`);
```

### index: idx_registrations_activity

```sql
CREATE INDEX `idx_registrations_activity` ON `registrations` (`activity`);
```

### index: idx_registrations_status

```sql
CREATE INDEX `idx_registrations_status` ON `registrations` (`status`);
```

### index: idx_registrations_user

```sql
CREATE INDEX `idx_registrations_user` ON `registrations` (`user`);
```

### index: idx_talent_showcase_category

```sql
CREATE INDEX `idx_talent_showcase_category` ON `talent_showcase` (`category`);
```

### index: idx_talent_showcase_status

```sql
CREATE INDEX `idx_talent_showcase_status` ON `talent_showcase` (`status`);
```

### index: idx_tokenKey__pb_users_auth_

```sql
CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`);
```

### index: idx_tokenKey_pbc_3142635823

```sql
CREATE UNIQUE INDEX `idx_tokenKey_pbc_3142635823` ON `_superusers` (`tokenKey`);
```

### index: idx_users_commune

```sql
CREATE INDEX `idx_users_commune` ON `users` (`commune`);
```

### index: idx_users_role

```sql
CREATE INDEX `idx_users_role` ON `users` (`role`);
```
