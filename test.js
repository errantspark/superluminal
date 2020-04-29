// Create reference instance
import fs from 'fs'
import render from './render.js'

let markdownString = fs.readFileSync('./wiki/index.md').toString()

// Compile
console.log(render(markdownString));
