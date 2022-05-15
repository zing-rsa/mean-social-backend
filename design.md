
# Approach:

## Endpoint map:

### <u>users</u>:

`/users: get`
- return all users
    - username
    - names
    - pics

`/users/signup: post`
- create user

`/users/edit: put`
- edit user info

`/users/delete: delete - (admin)`
- delete user

`/users/{username}: get`
- get user info
    - all data
    - pictures


### <u>posts</u>

`/posts/create: post`
- create post

`/posts/delete: delete - (admin or owner)`
- delete post

`/posts/{username}: get`
- get posts from user
    - inject comments

### <u>comments</u>

`/comments/create: post`
- create comment

`/comments/delete: delete - (admin or owner)`
- delete comment

### <u>follows</u>:

`/follows/follow: post`

`/follows/unfollow: delete`

### <u>auth</u>

`/auth/login: post`

## DB schema: 

### user:
```
_id | username | email         | pword  | bio           | profilepic     | coverpic 
1   | john     | j.h@gmail.com | hash   | Hi, I'm john. | '/pp/pic1.jpg' | '/cp/pic1.jpg'
```

### post:
```
_id | owner       | text                      | timestamp   
1   | user._id    | 'the text of the post'    | 2022-03-10 12:30:01
```

### comment:
```
_id | owner       | parent-post  | text                      | timestamp   
1   | user._id    | post._id     | 'the text of the comment' | 2022-03-10 12:30:02
```

### follow:
```
user        | followee
user._id    | user._id 
```