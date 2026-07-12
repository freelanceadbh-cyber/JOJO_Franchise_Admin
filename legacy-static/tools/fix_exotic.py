import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace remaining emojis with image tags for Exotic category
replacements = [
    (r'<div class="flavor-image">[^<]*</div>\s*<div class="flavor-info">\s*<div class="flavor-name">Exotic Choco Almond Fudge</div>',
     '<div class="flavor-image"><img src="choco Almond Fudge.jpeg" alt="Exotic Choco Almond Fudge Ice Cream"></div>\n                    <div class="flavor-info">\n                        <div class="flavor-name">Exotic Choco Almond Fudge</div>'),
]

for old_pattern, new_pattern in replacements:
    content = re.sub(old_pattern, new_pattern, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
