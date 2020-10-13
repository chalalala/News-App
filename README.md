# News App
A news app using **React Native** & **Expo**. Our app will help users find information about current world events. We'll do so by requesting data from a 3rd party API and then consuming this data in our app.

## Features
- The user can see a list of news articles loaded from an API.
- For each article the user sees a title, source, link to read more, and hero image.
- The user can see how long ago the story was published in a human friendly format; e.g. "15 minutes ago".
- The user can see the total number of articles they've fetched from the API.
- When the user scrolls to the end of the list, the app automatically fetches more articles and appends them to the list of current articles(adds them to the bottom of our list).
- If the user pushes the "read more" button then the app opens up the article in the phones default browser.
- If the api request fails, the app should prompt the user.
- If the app is fetching additional articles, the user should be prompted accordingly.
- If the api has no more articles to fetch, the app should not make unnecessary api requests.
- If the user has fetched all the articles, the user should be prompted accordingly.

## Additional features
- User can see a list of individual publishers.  
- User can see how many articles each publisher has made.  
- User can search articles by title.  

## Demo
![image](https://media4.giphy.com/media/TrZfRTELo51KNpRR1a/giphy.gif)