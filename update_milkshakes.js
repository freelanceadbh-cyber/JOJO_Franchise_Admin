const fs = require('fs');

function updateMilkshakes(filepath) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Find the milkshakes section
    const startStr = '<div class="flavor-category milkshakes-section" id="milkshakes">';
    const endStr = '</section>';
    
    const startIndex = content.indexOf(startStr);
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
        let before = content.substring(0, startIndex);
        let milkshakesBlock = content.substring(startIndex, endIndex);
        let after = content.substring(endIndex);
        
        // Update prices to ₹150
        milkshakesBlock = milkshakesBlock.replace(/<span class="flavor-price">₹\d+<\/span>/g, '<span class="flavor-price">₹150</span>');
        
        // Update description to include (300ml)
        milkshakesBlock = milkshakesBlock.replace(/milkshake<\/div>/g, 'milkshake (300ml)</div>');
        
        const newContent = before + milkshakesBlock + after;
        fs.writeFileSync(filepath, newContent, 'utf-8');
        console.log(`Successfully updated ${filepath}`);
    } else {
        console.log(`Could not find milkshakes section in ${filepath}`);
    }
}

updateMilkshakes('d:\\Projects\\JoJo Ice creams\\index.html');
updateMilkshakes('d:\\Projects\\JoJo Ice creams\\Ice-cream-Shop\\index.html');
