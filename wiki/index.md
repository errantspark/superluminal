# superluminal
### `C<-`
Superluminal is a minimal node based wiki. It's intended to be very hackable, and simple while still having some super neat features. 

## Features
 - a decent markdown wiki
 - live reloading of pages as you edit the wiki or superluminal itself
 - inline javascript evaluation
 - superluminal-state injection (doesn't work yet!)
 - wiki files can modify your filesystem
 - wow

## Installation/Usage
You gotta have a **node** installed, that's left as an exercise to the reader. Honestly if you don't already have **node**, you probably shouldn't get it because it's fucking **garbage**. Don't use this wiki, don't write javascript. Live a good life. Run. Please. While there is still time.

Anyway, clone this somewhere, `cd` to the project root and run `npm install` to get all the dependencies, I promise no leftpad. 
 
Once that's done you can either jump right in by running `npm start` and navigate to [localhost:8080](http://localhost:8080) to see this readme file rendered. **Superluminal** will render from `./wiki` which has a symlink copy of this `README.md` as `index.md` by default. Any files in `./wiki` are acessible via the browser, if a file doesn't have an extension it's assumed to be a **markdown** file of that name and a render is attempted. e.g. navigating to `localhost:8080/test` will attempt to render `wiki/test.md`, the default `localhost:8080` resolves to `wiki/index.md`
 
If you wish to change the root wiki directory (for example for easier version control) take a look at `./wiki-config.example.json`. Copy it to `./wiki-config.json` to bring it live. The file is `.gitignore`d by default so you don't have to worry about accidentally commiting personal info by accident.
