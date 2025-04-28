

This code demonstrates how to use the Google Calendar API in Java to access and list events from a user's Google Calendar. It sets up OAuth 2.0 authorization to securely connect to the user's calendar, retrieves the next 10 upcoming events from the primary calendar, and prints their names and start times. The authorization process can either save tokens for future use or require reauthorization each time. The API allows you to read, create, update, and delete calendar events programmatically.



prereqs; 

You need a package manager to download gradle

use "gradle run" to start application

you need to be added as a tester on google cloud for your gmail to be authorised 

this gradle version is using groovy to run gradle (for syntax reference)