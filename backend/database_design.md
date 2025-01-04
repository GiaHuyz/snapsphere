# Database Design for AI-powered Image Sharing Platform

## 1. Table: `users` (Clerk - Not in database)
Stores information about users.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `user_id`         | String           | ID of the user provided by Clerk.              |
| `email`           | String           | Email address of the user (synced from Clerk). |
| `name`            | String           | Display name of the user (synced from Clerk).  |
| `avatar_url`      | String           | URL of the user's profile picture (from Clerk).|
| `bio`             | String           | Custom user bio.                               |
| `created_at`      | Date             | Account creation date in the system.           |
| `updated_at`      | Date             | Last updated date for the user's profile.      |

---

## 2. Table: `images`
Stores information about images uploaded by users.

| **Field**        | **Type**         | **Description**                                 |
|-------------------|------------------|------------------------------------------------|
| `image_id`        | ObjectId         | Primary key for the image.                     |
| `user_id`         | ObjectId         | ID of the user who uploaded the image.         |
| `position`        | Number           | Position of the image within the collection.    | 
| `title`           | String           | Title of the image.                            |
| `url`             | String           | Storage URL of the image (Cloudinary).         |
| `link`            | String          | A url associated with the image, added by the user.|
| `description`     | String           | Description of the image.                      |
| `tags`            | Array of String  | List of tags associated with the image.        |
| `category`        | String           | category of the image (e.g., Travel).          |
| `is_public`       | Boolean          | Whether the image is publicly visible.         |
| `is_allowed_comment`   | Boolean     | Whether comments are allowed for the image.    |
| `created_at`      | Date             | Date the image was uploaded.                   |
| `updated_at`      | Date             | Date the image was last updated.               |

---

## 3. Table: `boards`
Stores information about user-created image collections.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `board_id`        | ObjectId         | Primary key for the board.                     |
| `user_id`         | ObjectId         | ID of the user who owns the board.             |
| `name`            | String           | Name of the board.                             |
| `description`     | String           | Short description of the collection.           |
| `secret`       | Boolean          | Whether the collection is publicly visible.    |
| `created_at`      | Date             | Date the collection was created.               |
| `updated_at`      | Date             | Date the collection was last updated.          |


## 4. Table: `boardpins`
Stores information about images associated with a board.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `boardpin_id`     | ObjectId         | Primary key for the boardpin.                  |
| `board_id`        | ObjectId         | ID of the board associated with the pin.       |
| `pin_id`          | ObjectId         | ID of the pin associated with the board.       |

---

## 4. Table: `likes`
Stores information about likes on images.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `like_id`         | ObjectId         | Primary key for the like.                      |
| `user_id`         | ObjectId         | ID of the user who liked the image.            |
| `item_id`        | ObjectId         | ID of the liked image.                         |
| `type`            | String           | Type of the liked item (e.g., 'pin', 'comment'). |
| `created_at`      | Date             | Date the like was created.                     |

---

## 5. Table: `comments`
Stores information about comments on images.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `comment_id`      | ObjectId         | Primary key for the comment.                   |
| `user_id`         | ObjectId         | ID of the user who commented on the image.     |
| `image_id`        | ObjectId         | ID of the commented image.                     |
| `parent_id`       | ObjectId         | ID of the parent comment (if any).             |
| `content`         | String           | Content of the comment.                        |
| `created_at`      | Date             | Date the comment was created.                  |
| `updated_at`      | Date             | Date the comment was last updated.             |

---

## 6. Table: `follows`
Stores information about follows between users.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `follow_id`       | ObjectId         | Primary key for the follow.                    |
| `follower_id`     | ObjectId         | ID of the follower.                            |
| `followee_id`     | ObjectId         | ID of the followee.                            |
| `created_at`      | Date             | Date the follow was created.                   |

---

## 7. Table: `reports`
Stores information about reported images for violations.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `report_id`       | ObjectId         | Primary key for the report.                    |
| `user_id`         | ObjectId         | ID of the user submitting the report.          |
| `image_id`        | ObjectId         | ID of the reported image.                      |
| `reason`          | String           | Reason for reporting the image.                |
| `status`          | String           | Status of the report (e.g., pending, resolved).|
| `created_at`      | Date             | Date the report was created.                   |
