# MovieWiki
Project 3 for CISC375 - Web Development

Task

For this project, you will create a dynamic web application about television and movies. You will program a web server to interface with an SQL database and create web pages on the fly. Your application should allow users to search for movies, tv shows, actors, directors, etc. and pull up a page about it. You are not expected to create millions of HTML files and serve them statically, but rather generate the HTML code as a string inside your server based on the query results from the database.

In addition to retrieving information about television and movies, your site should be a Wiki - anybody in the community can edit the site. This will require you to allow users to modify content, upload (POST) it to the web server, and have the server update the database.

You will run your code on the CISC-DEAN server using the port numbers assigned to you.

For this project, you are free to use any Node modules, and JavaScript or CSS libraries as you see fit.

About the Data Set

IMDB Database:

I have downloaded data from IMDB's public dataset located at https://www.imdb.com/interfaces/ (Links to an external site.)Links to an external site. and stored them in a SQLite3 database. This database is approximately 3.0 GB and can be found on CISC-DEAN at /home/marr4459/cisc375/assignment3/imdb.sqlite3. Please copy this database into your user directory.

The database has 5 tables as follows:

Titles:
tconst (TEXT) - alphanumeric unique identifier of the title
title_type (TEXT) - the type/format of the title (e.g. movie, short, tvSeries, video, etc.)
primary_title (TEXT) - the more popular title / the title used by the filmmakers on promotional materials at the point of release
original_title (TEXT) - original title, in the original language
start_year (INTEGER) - represents the release year of a title (in the case of TV Series, it is the series start year)
end_year (INTEGER) - TV Series end year (NULL for all other title types)
runtime_minutes (INTEGER) - primary runtime of the title, in minutes
genres (TEXT) - includes up to three genres associated with the title (comma separated)
Names:
nconst (TEXT) - alphanumeric unique identifier of the name/person
primary_name (TEXT) - name by which the person is most often credited
birth_year (INTEGER) - year of birth in YYYY format
death_year (INTEGER) - year of death in YYYY format (NULL if still living)
primary_profession (TEXT) - the top three professions of the person (comma separated)
known_for_titles (TEXT) - titles the person is known for (comma separated)
Principals:
tconst (TEXT) - alphanumeric unique identifier of the title
ordering (INTEGER) - bill order for the title
nconst (TEXT) - alphanumeric unique identifier of the name/person
category (TEXT) - job category (actor, actress, producer, director, writer, etc.)
job (TEXT) - more detailed job description
characters (TEXT) - list of characters played in title (comma separated with each character in double-quotes)
Crew:
tconst (TEXT) - alphanumeric unique identifier of the title
directors (TEXT) - list of directors (comma separated)
writers (TEXT) - list of writers (comma separated)
Ratings'tt1785572
tconst (TEXT) - alphanumeric unique identifier of the title
average_rating (REAL) - weighted average of all the individual user ratings
num_votes (INTEGER) - number of votes the title has received
IMDB Poster API:

I have provided a NodeJS module for retrieving poster images for Titles and People. This file can be found on CISC-DEAN at /home/marr4459/cisc375/assignment3/imdb_poster.js. Please copy this JavaScript module into your user directory.

There are two functions as part of this API:

GetPosterFromNameId(nconst, callback)
GetPosterFromTitleId(tconst, callback)
The callback should be a function with 1 parameter that holds the data for the poster image URL. Note that the data is a JavaScript object with host and path - you will need to create the actual URL for the <img> src attribute. The protocol (http:// or https://) should match that of your webpage. In the browser, this can be detected using window.location.protocol.

Grading Rubric (75 pts)

To earn 55/75 points (grade: C)

Create a home page that has a search input, a dropdown menu to choose between Titles and People, and a Submit button
Once submitted, a POST request should be sent to your server
The server should sanitize the search text once it's received to make it SQL friendly
Remove any semi-colons [;] and open or close parentheses [()]
Treat asterisk [*] as a wildcard character (e.g. *Pitt would return anyone with the last name 'Pitt')
The server should then perform a query to the imdb.sqlite3 database and respond with a page of matches
Each match should be a link (allows the user to click on desired match)
For Titles
Show primary_title, title_type, start_year, and end_year (if applicable)
For People
Show primary_name, birth_year, death_year (or 'present' if still alive), and primary_professions
Once a user selects a match, the server should dynamically generate data about that item and serve it as an HTML page
For Titles
primary_title
title_type
poster image
start_year
end_year (if applicable)
runtime_minutes
genres
average_rating
num_votes
top billed cast (Principals ordered by 'ordering' column)
include directors and writers from Crew at end of list if not already part of Principals
Each person should be a link to their page
For People
primary_name
birth_year
death_year (or 'present' if still alive)
primary_professions
known_for_titles (actual tv show / movie titles - not tconsts)
Each title should be a link to that page
"About the Project" page
Short bio about each team member (including a photo)
Description of the tools (frameworks, APIs, etc.) you used to create the application
Video demo of the application (2 - 4 minutes)
Can natively embed or upload to YouTube and embed

To earn 65/75 points (grade: B)

Everything from list above
Make Title and People pages into a Wiki
Have an 'Edit' button on each page
If clicked for a Title, user can:
Add / remove genres (from predefined list)
Change title type (from predefined list)
Reorder top billed cast
If clicked for a Person, user can:
Change birth year
Change death year
Change primary professions (from predefined list)

To earn 75/75 points (grade: A)

Everything from list above (NO points will be given from the list below if Wiki functionality not implemented)
Add filters to the home page search
For Titles
title_type
For People
primary_profession
Provide loading animation while results are being fetched from the server
Asynchronously load in poster images
When page is first loaded, show a deafult image
Replace image with actual poster once it's retrieved
Include poster images in search results, top billed cast, and known for titles lists
Loaded asynchronously (like poster images on individual pages)
Submission

You will be working in groups of 2 students to complete this project. You are allowed to work together on all aspects of the project or to divide tasks equally among the members. You are NOT however allowed to collaborate with students from other teams. The only exception to this is posting general questions/answers to the discussion board on Canvas.

Code should be saved in a private repository on GitHub while working on the project. You should make the repository public on the date the project is due. In order to submit, you should enter the the project's URL for the assignment (in Canvas). After submitting, add a comment describing what you did and what your partner did to contribute to the overall project.

Deadline
This assignment is due Friday, April 27 at 9:00pm.
