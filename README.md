# superluminal
### `C<-`
Superluminal is a minimal node based wiki. It's intended to be very hackable, and simple while still having some super neat features. It's designed as a single user application and with that in mind leaves it up to the user to secure things. 
Don't ever run this on a public IP. 
If you try hard enough Superluminal can delete your whole `~` as result of simply **editing** a wiki `*.md` because it allows you to inline js that's executed on the server. All foot guns are intentionally left in on this one fam.

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
 
Once that's done you can either jump right in by running `npm start` and navigate to [localhost:1337](http://localhost:1337) to see this readme file rendered. **Superluminal** will render from `./wiki` which has a symlink copy of this `README.md` as `index.md` by default. Any files in `./wiki` are acessible via the browser, if a file doesn't have an extension it's assumed to be a **markdown** file of that name and a render is attempted. e.g. navigating to `localhost:8080/test` will attempt to render `wiki/test.md`, the default `localhost:8080` resolves to `wiki/index.md`. This means that you can have a `/test` folder and a `/test.md` and files inside `/test/` and it all works fine. If you want a list of files you gotta do something like this 

```js
${await (async () => {
    //for posterity
    let fs = await import('fs')
    return fs.readdirSync(wikiRoot)
    .filter(a => a.slice(-3) == '.md')
    .map(a=>'- ['+a.slice(0,-3)+']('+a+')\n')
    .join('')
})()}
```

directly in your markdown. This level of insanity is a feature, not a bug.
 
If you wish to change the root wiki directory (for example for easier version control) take a look at `./wiki-config.example.json`. Copy it to `./wiki-config.json` to bring it live. The file is `.gitignore`d by default so you don't have to worry about commiting personal info by accident.
