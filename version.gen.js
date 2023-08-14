const fs = require('fs');
const path = require('path');

function generateVersion() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    const versionFilePath = path.resolve(__dirname, 'src/version.js');

    let version = '';

    try {
        version = fs.readFileSync(versionFilePath, 'utf8');
    } catch (error) {
        // If the version file doesn't exist, create it.
        fs.writeFileSync(versionFilePath, '', 'utf8');
    }
    let res = version.match(new RegExp(/\d{6}\.\d+/))
    if (!res) {
        version = `${year}${month}.001`;
    } else {
        const parts = res[0].split('.');
        const count = parseInt(parts[1]);
        version = `${parts[0]}.${(count + 1).toString().padStart(3, '0')}`;
    }

    fs.writeFileSync(versionFilePath, `module.exports = '${version}';`, 'utf8');

    console.log(`Generated version: ${version}`);
}

generateVersion();
