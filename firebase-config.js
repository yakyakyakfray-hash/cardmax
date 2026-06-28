/* firebase-config.js — GitHub Pages TEST build (LOCAL MODE).
 *
 * This is intentionally empty so CardMax runs WITHOUT sign-in and saves
 * progress on the device only (localStorage). It lets us test the app on
 * GitHub Pages without setting up Firebase auth domains today.
 *
 * To enable Google sign-in + cloud sync later ("Firebase day"), replace this
 * with the real config (kept safe in your CardMAX project folder) AND add this
 * site's domain under Firebase Console → Authentication → Settings →
 * Authorized domains.
 */
window.FIREBASE_CONFIG = {};   // empty → LOCAL MODE (device-only storage)
