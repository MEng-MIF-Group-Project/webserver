
# Omelette
Omlette is a webserver written in NodeJS, Express, and Pug which allows chemists in the MIF easy use of our MEng group project found at [MEng-MIF-Group-Project](https://github.com/MEng-MIF-Group-Project)

## Setting up your own environment
 1. Install [NodeJS LTS](https://nodejs.org/en/) (I'm on 10.16.3)
 2. Clone this repo into your working directory
 3. Move into the project folder and run `npm install`
 4. run `npm run dev` to open the server

 Note: Server will auto restart on any file changes, this can cause strange behaviour with sessions as they will all be wiped

## Todo

 - [x] Base routing (Home, 404, and Login)
 - [ ] Login or Passcode authentication
 - [ ] Link to [mifproject1](https://github.com/jsduck/mifproject1) (perhaps with scalable resourses to cope with system load?)
 - [ ] Database to store previous results
 - [ ] Visualisations
 - [ ] Big ole periodic table
