# TRAIN — no login edition

This version launches directly to the dashboard. No account, Supabase or cloud connection is required. Training records and dashboard customisations save on this device. Exercise demonstrations remain included.

## Update GitHub Pages
Upload the contents of this folder to the root of your existing GitHub Pages repository, replacing older files, then refresh TRAIN in Safari. If the Home Screen version still displays the old login, close and reopen it after Safari has loaded the updated website.

## Protect existing workouts
**Before replacing files**, use the old app’s Settings > Download encrypted backup or Export backup. Do not delete the Home Screen app or clear website data. This release uses the original `train_tracker_v1` local storage key, so existing data saved under that key on the same origin should remain accessible. Data saved only under a Supabase user-specific key (`train_cloud_user_...`) is not automatically migrated. If you used the account version to save workouts, export them from that version and import the backup into this one. Keep a copy of the original ZIP until migration is confirmed.

There is no automatic cross-device sync or recovery after device loss. Export encrypted backups regularly.
