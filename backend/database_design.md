
# Database Design for AI-powered Image Sharing Platform

## 1. Table: `users`
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

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `image_id`        | ObjectId         | Primary key for the image.                     |
| `user_id`         | ObjectId         | ID of the user who uploaded the image.         |
| `url`             | String           | Storage URL of the image (S3 or Cloudinary).   |
| `description`     | String           | Description of the image.                      |
| `tags`            | Array of String  | List of tags associated with the image.        |
| `theme`           | String           | Theme/category of the image (e.g., Travel).    |
| `is_public`       | Boolean          | Whether the image is publicly visible.         |
| `created_at`      | Date             | Date the image was uploaded.                   |

---

## 3. Table: `collections`
Stores information about user-created image collections.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `collection_id`   | ObjectId         | Primary key for the collection.                |
| `user_id`         | ObjectId         | ID of the user who owns the collection.        |
| `name`            | String           | Name of the collection.                        |
| `description`     | String           | Short description of the collection.           |
| `image_ids`       | Array of ObjectId| List of image IDs included in the collection.  |
| `created_at`      | Date             | Date the collection was created.               |
| `updated_at`      | Date             | Date the collection was last updated.          |

---

## 4. Table: `interactions`
Stores information about user interactions with images.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `interaction_id`  | ObjectId         | Primary key for the interaction.               |
| `user_id`         | ObjectId         | ID of the user performing the interaction.     |
| `image_id`        | ObjectId         | ID of the image being interacted with.         |
| `type`            | String           | Type of interaction (e.g., like, comment).     |
| `content`         | String           | Content of the comment (if applicable).        |
| `created_at`      | Date             | Date the interaction was created.              |

---

## 5. Table: `reports`
Stores information about reported images for violations.

| **Field**        | **Type**         | **Description**                                |
|-------------------|------------------|------------------------------------------------|
| `report_id`       | ObjectId         | Primary key for the report.                    |
| `user_id`         | ObjectId         | ID of the user submitting the report.          |
| `image_id`        | ObjectId         | ID of the reported image.                      |
| `reason`          | String           | Reason for reporting the image.                |
| `created_at`      | Date             | Date the report was created.                   |
| `status`          | String           | Status of the report (e.g., pending, resolved).|

---

## Redis Cache
Used for caching search and recommendation data to improve system performance.

- **Key**: `search:{query}`  
  - **Value**: List of image IDs matching the search query.  

- **Key**: `recommendations:{user_id}`  
  - **Value**: List of recommended image IDs for the user.  
