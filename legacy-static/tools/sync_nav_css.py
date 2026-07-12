import re

def get_file_content(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file_content(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Extract nav CSS from index.html
index_html = get_file_content('index.html')
match = re.search(r'(/\* ===== NAVIGATION BAR ===== \*/.*?)(?:/\* ===== HERO SECTION ===== \*/)', index_html, re.DOTALL)
if not match:
    print("Could not find nav CSS in index.html")
    exit(1)
nav_css = match.group(1).strip() + "\n\n        "

def replace_nav_css(file_path, end_marker):
    content = get_file_content(file_path)
    # The regex needs to replace everything between NAVIGATION BAR and the end_marker
    pattern = r'(/\* ===== NAVIGATION BAR ===== \*/.*?)(?=' + re.escape(end_marker) + r')'
    new_content = re.sub(pattern, nav_css, content, flags=re.DOTALL)
    if new_content != content:
        write_file_content(file_path, new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes made to {file_path}")

replace_nav_css('branch.html', '/* ===== BRANCH SECTION ===== */')
replace_nav_css('contact.html', '/* Main Content */')
replace_nav_css('franchise.html', '/* ===== COMMON COMPONENTS ===== */')

print("Done")
