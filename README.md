# CIS5500_Project_Group44

## Motivation for the idea
A common question that everyone asks from time to time is 'what book should I read next?'. In building our application, we seek to help users discover new books as well as revisit those they’ve read previously. Additionally, new readers will be able to browse for new books using several ranking systems for books, series, and authors.

## Features:
a. Login page: Displays textboxes for an existing user to enter their username and
password to login. It also has a link to let new users register.
b. Home page: The home page will display the most popular books in the current
month. If the user has logged in, they’ll be able to see their reading list and a
short list of recommendations, otherwise they’ll be prompted to log in. Users can
also navigate to the book and author pages to get more detailed information.
c. Book page: The book page will display information about a particular book such
as title, author (clickable), pages, genres (clickable), image. Clicking on a genre
or an author will allow the user to navigate to their pages to get more information.
A list of similar books will be displayed to the user.
d. All authors page: It will display a list of author names, number of titles written,
average rating. The list will be sortable by each attribute. Clicking on an author
name will direct user to that author’s page
e. Single Author page: It will display the author’s information and books written by
that author. Clicking on a book will direct user to that book’s page
f. Single Genre page: It will display the different books in a particular genre.
Clicking on a book in a genre will take the user to that book’s page.

## Implementation of the features:
a. Users will be able to login to an existing account or set up a new account.
b. Homepage:
i. Most popular books in a month will be visualized in a carousel fashion.
ii. Button to take you to a random book page; “Surprise Me!”
iii. For existing and new users, a short list (5) of recommended books will be
displayed.
iv. Users who have “liked” a book will see these in their “Reading List” (top 5
shown).
v. If a user has not logged in, they will see the same homepage, but
“reading list” will display a message prompting them to log in. Clicking
there will redirect to the login page.
vi. Nav bar with “Home page”, “Books”, “Authors” buttons to redirect to
ranked pages.
vii. Footer banner with team name, creators, and possibly links
c. Book page:
i. Book information such as title, author (clickable), pages, genres
(clickable), image etc will be displayed.
ii. We’ll display the list of similar books, which if clicked, will direct to that
book’s page.
iii. Clicking on a genre will take you to the genres page and navigate down to
the correct genre section.
iv. Reviews for the book will be displayed below the book information. These
will be sortable by number of “likes” the review got and the date.
v. Clicking on the author will take you to the author’s page
vi. Plot of the number of reviews the book has gotten in each year
vii. If a book is part of a series, then clicking the series title will pop out a
model containing the other books in the series, each of which is clickable
and navigates to that book’s page.

d. All Authors page:
i. Authors list will be sortable by each attribute of the table
ii. Clicking on an author name will direct user to that author’s page
e. Single Author’s page:
i. Display author information and books written by that author
ii. Clicking on a book will direct user to that book’s page
f. Single Genre page:
i. Clicking on a book in a genre will take the user to that book’s page
