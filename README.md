# CIS5500_Project_Group44

## Motivation for the idea
A common question that everyone asks from time to time is 'what book should I read next?'. In building our application, we seek to help users discover new books as well as revisit those they’ve read previously. Additionally, new readers will be able to browse for new books using several ranking systems for books, series, and authors.

## Setup
**Required**
The first step is to verify that Node.js is installed on your machine by running the following commands:
npm -v
node - v

You will also need to use the (built-in) terminal for your operating system.

**Recommended**
We recommend that you use Visual Studio (VS) Code (as the code editor and its built-in terminal).

You will also need a web browser, like Google Chrome, but most major browsers will support equivalent functionality.

**To run the application:**
1. Open a new terminal (on VS code) and cd into the server folder, then run npm install:
    cd server
    npm install
2. Do the same for the client (you can run cd ../client instead of cd client if in the /server folder):
    cd client
    npm install

This will download and save the required dependencies into the node_modules folder within the
/client and /server directories.

3. Additional modules to download manually: 
* npm install react-rating-stars-component
* npm install react-multi-carousel
* npm install react-final-form
* ( add --force at the end of the command if you face a version discrepancy )

4. To connect to the database (MySQL), the db credentials have been stored into config.json in the /server folder

5. First, you should start the server application by running the command **npm start** in a terminal window within the /server directory

6. After starting the server application, which should run on port 8080, you should start the React application by running the command **npm start** within the /client directory in a terminal window. 

This application, by default, runs on localhost - port 3000. Once you run the above command, your default browser should open up a window to localhost:3000.

7. You can run the provided tests in the \_\_test\_\_ directory within the server folder by running:
    npm test

## Features:
* Login page: Displays textboxes for an existing user to enter their username and password to login. It also has a link to let new users register.
* Home page: The home page will display the most popular books in the current month. If the user has logged in, they’ll be able to see their reading list and a short list of recommendations, otherwise they’ll be prompted to log in. Users can also navigate to the book and author pages to get more detailed information.
* Book page: The book page will display information about a particular book such as title, author (clickable), pages, genres (clickable), image. Clicking on a genre or an author will allow the user to navigate to their pages to get more information. A list of similar books will be displayed to the user.
* All authors page: It will display a list of author names, number of titles written, average rating. The list will be sortable by each attribute. Clicking on an author name will direct user to that author’s page
* Single Author page: It will display the author’s information and books written by that author. Clicking on a book will direct user to that book’s page
* Single Genre page: It will display the different books in a particular genre. Clicking on a book in a genre will take the user to that book’s page.

## Implementation of the features:
* Users will be able to login to an existing account or set up a new account.
* Homepage:<br>
  i. Most popular books in a month will be visualized in a carousel fashion. <br>
  ii. Button to take you to a random book page; “Surprise Me!”<br>
  iii. For existing and new users, a short list (5) of recommended books will be displayed. <br>
  iv. Users who have “liked” a book will see these in their “Reading List” (top 5 shown). <br>
  v. If a user has not logged in, they will see the same homepage, but “reading list” will display a message prompting them to log in. Clicking there will redirect to the login page. <br>
  vi. Nav bar with “Home page”, “Books”, “Authors” buttons to redirect to ranked pages. <br>
  vii. Footer banner with team name, creators, and possibly links <br>
* Book page:
  i. Book information such as title, author (clickable), pages, genres (clickable), image etc will be displayed. <br>
  ii. We’ll display the list of similar books, which if clicked, will direct to that book’s page. <br>
  iii. Clicking on a genre will take you to the genres page and navigate down to the correct genre section. <br>
  iv. Reviews for the book will be displayed below the book information. These will be sortable by number of “likes” the review got and the date. <br>
  v. Clicking on the author will take you to the author’s page <br>
  vi. Plot of the number of reviews the book has gotten in each year <br>
  vii. If a book is part of a series, then clicking the series title will pop out a model containing the other books in the series, each of which is clickable and navigates to that book’s page. <br>

* All Authors page:
  i. Authors list will be sortable by each attribute of the table <br>
  ii. Clicking on an author name will direct user to that author’s page <br>
* Single Author’s page:
  i. Display author information and books written by that author <br>
  ii. Clicking on a book will direct user to that book’s page <br>
* Single Genre page:
  i. Clicking on a book in a genre will take the user to that book’s page <br>
