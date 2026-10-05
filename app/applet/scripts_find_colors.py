import os
import re

components_dir = 'src/components'
for fname in sorted(os.listdir(components_dir)):
    if not fname.endswith('.tsx'):
        continue
    path = os.path.join(components_dir, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for button groups: e.g. <div ...> containing multiple <button
    # Split by <div and find buttons inside
    divs = re.split(r'<div\b', content)
    for div_block in divs:
        # get up to next closing </div> or max 1500 chars
        block = div_block[:1500]
        btns = re.findall(r'<button\b[^>]*>', block)
        if len(btns) >= 2:
            colors = []
            for b in btns:
                found = re.findall(r'\b(?:bg|border|text)-(red|rose|pink|purple|indigo|blue|sky|cyan|teal|emerald|green|yellow|amber|orange)-\d+', b)
                colors.extend(found)
            unique_c = set(colors)
            if len(unique_c) >= 3:
                print(f'{fname}: cluster with colors {sorted(list(unique_c))}')
                for b in btns[:4]:
                    # print class of button
                    cls = re.search(r'className=(?:\{`([^`]+)`\}|"([^"]+)")', b)
                    if cls:
                        print('   btn:', (cls.group(1) or cls.group(2))[:90])
