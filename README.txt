TRAIN — private iPhone Home Screen app (free version)

Install or update:
1. Unzip this archive on your Windows PC. Upload the individual files to the root of your existing GitHub Pages repository. Replace existing files at the SAME URL. DO NOT upload workout/Health/backup data to GitHub.
2. On iPhone Safari, visit that HTTPS GitHub Pages URL. Share > Add to Home Screen. Launch from Home Screen. For updates fully close and reopen app after publishing new files.
3. Open Settings > Automatic saving & offline storage > Check save status and Protect device storage. The latter is best-effort, not a guarantee.

DATA SAFETY:
- Every submitted workout, morning readiness check in, recovery check in, training block change, and saved preference automatically saves locally. LocalStorage is committed immediately and IndexedDB receives a serialized second on-device snapshot. No personal data is uploaded by TRAIN.
- Home Screen app files are cached for offline use after first online load.
- Both storage copies reside on the SAME device and can be deleted together by clearing website data, deleting app/site data, OS storage cleanup, or device loss. The app is NOT a guaranteed replacement for backups. iCloud Backup cannot be assumed to restore PWA site data.
- For disaster recovery use Settings > Password protected backup to create an encrypted .trainbackup file, saved to iCloud Drive or a private location. This must be user-initiated: Safari cannot silently auto-save it into iCloud Drive. If you never want manual backups, you accept possible irrecoverable history loss.
- HealthKit direct access is not possible from this standalone web app. Apple Health export.xml can still be manually imported.
- Upgrade at the same URL to retain existing local data. If switching URLs or switching from Safari to standalone mode, import a previously exported encrypted/JSON backup.

Backup encryption uses a password of 12+ characters and is implemented locally with Web Crypto. The app's everyday browser data is not separately encrypted.
