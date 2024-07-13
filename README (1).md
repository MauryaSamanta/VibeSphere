
# VibeSphere



## About

A Full Stack Social Media Website with features of creating user profiles, adding and removing friends, creating posts which may include text as well as images and tagging friends on posts
## Tech Stack
Frontend: React.JS, Redux and MaterialUI

Backend: Node.JS, Express.JS

Database: MongoDB

Libraries: face-api.js--face recognition for images in post
           multer--for image uploading 
           jsonwebtoken--for authentication
           bcrypt.js--password encryption
           node-cache--implement server side caching
           
## Implementation of Friend Tagging
Face-api.js is an NPM library which uses a face detection/recognition model implemented on top of the TensorFlow.js library.

Using faci-api.js enabled me to enable face detection on images which are posted. Post-detection, I utilised HTML Canvas to build a border around the face followed by a textbox to input the name of the friend to be tagged. 

Possible Improvements: Working towards giving recommendations for friend names from the face detected 

## Implementation of Server-Side Caching
Utilized node-cache NPM library to implement server-side caching.

Reason: When the home page is loaded after login, a request is sent to the backend to get all the posts so that it can be shown on the frontend as feed posts. As number of posts increased, it was noticed that the time it took to load the home page was increasing too. 

Solution: Implemented caching at server-end using node-cache. 

Result: Reduce home page loading time by 72% 
## Live Link:
yet to be hosted