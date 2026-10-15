# TRAIN Cloud – setup

This is an installable Safari Home Screen web app, not an App Store app.

1. Create a Supabase project at https://supabase.com/. Under **SQL Editor**, run `supabase-setup.sql`.
2. In **Project Settings → API**, copy the **Project URL** and the **publishable key** (or legacy public `anon` key). **Never** use a `service_role` / secret key.
3. Add those two values to `train-config.js`. The public key is intended for client apps; security comes from Row Level Security and user sign-in.
4. In **Authentication → Providers → Email**, enable email/password and email confirmation. Set **Authentication → URL Configuration → Site URL** to the final published TRAIN URL. Also add that address as a redirect URL. Configure SMTP before a large public launch; default email service has limits.
5. Publish the **contents** of this folder to your GitHub Pages repository (not the ZIP). Pages: branch `main`, directory `/ (root)`.
6. Open the published HTTPS website in **Safari → Share → Add to Home Screen**. Create an account, confirm email, sign in, and check that a workout appears after reopening the app.

## Notes / limitations

- Each account has one private JSON training record, protected by Supabase Row Level Security. User data is sent to Supabase servers and is *not* device-only.
- Editing automatically saves on the device and queues a sync when online. Signed-in users can continue offline with cached credentials and previously loaded data; they must connect to sign up or sign in for the first time.
- This basic version uses a **last-upload-wins** strategy, not a full multi-device conflict merge. Avoid editing the same account simultaneously on two phones. Reopen the app to fetch the latest remote state.
- Backups remain advisable for exceptionally important data or accidental deletion; online sync is not a complete historical backup.
- Existing workouts in the **old local profile app do not transfer automatically**. Export a JSON backup from the old app and import it into the new signed-in app. Ensure sync finishes before signing out.
- Supabase services need a network connection to sync. The free tier has service limits and availability policies.
- Direct Apple HealthKit access is not supported by Safari; manual XML import remains available.
- Security is contingent on correct RLS policies, reputable hosting, and not publishing any secret key.
- Offline device cache is not separately encrypted. Use an iPhone passcode and sign out from devices you no longer use.

## Personal dashboard layout
On Home, tap **Customise dashboard**. Use the arrows to reorder sections or uncheck optional widgets. Your active training block remains visible. Layout preferences are saved in the current account's TRAIN settings and included in Supabase sync once connected. Do not publish personal backups or keys.

## Exercise demonstrations
The Live Workout screen, workout prescriptions and manual strength set entry now offer **▶ Demo**. Each demo runs entirely offline and shows a simplified animated movement pattern with exercise-name-specific coaching cues. These are schematic movement illustrations, **not filmed demonstrations of each named exercise**. They must not be relied upon as clinical or personalised technique advice. The mechanism uses movement families and fallback advice, so check cues for uncommon movements before wider release.
