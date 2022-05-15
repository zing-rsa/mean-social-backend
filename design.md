# Backend approach:

## Endpoint map:
---
### <u>users</u>:

`/users: get`
- return all users
    - username
    - names
    - pp

`/users/signup: post`
- create user

`/users/edit: put`
- edit user info

`/users/delete: delete`
- delete user
- ADMIN ONLY

`/users/{username}: get`
- get user info
    - all data
    - pictures

### <u>posts</u>

`/posts/create: post`
- create post

`/posts/delete: delete`
- delete post
- ADMIN or OWNER ONLY

`/posts/{username}: get`
- get posts from user
    - inject comments

### <u>comments</u>

`/comments/create: post`
- create comment

`/comments/delete: delete`
- delete comment
- ADMIN or OWNER ONLY

### <u>misc</u>

`/follow: post`

`/unfollow: post`

`/login: post`

---

## DB schema: 

### user:
```
_id | username | email         | pword  | bio           | profilepic     | coverpic 
1   | john     | j.h@gmail.com | 1234   | Hi, I'm john. | '/pp/pic1.jpg' | '/cp/pic1.jpg'
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


