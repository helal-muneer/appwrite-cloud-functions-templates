# 🔔 Node.js Push Notifications with FCM Function

Send push notifications to your users using Firebase Cloud Messaging (FCM). This function supports sending notifications to:

- Individual devices (using device token)
- Multiple devices (using an array of device tokens)
- Topics (for broadcasting to all devices subscribed to a topic)
- Conditional targeting (using FCM condition expressions)

## 🧰 Usage

### POST /

Send a push notification to users using various targeting methods.

**Parameters**

| Name         | Description                                   | Location | Type               | Sample Value   |
| ------------ | --------------------------------------------- | -------- | ------------------ | -------------- |
| Content-Type | The content type of the request body          | Header   | `application/json` | N/A            |
| deviceToken  | FCM device identifier (single device)         | Body     | String             | `642...7cd`    |
| deviceTokens | Array of FCM device identifiers              | Body     | Array              | `["642...7cd", "abc...xyz"]` |
| topic        | FCM topic name for broadcasting              | Body     | String             | `news`         |
| condition    | FCM condition expression                     | Body     | String             | `'news' in topics` |
| message      | Message to send                               | Body     | Object             | `{"title": "hello","body": "how are you?"}` |
| data         | Additional data to pass                      | Body     | Object             | `{"greet": "welcome"}` |

**Request**

You must include **one** of the targeting methods (`deviceToken`, `deviceTokens`, `topic`, or `condition`) and the `message` object. The `data` field is optional.

**Example 1: Send to a single device**

```json
{
    "deviceToken": "642...7cd",
    "message": {
        "title": "Hello",
        "body": "How are you?"
    },
    "data": {
        "greet": "welcome" 
    }    
}
```

**Example 2: Send to multiple devices**

```json
{
    "deviceTokens": ["642...7cd", "abc...xyz", "123...def"],
    "message": {
        "title": "Group Notification",
        "body": "This message goes to multiple devices"
    },
    "data": {
        "type": "group_message" 
    }    
}
```

**Example 3: Send to a topic**

```json
{
    "topic": "news",
    "message": {
        "title": "Breaking News",
        "body": "Check out the latest updates!"
    },
    "data": {
        "category": "sports" 
    }    
}
```

**Example 4: Send using a condition**

```json
{
    "condition": "'sports' in topics || 'news' in topics",
    "message": {
        "title": "Sports & News Update",
        "body": "New content available for sports and news followers"
    },
    "data": {
        "update_type": "content" 
    }    
}
```


**Response**

Sample `200` Response:

```json
{
  "ok": true,
  "messageId": "as4jg109cbe1"
}
```

Sample `400` Response:

```json
{
  "ok": false,
  "error": "Device token and message are required."
}
```

Sample `500` Response:

```json
{
  "ok": false,
  "error": "Failed to send the message."
}
```

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (18.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |

## 🔒 Environment Variables

### FCM_PROJECT_ID

A unique identifier for your FCM project.

| Question      | Answer                                                                             |
| ------------- | ---------------------------------------------------------------------------------- |
| Required      | Yes                                                                                |
| Sample Value  | `mywebapp-f6e57`                                                                   |
| Documentation | [FCM: Project ID](https://firebase.google.com/docs/projects/learn-more#project-id) |

### FCM_CLIENT_EMAIL

Your FCM service account email.

| Question      | Answer                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Required      | Yes                                                                                                          |
| Sample Value  | `fcm-adminsdk-1a0de@test-f6e57.iam.gserviceaccount.com`                                                      |
| Documentation | [FCM: SDK Setup](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) |

### FCM_PRIVATE_KEY

A unique private key used to authenticate with FCM.

| Question      | Answer                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Required      | Yes                                                                                                          |
| Sample Value  | `0b6830cc66d92804e11af2153242d34211d675675`                                                                  |
| Documentation | [FCM: SDK Setup](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) |

### FCM_DATABASE_URL

URL of your FCM database.

| Question      | Answer                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Required      | Yes                                                                                                          |
| Sample Value  | `https://my-app-e398e.firebaseio.com`                                                                        |
| Documentation | [FCM: SDK Setup](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) |
