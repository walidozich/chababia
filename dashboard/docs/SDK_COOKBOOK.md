# Chababia — Frontend SDK Cookbook

Copy-paste recipes for talking to the Chababia backend from the **mobile app** (React Native + Expo)
and any **custom dashboard**. Uses the official [`pocketbase`](https://www.npmjs.com/package/pocketbase) JS SDK.

> The ODEJ admin dashboard is the **built-in PocketBase Admin UI** (`/_/`) per spec §25 — no code
> needed there. These recipes are for the youth mobile app and, optionally, a custom dashboard.

Full route reference: [`openapi.yaml`](./openapi.yaml) (import into Swagger UI / Postman).

---

## 0. Install & init

```bash
npm install pocketbase
# mobile only — for persistent login:
npx expo install @react-native-async-storage/async-storage
```

### Web / custom dashboard
```ts
import PocketBase from 'pocketbase';
export const pb = new PocketBase('https://api.chababia.dz');
```

### React Native + Expo (persists login across restarts)
```ts
import PocketBase, { AsyncAuthStore } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const store = new AsyncAuthStore({
  save:    async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
  initial: AsyncStorage.getItem('pb_auth'),
  clear:   async () => AsyncStorage.removeItem('pb_auth'),
});

export const pb = new PocketBase('https://api.chababia.dz', store);
```

> RN note: PocketBase's realtime needs an EventSource polyfill. We don't use realtime (eco mandate),
> so disable autocancellation only if you hit parallel-request cancels: `pb.autoCancellation(false)`.

---

## 1. Sign up a youth user

```ts
await pb.collection('users').create({
  email: 'youth@example.dz',
  password: 'Secret123!',
  passwordConfirm: 'Secret123!',
  full_name: 'Sara B.',
  role: 'youth',
  preferred_language: 'ar',
  commune: 'Béjaïa',
  wilaya: 'Béjaïa',
  interests: ['Sports', 'Science'],
});
```

## 2. Log in / log out / check session

```ts
await pb.collection('users').authWithPassword('youth@example.dz', 'Secret123!');

pb.authStore.isValid;          // boolean — is there a live token?
pb.authStore.record?.id;        // current user id
pb.authStore.record?.role;      // 'youth' | 'super_admin' | ...

pb.authStore.clear();           // logout
```

The token auto-attaches to every request. With `AsyncAuthStore`, the user stays logged in
after closing the app. Refresh proactively on app launch if needed:

```ts
if (pb.authStore.isValid) {
  try { await pb.collection('users').authRefresh(); }
  catch { pb.authStore.clear(); }   // token expired → force re-login
}
```

## 3. List activities for the swipe-card deck (thin payload — eco)

Only fetch card fields; full detail is loaded later on the details screen (spec §10.3, §14.1).

```ts
const cards = await pb.collection('activities').getList(1, 10, {
  fields: 'id,title,short_description,start_datetime,commune,activity_mode,image,is_free',
  sort: 'start_datetime',
});
// cards.items, cards.page, cards.totalPages
```

## 4. Filter activities (commune / category / free / date)

Always build filters with `pb.filter(...)` — it escapes values and prevents injection.

```ts
const list = await pb.collection('activities').getList(1, 10, {
  filter: pb.filter(
    'commune = {:c} && is_free = {:free} && start_datetime >= {:from}',
    { c: 'Béjaïa', free: true, from: '2026-06-01 00:00:00' }
  ),
  sort: '-start_datetime',
});
```

Filter by category (relation id) or establishment:
```ts
filter: pb.filter('category = {:cat}', { cat: categoryId })
```

> `status = 'published'` is enforced **server-side** — you never need to add it, and drafts are
> invisible to youth/anon regardless of what you send.

## 5. Activity details (with related establishment + category in one call)

```ts
const activity = await pb.collection('activities').getOne(activityId, {
  expand: 'category,establishment',
});
activity.expand?.establishment?.name;   // inlined related record
activity.expand?.category?.name;
```

Accuracy rule (spec §10.4): if a field is empty, show **"Not specified by ODEJ."** — never invent it.

## 6. Localized content (ar / fr / tzm)

Translations live in separate public collections. Fetch the row matching the user's language:

```ts
async function activityInLang(activityId: string, lang: 'ar'|'fr'|'tzm') {
  const tr = await pb.collection('activity_translations').getList(1, 1, {
    filter: pb.filter('activity = {:a} && language = {:l}', { a: activityId, l: lang }),
  });
  return tr.items[0]; // { title, short_description, full_description } — or undefined → fall back to base
}
```

Categories rarely change — fetch all translations once and cache locally:
```ts
const catTr = await pb.collection('category_translations').getFullList({
  filter: pb.filter('language = {:l}', { l: 'ar' }),
});
const nameById = Object.fromEntries(catTr.map(t => [t.category, t.name]));
```

## 7. Register for an activity (capacity + QR handled server-side)

```ts
const reg = await pb.collection('registrations').create({
  activity: activityId,
  full_name: pb.authStore.record?.full_name,
  phone: '0550000000',
});

reg.status;   // 'registered' OR 'waiting_list' (server decides from live capacity)
reg.qr_code;  // 32-char token → render as a QR image client-side
```

> Don't send `user`, `status`, or `qr_code` — the hook overwrites them. The response already
> contains the final values, so there's no second request.

Render the QR with any RN QR lib:
```tsx
import QRCode from 'react-native-qrcode-svg';
<QRCode value={reg.qr_code} size={220} />
```

## 8. My registrations

```ts
const mine = await pb.collection('registrations').getFullList({
  sort: '-created',
  expand: 'activity',
});
// rule restricts results to the authenticated user automatically
```

## 9. Establishment directory + map coordinates

```ts
const houses = await pb.collection('establishments').getList(1, 20, {
  filter: pb.filter('type = {:t}', { t: 'youth_house' }),
  fields: 'id,name,type,commune,latitude,longitude',  // light payload for the list/map
});
```
Load full detail (services, hours, accessibility) only when a card is opened (spec §10.5).
Request GPS only on "near me" — never track continuously (spec §10.6).

## 10. Announcements, newsletters, documents

```ts
const announcements = await pb.collection('announcements').getList(1, 10, { sort: '-created' });

const newsletters = await pb.collection('newsletters').getList(1, 10, {
  filter: pb.filter('language = {:l} && target_commune = {:c}', { l: 'fr', c: 'Béjaïa' }),
});

const docs = await pb.collection('documents').getList(1, 10, {
  filter: pb.filter('category = {:c}', { c: 'orientation' }),
});
```

## 11. Submit a youth project idea

```ts
await pb.collection('project_submissions').create({
  user: pb.authStore.record?.id,   // must be the authenticated user
  project_title: 'Local Robotics Club',
  category: 'Robotics',
  commune: 'Béjaïa',
  short_description: 'A youth-led robotics club for beginners.',
  needed_support: 'Mentor and a room',
  contact_phone: '0550000000',
});
```
With a PDF (≤5 MB) use `FormData`:
```ts
const form = new FormData();
form.append('user', pb.authStore.record!.id);
form.append('project_title', 'Local Robotics Club');
form.append('commune', 'Béjaïa');
form.append('short_description', '...');
form.append('contact_phone', '0550000000');
form.append('optional_document', { uri, name: 'idea.pdf', type: 'application/pdf' } as any);
await pb.collection('project_submissions').create(form);
```

## 12. Talent showcase (read-only for youth)

```ts
const talents = await pb.collection('talent_showcase').getList(1, 10, { sort: '-published_at' });
```

## 13. File & thumbnail URLs (use the small WebP thumb — eco)

```ts
// full image
const url = pb.files.getURL(activity, activity.image);
// 400px-wide WebP thumbnail for cards/lists
const thumb = pb.files.getURL(activity, activity.image, { thumb: '400x0' });
```
In low-bandwidth mode (spec §10.8), skip thumbnails entirely and render text-first cards.

## 14. Admin: request event recommendations (custom endpoint)

Custom route — call it directly (not a collection). Requires an admin token.

```ts
const res = await pb.send('/api/admin/event-recommendations', {
  method: 'POST',
  body: { commune: 'Béjaïa', wilaya: 'Béjaïa', establishment_type: 'youth_house' },
});

res.suggestions;   // draft ideas — show with a "DRAFT" badge
res.cached;        // true if served from a previous identical request (no AI call)
res.mock;          // true if AI was unavailable and fallback drafts were returned
```
These are **planning suggestions only** (spec §12.6, §18). Staff must convert an accepted idea
into a normal activity draft in the Admin UI and verify it before publishing — never auto-publish.

## 15. HTTP caching / 304 (where the eco savings come from)

Public GETs return `Cache-Control` (categories 7d, establishments 24h, activities 30m, etc.)
and a weak `ETag`. The platform HTTP layer and React Query handle revalidation:

- **React Query** — set `staleTime` to match the cache duration so the app doesn't refetch
  while data is still fresh:
  ```ts
  useQuery({
    queryKey: ['categories'],
    queryFn: () => pb.collection('categories').getFullList(),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days — categories rarely change
  });
  ```
- **fetch/RN** — pass the previous `ETag` as `If-None-Match`; a `304` means "reuse your cache".
  Most of this is automatic; the SDK exposes headers on thrown/returned responses if you need them.

Recommended `staleTime` per collection (mirror of the server `Cache-Control`):

| Data | staleTime |
|---|---|
| categories, category_translations, documents | 7 days |
| establishments, *_translations | 24 hours |
| activities | 30 min |
| announcements, newsletters | 10 min |
| talent_showcase | 1 hour |
| my registrations | session only (don't persist) |

---

## Error handling pattern

```ts
import { ClientResponseError } from 'pocketbase';

try {
  await pb.collection('registrations').create({ /* ... */ });
} catch (err) {
  if (err instanceof ClientResponseError) {
    err.status;        // 400 | 403 | 404 | 429 ...
    err.response;      // { message, data: { field: { code, message } } }
    // surface err.response.data field errors to the form
  }
}
```

## Quick reference — collection → who can do what

| Collection | Public read | Auth read | Write |
|---|---|---|---|
| categories, *_translations | ✅ all | — | admin |
| activities, establishments, announcements, newsletters, documents, talent_showcase | ✅ published only | — | admin |
| registrations | ❌ | own only | own create |
| project_submissions | ❌ | own only | own create |
| content_reports | ❌ | ❌ | auth create / superuser review |
| recommendation_requests | ❌ | ❌ | superuser only |
| users | ❌ | own record | self signup / self update |

> "admin" = superuser via the Admin UI (or, later, a custom dashboard authed as an admin-role user).
