# Customer Service Chat Application
Customer service chat app for HeadQuarters Network Design &amp; Consultancy

This chat application is meant to be used by ICT Supports within HQ Wifi. It would be an easier and cheaper and faster solution to a lot of customer support.

Technologies used:
* Angular 2
* TypeScript
* Express.js
* Node.js
* HTML5 &amp; CSS3
* Sass
* MongoDB


## Installation

### Prerequisites
To install and run this project, you'll need to have [Node.js with npm](https://nodejs.org/en/) and [Git](https://git-scm.com/downloads) installed on your machine.

### Linux/OSX

```
# Clone the files from the GitHub repository
git clone https://github.com/sanderlenaerts/cs-chat.git

# Start the server
npm start

# Start your mongodb service if you use a local database
sudo service mongod start

If you are using a MongoDb service like Compose, you can change the URI in "db.js"
`
# Open the client in the browser
open http://ip:3000/