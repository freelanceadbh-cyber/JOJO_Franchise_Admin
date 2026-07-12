import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the corrupted emoji character with proper image tag for Black Forest
# Find the Black Forest section and replace the emoji div
content = re.sub(
    r'<div class="flavor-image">[^<]*</div>\s*<div class="flavor-info">\s*<div class="flavor-name">Black Forest</div>',
    '<div class="flavor-image"><img src="Black Forest.jpeg" alt="Black Forest Ice Cream"></div>\n                    <div class="flavor-info">\n                        <div class="flavor-name">Black Forest</div>',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
