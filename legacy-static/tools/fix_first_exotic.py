with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Replace the problematic line - find "Choco Almond Fudge" without "Exotic" prefix
# and replace the preceding emoji/corrupted character
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'Choco Almond Fudge' in line and 'Exotic' not in line:
        # Found the line with missing "Exotic" prefix
        lines[i] = line.replace(' Choco Almond Fudge', 'Exotic Choco Almond Fudge')
    # Also fix the image line before it
    if i > 0 and 'flavor-name' in lines[i] and 'Exotic' not in lines[i] and 'Choco Almond' in lines[i]:
        # Look back for the image div
        for j in range(i-1, max(0, i-5), -1):
            if 'flavor-image' in lines[j]:
                lines[j] = '                    <div class="flavor-image"><img src="choco Almond Fudge.jpeg" alt="Exotic Choco Almond Fudge Ice Cream"></div>'
                break

content = '\n'.join(lines)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed the Exotic Choco Almond Fudge!")
