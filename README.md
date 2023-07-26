## Description

[Blog](http://ec2-18-206-161-25.compute-1.amazonaws.com:3000/graphql) Test task 

## Installation

```bash
$ npm install
```

You need to create your own `.env` file in root directory, watch [example](./.env.example)

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## How To Use

### Type Definitions

**User**: Represents a user in the system with attributes like id, name, surname, role, age, email, password, created_at, updated_at, and an optional list of blogs.

**UserRoles**: An enumeration representing the roles that a user can have - WRITER and MODERATOR.

**DateTime**: A scalar representing a date-time string in UTC format, compliant with the date-time format.

**Post**: Represents a blog post with attributes id, header, theme, text, created_at, updated_at, blogId, and a related blog.

**Blog**: Represents a blog with attributes id, title, description, created_at, updated_at, userId, and related user and a list of posts.

**LoginResponse**: Represents the response received after successful login with an attribute token.

### Queries
The schema defines several queries to fetch data from the server:

**getAllBlogs**: Fetches a list of blogs based on optional filtering, sorting, offset, and limit parameters.

**getBlog**: Fetches a single blog by its id.

**getBlogByAuthorId**: Fetches a list of blogs based on the userId of the author.

**users**: Fetches a list of all users in the system.

**getPost**: Fetches a single post by its id.

**getAllPosts**: Fetches a list of posts based on optional filtering, sorting, offset, and limit parameters.

### Mutations
The schema defines several mutations to create, update, and delete data:

**createBlog**: Creates a new blog with the provided data.

**updateBlog**: Updates an existing blog based on its id.

**deleteBlog**: Deletes a blog with the provided id.

**registration**: Creates a new user with the provided user details.

**login**: Authenticates the user based on the provided email and password and returns a token on successful login.

**updateUser**: Updates an existing user based on the provided id.

**deleteUser**: Deletes a user with the provided id.

**createPost**: Creates a new post under the specified blog.

**updatePost**: Updates an existing post based on its id.

**deletePost**: Deletes a post with the provided id.

### Input Types
Input types are used in mutations to pass data for creating or updating resources:

**CreateBlogInput**: Input type for creating a blog.

**UpdateBlogInput**: Input type for updating a blog.

**CreateUserInput**: Input type for user registration.

**LoginInput**: Input type for user login.

**UpdatedUserInput**: Input type for updating user information.

**CreatePostInput**: Input type for creating a new post.

**UpdatePostInput**: Input type for updating a post.

### Enums
**OrderTypeEnum**: Represents the sorting order - asc (ascending) and desc (descending).

**BlogFields**: Represents the fields on which blogs can be sorted or filtered.

**PostFields**: Represents the fields on which posts can be sorted or filtered.

### Example Usage

We need to go to [link](http://ec2-18-206-161-25.compute-1.amazonaws.com:3000/graphql)

First we need to create new user like this:
```
mutation{
  registration(createUserInput:{
    role: MODERATOR,
    name: "Sasha",
    surname: "Dudnyk",
    password: "1234qwer",
    age: 20,
    email: "sashad1903@gmail.com"
  }){
    role,
    email
  }
}
```

Then we need to login like this:
```
mutation{
  login(loginInput:{
    email:"sashad1903@gmail.com",
    password:"1234qwer"
  }){
    token
  }
}
```

And put response token to your `authorization` header, then you can do other requests

**Example 1**: Fetching Blogs
```graphql
query {
  getAllBlogs(limit:1,offset:0,filterField:title,filterValue:"test",sortValue:asc,sortField:id){
    id
    title
    description
    created_at
    user {
      name
    }
  }
}
```

**Example 2:** Creating a Blog
```graphql
mutation {
  createBlog(createBlogInput: {
    title: "New Blog Title"
    description: "This is a new blog."
    userId: 1
  }) {
    id
    title
    description
    created_at
  }
}
```
**Example 3**: Updating a User
```graphql
mutation {
  updateUser(updatedUserInput: {
    id: 1
    name: "John"
  }) {
    id
    name
    surname
  }
}
```
**Example 4**: Fetching a Single Blog with its Posts
```graphql
query {
  getBlog(id: 123) {
    id
    title
    description
    created_at
    user {
      name
    }
    posts {
      id
      header
      theme
      created_at
    }
  }
}
```
**Example 5**: Fetching Blogs by Author ID
```graphql
query {
  getBlogByAuthorId(id: 456) {
    id
    title
    description
    created_at
    user {
      name
    }
  }
}
```

**Example 6**: Fetching a Single Post
```graphql
query {
  getPost(id: 789) {
    id
    header
    theme
    text
    created_at
    blog {
      title
    }
  }
}
```
**Example 7**: Updating a Blog
```graphql
mutation {
  updateBlog(updateBlogInput: {
    id: 123
    title: "Updated Blog Title"
  }) {
    id
    title
    description
    created_at
    updated_at
  }
}
```
**Example 10**: Creating a Post
```graphql
mutation {
  createPost(createPostInput: {
    header: "New Post Header"
    theme: "Technology"
    text: "This is the content of the new post."
    blogId: 123
  }) {
    id
    header
    theme
    created_at
    blog {
      title
    }
  }
}
```

