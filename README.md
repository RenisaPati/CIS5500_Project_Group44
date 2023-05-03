# CIS5500_Project_Group44

## Motivation for the idea
A common question that everyone asks from time to time is 'what book should I read next?'. In building our application, we seek to help users discover new books as well as revisit those they’ve read previously. Additionally, new readers will be able to browse for new books using several ranking systems for books, series, and authors.

## Setup
**Required** <br>
The first step is to verify that Node.js is installed on your machine by running the following commands: <br>
npm -v <br>
node - v <br>

You will also need to use the (built-in) terminal for your operating system.

**Recommended** <br>
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
* **Signup:** We prepended a regular user authentication facility to our application where a new user can sign up and their details shall get inserted into the database containing User Information. If they are an already existing user, they can click on the message that redirects them to the SignIn page.

* **SignIn:** For existing users, we have a SignIn page where they can enter their credentials, get it validated against their existing information. Once validated, they are redirected to the homepage. The SignIn page also provides a clickable message where it lets new users navigate through the Signup page first before Signing in to the application.

* **Homepage:** Upon entering the website, users will be greeted with a banner welcoming them to AMAZINGREADS. The page helps users find books using several mechanisms, including a Surprise Me button, which takes them to a random book page, a Recommended Books section, which holds books similar to those they have liked in the past, the top 10 books of the month, and the user’s personal reading list. Upon clicking any of these, the user will be sent to that book’s page for more information. Should they wish to explore genres or authors, the navigation bar will allow them to do so. 
	
* **Book page:** The book page displays all the important information that a user might want to learn about a new book. Basic meta information is displayed including the genres and series to which the book belongs. The genre attributes are clickable and will redirect users to that genre’s page while the series title will pop out a modal showing the user the other books in that series. Similar books to the current one are shown as well as a chart displaying the rating history of the book compared to that of the genre that the book is in. Finally, the reviews that have been written about the book are displayed below. 

* **Authors page:** The authors page displays a paginated table of all authors who have written a book stored in the database. They’re ranked by a weighted average of the average author rating, so many of the user’s favorite authors may appear towards the top or on the first few pages of the table. Here the user can compare some metrics about each author such as average rating and number of reviews. Clicking on an author’s name will pop out a modal which displays more information about the author as well as all of the books that they have written. If clicked, these books redirect the user to that book’s page.

* **Genres page:** This page displays the top books that are part of the selected genre. The page is reachable either from the navigation bar dropdown menu or from a book page, where the user can click on a genre name. Each book in the genre that is displayed will take the user to that book’s page. 
