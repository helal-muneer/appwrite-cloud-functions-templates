import { sendPushNotification, throwIfMissing } from './utils.js';

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'FCM_DATABASE_URL',
]);

export default async ({ req, res, log, error }) => {
  try {
    // Check if at least one targeting method is provided
    const hasTargetingMethod = [
      'deviceToken',
      'deviceTokens',
      'topic',
      'condition'
    ].some(method => method in req.body && req.body[method]);

    if (!hasTargetingMethod) {
      throw new Error('At least one targeting method (deviceToken, deviceTokens, topic, or condition) is required');
    }

    // Message is still required
    throwIfMissing(req.body, ['message']);
    throwIfMissing(req.body.message, ['title', 'body']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  // Create the notification payload
  const payload = {
    notification: {
      title: req.body.message.title,
      body: req.body.message.body,
    },
    data: req.body.data ?? {},
  };

  // Add the appropriate targeting method
  if (req.body.deviceToken) {
    log(`Sending message to device: ${req.body.deviceToken}`);
    payload.token = req.body.deviceToken;
  } else if (req.body.deviceTokens && Array.isArray(req.body.deviceTokens)) {
    log(`Sending message to ${req.body.deviceTokens.length} devices`);
    payload.tokens = req.body.deviceTokens;
  } else if (req.body.topic) {
    log(`Sending message to topic: ${req.body.topic}`);
    payload.topic = req.body.topic;
  } else if (req.body.condition) {
    log(`Sending message with condition: ${req.body.condition}`);
    payload.condition = req.body.condition;
  }

  try {
    const response = await sendPushNotification(payload);

    log(`Successfully sent message: ${response}`);

    return res.json({ ok: true, messageId: response });
  } catch (e) {
    error(e);
    return res.json({ ok: false, error: 'Failed to send the message' }, 500);
  }
};
