import re

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Replace Vanilla Cookies image
content = re.sub(
    r'<div class="flavor-image">[^<]*</div>\s*<div class="flavor-info">\s*<div class="flavor-name">Vanilla Cookies</div>',
    '<div class="flavor-image"><img src="Vannila cookies.jpeg" alt="Vanilla Cookies Ice Cream"></div>\n                    <div class="flavor-info">\n                        <div class="flavor-name">Vanilla Cookies</div>',
    content
)

# Replace Vanilla Berry image
content = re.sub(
    r'<div class="flavor-image">[^<]*</div>\s*<div class="flavor-info">\s*<div class="flavor-name">Vanilla Berry</div>',
    '<div class="flavor-image"><img src="Vannila Berry.jpeg" alt="Vanilla Berry Ice Cream"></div>\n                    <div class="flavor-info">\n                        <div class="flavor-name">Vanilla Berry</div>',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Regular Exotic images!")
