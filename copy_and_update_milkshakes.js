const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\nandh\\.gemini\\antigravity\\brain\\7099f7fc-3b19-4b84-8f37-6f31b6b2b50f';
const destDirs = [
    'd:\\Projects\\JoJo Ice creams\\images\\milkshakes',
    'd:\\Projects\\JoJo Ice creams\\Ice-cream-Shop\\assets\\images\\milkshakes'
];

const images = {
    'vanilla_milkshake': 'vanilla_milkshake_1778826477913.png',
    'strawberry_milkshake': 'strawberry_milkshake_1778826553254.png',
    'chocolate_milkshake': 'chocolate_milkshake_1778826658986.png',
    'caramel_milkshake': 'caramel_milkshake_1778826723440.png',
    'berry_milkshake': 'berry_milkshake_1778826788714.png',
    'mango_milkshake': 'mango_milkshake_1778826811078.png',
    'exotic_milkshake': 'exotic_milkshake_1778826932612.png',
    'pista_milkshake': 'pista_milkshake_1778827033747.png'
};

const mapping = {
    'VANILLA': 'vanilla_milkshake',
    'TENDER COCONUT': 'vanilla_milkshake',
    'VANILLA CHOCO CHIP': 'vanilla_milkshake',
    'MEETHAPAAN': 'vanilla_milkshake',
    'STRAWBERRY': 'strawberry_milkshake',
    'COTTON CANDY': 'strawberry_milkshake',
    'PINK GUAVA': 'strawberry_milkshake',
    'CHOCOLATE': 'chocolate_milkshake',
    'CHOCOLATE BROWNIE': 'chocolate_milkshake',
    'CHOCOLATE BOURBON': 'chocolate_milkshake',
    'HAZELNUT NUTELLA': 'chocolate_milkshake',
    'COFFEE ALMOND FUDGE': 'chocolate_milkshake',
    'OREO FREAK': 'chocolate_milkshake',
    'CHOCO ALMOND FUDGE': 'chocolate_milkshake',
    'BUTTERSCOTCH': 'caramel_milkshake',
    'SALTED CARAMEL': 'caramel_milkshake',
    'TIRAMISU': 'caramel_milkshake',
    'BASUNDHI': 'caramel_milkshake',
    'ARABIAN DATES': 'caramel_milkshake',
    'FIG & HONEY': 'caramel_milkshake',
    'BLACK CURRANT': 'berry_milkshake',
    'BERRY BLAST': 'berry_milkshake',
    'BERRYLICIOUS': 'berry_milkshake',
    'BLUE BERRY': 'berry_milkshake',
    'RED WINE BERRY': 'berry_milkshake',
    'ALPHONSO MANGO': 'mango_milkshake',
    'JACKFRUIT': 'mango_milkshake',
    'RAJBHOG': 'mango_milkshake',
    'KULFI MALAI': 'mango_milkshake',
    'BLACK FOREST': 'exotic_milkshake',
    'SPANISH DELIGHT': 'exotic_milkshake',
    'COOKIES & CREAM': 'exotic_milkshake',
    'PISTA': 'pista_milkshake',
    'GULKAND': 'pista_milkshake'
};

// Create dirs and copy images
destDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    for (const [key, filename] of Object.entries(images)) {
        const srcPath = path.join(srcDir, filename);
        const destPath = path.join(dir, `${key}.png`);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
        } else {
            console.error(`Source image missing: ${srcPath}`);
        }
    }
});

function updateHTML(filepath, imgPrefix) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Find the milkshakes section
    const startStr = '<div class="flavor-category milkshakes-section" id="milkshakes">';
    const endStr = '</section>';
    
    const startIndex = content.indexOf(startStr);
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
        let milkshakesBlock = content.substring(startIndex, endIndex);
        
        // Use regex to find flavor-name and update the previous img tag
        for (const [flavorName, imgKey] of Object.entries(mapping)) {
            const regex = new RegExp(`(<div class="flavor-image"><img src=")[^"]+(" alt="[^"]+" onerror="this\\.src='[^']+'"><\\/div>\\s*<div class="flavor-info">\\s*<div class="flavor-name">${flavorName}<\\/div>)`, 'g');
            milkshakesBlock = milkshakesBlock.replace(regex, `$1${imgPrefix}${imgKey}.png$2`);
        }
        
        let newContent = content.substring(0, startIndex) + milkshakesBlock + content.substring(endIndex);
        fs.writeFileSync(filepath, newContent, 'utf-8');
        console.log(`Successfully updated images in ${filepath}`);
    } else {
        console.log(`Could not find milkshakes section in ${filepath}`);
    }
}

updateHTML('d:\\Projects\\JoJo Ice creams\\index.html', 'images/milkshakes/');
updateHTML('d:\\Projects\\JoJo Ice creams\\Ice-cream-Shop\\index.html', 'assets/images/milkshakes/');
