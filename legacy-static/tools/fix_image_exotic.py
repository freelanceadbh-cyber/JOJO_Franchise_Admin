with open('index.html', 'rb') as f:
    content = f.read()

# Find the problematic section and replace it
# Look for the first flavor card's image div and replace any corrupted content
import re

# Find and replace the first flavor image in Exotic category
# Look for the pattern after "<!-- Exotic Category -->" and before "Chocolate Bourbon"
pattern = rb'<div class="flavor-image">[^<]{0,10}</div>\s+<div class="flavor-info">\s+<div class="flavor-name">Exotic Choco Almond Fudge</div>'
replacement = b'<div class="flavor-image"><img src="choco Almond Fudge.jpeg" alt="Exotic Choco Almond Fudge Ice Cream"></div>\n                    <div class="flavor-info">\n                        <div class="flavor-name">Exotic Choco Almond Fudge</div>'

content = re.sub(pattern, replacement, content)

with open('index.html', 'wb') as f:
    f.write(content)

print("Fixed the image!")
