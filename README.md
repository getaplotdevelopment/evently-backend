[![Build Status](https://travis-ci.com/getaplotdevelopment/evently-backend.svg?token=aZsRVG2qb5Jsv5dQBpJr&branch=develop)](https://travis-ci.com/getaplotdevelopment/evently-backend)

# Evently - Get your plot right now.

## Vision

Help people to be happy, gathered happy people

---

## Docker setup and commands

### Install Docker

- Steps to [install](https://docs.docker.com/install/)
- Signup/login with docker hub

### Build the container

- In the root directory,
- run `docker-compose build`

### start the container/app

- Run `docker-compose up`
- Run container in detached mode(container runs in the background) `docker-compose up -d`
- In detached mode, run `docker-compose logs -f` to see the logs
- App is now running at port `5000`

### Check status

- run `docker-compose images` to list the available images
- run `docker-compose ps` to list active containers

### Exit the active all containers

- run `docker-compose down`

### Other commands

- To run any similar npm command, run `docker-compose exec evently-backend npm <command>`
- Example `docker-compose exec evently-backend npm test` to run tests

### Notes

- The Container automatically update when you make changes and save, No need of building it over and over..
- Docker uses `host.docker.internal` as the host URL, to run with NPM change the host url form config.js file.
- You may be required to restart postgres services sometimes, run `brew services start postgresql`.

## API Spec

The preferred JSON object to be returned by the API should be structured as follows:

### Users (for authentication)

```source-json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
}
```

### Profile

```source-json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "image-link",
    "following": false
  }
}
```

### Single event

```source-json
{
  "event": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```

### Multiple events

```source-json
{
  "events":[{
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }, {

    "slug": "how-to-train-your-dragon-2",
    "title": "How to train your dragon 2",
    "description": "So toothless",
    "body": "It a dragon",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "eventsCount": 2
}
```

### Single Comment

```source-json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```

### Multiple Comments

```source-json
{
  "comments": [{
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "commentsCount": 1
}
```

### List of Tags

```source-json
{
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
```

### Errors and Status Codes

If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### Authentication:

`POST /api/users/login`

Example request body:

```source-json
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a User

Required fields: `email`, `password`

### Registration:

`POST /api/users`

Example request body:

```source-json
{
  "user":{
    "username": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a User

Required fields: `email`, `username`, `password`

### Get Current User

`GET /api/user`

Authentication required, returns a User that's the current user

### Update User

`PUT /api/user`

Example request body:

```source-json
{
  "user":{
    "email": "jake@jake.jake",
    "bio": "I like to skateboard",
    "image": "https://i.stack.imgur.com/xHWG8.jpg"
  }
}
```

Authentication required, returns the User

Accepted fields: `email`, `username`, `password`, `image`, `bio`

### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a Profile

### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

### List events

`GET /api/events`

Returns most recent events globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=RAP`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of events (default is 20):

`?limit=20`

Offset/skip number of events (default is 0):

`?offset=0`

Authentication optional, will return multiple events, ordered by most recent first

### Feed events

`GET /api/events/feed`

Can also take `limit` and `offset` query parameters like List events

Authentication required, will return multiple events created by followed users, ordered by most recent first.

### Get Event

`GET /api/events/:slug`

No authentication required, will return single Event

### Create Event

`POST /api/events`

Example request body:

```source-json
{
  "Event": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["reactjs", "angularjs", "dragons"]
  }
}
```

Authentication required, will return an Event

Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings

### Update Event

`PUT /api/events/:slug`

Example request body:

```source-json
{
  "Event": {
    "title": "Did you train your dragon?"
  }
}
```

Authentication required, returns the updated Event

Optional fields: `title`, `description`, `body`

The `slug` also gets updated when the `title` is changed

### Delete Event

`DELETE /api/events/:slug`

Authentication required

### Add Comments to an Event

`POST /api/events/:slug/comments`

Example request body:

```source-json
{
  "comment": {
    "body": "His name was my name too."
  }
}
```

Authentication required, returns the created Comment
Required field: `body`

### Get Comments from an Event

`GET /api/events/:slug/comments`

Authentication optional, returns multiple comments

### Delete Comment

`DELETE /api/events/:slug/comments/:id`

Authentication required

### Favorite Event

`POST /api/events/:slug/favorite`

Authentication required, returns the Event
No additional parameters required

### Unfavorite Event

`DELETE /api/events/:slug/favorite`

Authentication required, returns the Event

No additional parameters required

### Get Tags

`GET /api/tags`
