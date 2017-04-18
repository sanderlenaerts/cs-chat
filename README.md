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

```
# Make sure apt-get has all the recent package links
sudo apt-get update

# Install git
sudo apt-get install git

# Install node and npm (npm is contained within the nodejs package)
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
service mongod status

# Make sure the database location is created and has rights
sudo mkdir -p /data/db/
sudo chown `id -u` /data/db

# Restart the mongodb service
sudo service mongod stop
sudo service mongod start

# Install forever
npm install -g forever

```

### Linux/OSX

```
# Clone the files from the GitHub repository
git clone https://github.com/sanderlenaerts/cs-chat.git

# Compile the code
npm start

# Start the server in the background
forver start server.js

If you are using a MongoDb service like Compose, you can change the URI in "db.js"

# Open the client in the browser
open http://ip:3000/

```