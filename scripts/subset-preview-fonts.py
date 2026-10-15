"""Rebuild the three licensed preview fonts; not required for normal npm builds.

pip install fonttools brotli
python scripts/subset-preview-fonts.py --notes /path/to/Xiaolai-Regular.ttf
Noto CJK inputs below are Debian's installed SC collections, font index 2.
"""
from pathlib import Path
import argparse
import json
from fontTools.ttLib import TTFont
from fontTools import subset

parser = argparse.ArgumentParser()
parser.add_argument('--notes', required=True)
parser.add_argument('--serif', default='/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc')
parser.add_argument('--sans', default='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
text = ''.join(path.read_text() for path in (root / 'src').glob('*.js'))
characters = {c for c in text if ord(c) >= 32} | {chr(c) for c in range(32, 127)}
report = {}
for role, filename, index in [('serif', args.serif, 2), ('sans', args.sans, 2), ('notes', args.notes, None)]:
    font = TTFont(filename, fontNumber=index) if index is not None else TTFont(filename)
    original = font['name'].getDebugName(6)
    cmap = font.getBestCmap()
    critical = set('猫猫观察笔记把植物变成可读的信息一些兴趣和没停止的思考陪你慢慢看也画片段草图以及小事预览中已固定')
    assert not critical.difference(chr(c) for c in cmap), (role, 'missing preview characters')
    options = subset.Options()
    options.recalc_timestamp = False
    sub = subset.Subsetter(options=options)
    sub.populate(text=''.join(sorted(characters)))
    sub.subset(font)
    family = 'Ying Study ' + role.title()
    for name in font['name'].names:
        if name.nameID in (1, 2, 3, 4, 6, 16, 17):
            value = 'Regular' if name.nameID in (2, 17) else family.replace(' ', '') + '-Regular' if name.nameID in (3, 6) else family
            name.string = value.encode(name.getEncoding(), errors='replace')
    font.flavor = 'woff2'
    output = root / 'src/fonts' / f'study-{role}.woff2'
    output.parent.mkdir(exist_ok=True)
    font.save(output)
    report[role] = {'original': original, 'bytes': output.stat().st_size, 'critical_character_coverage': 'complete', 'characters': len(font.getBestCmap())}
(root / 'src/fonts/PROVENANCE.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False, indent=2))
