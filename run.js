const fs = require('fs');
const fetch = require('fetch');
const data = require('types-registry').entries;

const pkgNames = Object.keys(data).sort();

const outputName = 'output.csv';

if (fs.existsSync(outputName)) {
    fs.unlinkSync(outputName);
}
getNext();

function getNext() {
    if (pkgNames.length === 0) {
        exit(0);
    }
    const name = pkgNames.shift();
    console.log(name);
    fetch.fetchUrl(`https://api.npmjs.org/downloads/range/last-week/@types/${name}`, {}, (err, meta, data) => {
        try {
            const json = JSON.parse(data.toString());
            const lines = json.downloads.map(entry => `${name},${entry.downloads},${entry.day}\r\n`);
            fs.appendFileSync(outputName, lines.join(''));
        } catch(e) {
            
        }
        getNext();
    });
}
