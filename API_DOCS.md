
### POST api/user/login - Login
 > @api {post} /user/login Login
 > @apiVersion 1.0.0
 > @apiName Login
 > @apiGroup User
 > @apiDescription Returns a token with used for authentication and a useful payload with data.
 > 
 > @apiParam {String} email The user's email address or username
 >@apiParam {String} password The user's password
 >
 > @apiSuccess {String} token A JWT format token
 >
 >@apiError {string} WrongPassword Incorrect password provided
 
### POST api/user/register - Register
 > @api {post} /user/register Register
 > @apiVersion 1.0.0
 > @apiName Register
 > @apiGroup User
 > @apiDescription Register a user using his email.
 >
 > @apiParam {String} email The user's email address
 > @apiParam {String} password The user's password
 >
 > @apiSuccess {String} token Token to be used to sign the user in

### POST api/profile/:id/follow - Follow user
 > @api {post} /profile/:id/follow Follow user
 > @apiVersion 1.0.0
 > @apiName FollowUser
 > @apiGroup Profile
 > @apiDescription Follows a user
 >
 > @apiSuccess {String} status success
 >
 > @apiError {string} UserNotFound User not found
 > @apiError {string} AlreadyFollows Already follows the user
 > @apiError {string} CannotFollowYourself User cannot follow themselves

### POST api/profile/:id/unfollow - Unfollow user
 > @api {post} /profile/:id/unfollow Unfollow user
 > @apiVersion 1.0.0
 > @apiName UnfollowUser
 > @apiGroup Profile
 > @apiDescription Unfollows a user
 >
 > @apiSuccess {String} status success
 >
 > @apiError {string} UserNotFound User not found
 > @apiError {string} AlreadyUnfollows Already not following the user

### POST  api/tweet - Create a Tweet
 > @api {post} /tweet Create a Tweet
 > @apiVersion 1.0.0
 > @apiName CreateTweet
 > @apiGroup Tweet
 > @apiDescription Lets a user create an tweet.
 >
 > @apiParam {String} body The tweet body
 >
 > @apiSuccess {String} status success

### GET  api/tweet/:id - Retrieve a Tweet
 > @api {get} /tweet/:id Retrieve a Tweet
 > @apiVersion 1.0.0
 > @apiName GetTweet
 > @apiGroup Tweet
 > @apiDescription Lets a user see their tweet.
 >
 > @apiSuccess {String} _id Tweet id
 > @apiSuccess {String} author Author id
 > @apiSuccess {String} body Tweet body
 > @apiSuccess {Date} date_created The date the tweet was created
 >
 > @apiError {string} TweetNotFound Tweet not found
 > @apiError {string} PrivacyError User cannot see this Tweet (not created by user)

### DELETE  api/tweet/:id - Delete a Tweet
 > @api {delete} /tweet/:id Delete a Tweet
 > @apiVersion 1.0.0
 > @apiName DeleteTweet
 > @apiGroup Tweet
 > @apiDescription Lets a user delete their tweet.
 >
 > @apiSuccess {String} status success
 >
 > @apiError {string} TweetNotFound Tweet not found
 > @apiError {string} PrivacyError User cannot delete this Tweet (not created by user)
