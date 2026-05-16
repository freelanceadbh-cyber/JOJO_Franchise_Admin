const fs = require('fs');

function fixLayout(filepath) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Find the milkshakes section
    const startStr = '<div class="flavor-category milkshakes-section" id="milkshakes">';
    const endStr = '</section>';
    
    const startIndex = content.indexOf(startStr);
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
        let milkshakesBlock = content.substring(startIndex, endIndex);
        
        // Remove the first <div class="flavors-grid"> after the header
        milkshakesBlock = milkshakesBlock.replace(/<\/div>\s*<div class="flavors-grid">\s*<!-- Regular Category -->/, '</div>\n\n            <!-- Regular Category -->');
        
        // Remove the last </div> before </section>
        milkshakesBlock = milkshakesBlock.replace(/<\/div>\s*<\/div>\s*$/, '</div>\n        ');
        
        let newContent = content.substring(0, startIndex) + milkshakesBlock + content.substring(endIndex);
        fs.writeFileSync(filepath, newContent, 'utf-8');
        console.log(`Successfully fixed layout in ${filepath}`);
    } else {
        console.log(`Could not find milkshakes section in ${filepath}`);
    }
}

fixLayout('d:\\Projects\\JoJo Ice creams\\index.html');
fixLayout('d:\\Projects\\JoJo Ice creams\\Ice-cream-Shop\\index.html');
