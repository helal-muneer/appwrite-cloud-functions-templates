import admin from 'firebase-admin';

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'FCM_DATABASE_URL',
]);

// initailze firebase app
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FCM_PROJECT_ID,
    clientEmail: process.env.FCM_CLIENT_EMAIL,
    privateKey: process.env.FCM_PRIVATE_KEY,
  }),
  databaseURL: process.env.FCM_DATABASE_URL,
});

/**
 * Throws an error if any of the keys are missing from the object
 * @param {*} obj
 * @param {string[]} keys
 * @throws {Error}
 */
export function throwIfMissing(obj, keys) {
  const missing = [];
  for (let key of keys) {
    if (!(key in obj) || !obj[key]) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Sends a push notification to a single device, multiple devices, or a topic
 * @param {admin.messaging.Message} payload - The notification payload
 * @returns {Promise<string>} - The message ID
 */
export async function sendPushNotification(payload) {
  try {
    // If token is provided, send to a single device
    if (payload.token) {
      return await admin.messaging().send(payload);
    }
    // If tokens array is provided, send to multiple devices
    else if (payload.tokens && Array.isArray(payload.tokens)) {
      const response = await admin.messaging().sendMulticast({
        tokens: payload.tokens,
        notification: payload.notification,
        data: payload.data || {}
      });
      return response.successCount.toString();
    }
    // If topic is provided, send to a topic
    else if (payload.topic) {
      return await admin.messaging().send({
        topic: payload.topic,
        notification: payload.notification,
        data: payload.data || {}
      });
    }
    // If condition is provided, send based on condition
    else if (payload.condition) {
      return await admin.messaging().send({
        condition: payload.condition,
        notification: payload.notification,
        data: payload.data || {}
      });
    }
    else {
      throw "Missing target: provide token, tokens, topic, or condition";
    }
  } catch (e) {
    throw `Error on messaging: ${e.message || e}`;
  }
}
