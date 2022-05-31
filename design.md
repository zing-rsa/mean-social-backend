
# Approach:

## Endpoint map:

### <u>users</u>:

`/users: get`
- return all users
    - username
    - names
    - pics

`/users/edit: put` - (admin, owner)
- edit user info

`/users/delete: delete - (admin)`
- delete user

`/users/{username}: get`
- get user info
    - all data
    - pictures

### <u>posts</u>

`/posts: get`
- get all posts
- maybe add pagination to this

`/posts/create: post` - owner
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

`/auth/signup: post`
- create user

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
owner       | followee
user._id    | user._id 
```

#### pseudo authorize.mw:

check owner:
if put or delete
    fetch document with req.body._id 
                                        - what if no doc?
                                        - how to know which type of doc(post, comment etc.)
    if doc.owner = current_user._id
        current_user.roles.push('owner')
