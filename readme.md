
## Mern-social-backend

Mern Social is a code project that aims to simulate a social media similar to Twitter, where users can create accounts, log in, and post short messages + media to share with others. Users can also follow and unfollow each other, as well as like and reply to posts.
The primary purpose of this project is to explore the JavaScript(MERN) ecosystem and improve my skills in React and API design.
Thanks for checking it out.

Live [here.](https://www.mern-social.zing-rsa.co.za/)  

### Debug

1. `npm install`
2. populate a `.env` with fields from `.sample-env`  
3. setup a google drive directory:  
    a. create a google service account by following [this](https://www.labnol.org/google-api-service-account-220404) until step 4  
    b. save `filekey.json` from the above step in the project root  
    c. create 3 directories in the drive and add their ID's' to `.env`  
4. setup a mongoDb instance and add the connection string + name to `.env`  
5. create 2 secrets to use as the JWT keys in `.env`
6. `npm run start`

### Contributing

1. Branch `dev`
2. use `feature/` `change/` `defect/`
3. PR to `dev`

---
Front-end at: [mern-social-frontend](https://github.com/zing-rsa/mern-social-frontend)
