const fetch = require('node-fetch')

let gs = 'ab'
const fetchFromGoogleNews = (callback) => {
    fetch(`http://localhost:3010/coro.json`)
    .then(res => res.text())
    .then(results => callback(results))
}

console.log(fetchFromGoogleNews());
console.log(gs)
