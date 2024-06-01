# nodejs_exercise

rename .env_example to .env
POST - http://localhost:3000/api/auth/register

{"name" :"bhavika",
 "email":"bhavika.patel@radixweb.com",
 "password" : "Radixweb@8"
}

POST - http://localhost:3000/api/auth/login

{"email":"bhavika.patel@radixweb.com",
 "password" : "Radixweb@8"
}

//Blogs 

POST - http://localhost:3000/api/blogs
form-data

title:book2
content:content desc2
tags:childbook,parentsbook

image

GET - http://localhost:3000/api/blogs?page=1&limit=4

GET - for specific - http://localhost:3000/api/blogs/3

PUT - http://localhost:3000/api/blogs/4
formdata

title:radix
content:content3
tags:23

image

DELETE - http://localhost:3000/api/blogs/4

//Comments
POST - http://localhost:3000/api/blogs/3/comments
{"content" : "content1 description"}

GET - http://localhost:3000/api/blogs/3/comments

DELETE - http://localhost:3000/api/blogs/1/comments/2