"""Build native textured display fonts (fonttools + brotli; ordinary builds use WOFF2).

python scripts/subset-print-fonts.py --chinese Huiwen.ttf --latin SpecialElite-Regular.ttf
Inputs and licenses are recorded in src/fonts/PRINT-PROVENANCE.json.
Only hero copy is embedded; rerun after changing its wording. No texture is synthesized.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument('--chinese', required=True)
parser.add_argument('--latin', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
copy = (root / 'src/site-copy.js').read_text().split('heroTitle: {')[1].split('heroBio:')[0]
hero = ''.join(re.findall(r"'([^']+)'", copy))
report = {}
for role, source, family in [('chinese', args.chinese, 'Ying Print Chinese'), ('latin', args.latin, 'Ying Print Typewriter')]:
    font = TTFont(source)
    cmap = font.getBestCmap()
    needed = {c for c in hero if ord(c) > 127} if role == 'chinese' else {c for c in hero if 32 <= ord(c) < 127}
    assert not needed.difference(map(chr, cmap)), f'{role}: missing hero characters'
    original = font['name'].getDebugName(1)
    options = subset.Options()
    options.recalc_timestamp = False
    sub = subset.Subsetter(options=options)
    sub.populate(text=''.join(sorted(needed)))
    sub.subset(font)
    for name in font['name'].names:
        if name.nameID in (1, 2, 3, 4, 6, 16, 17):
            value = 'Regular' if name.nameID in (2, 17) else family.replace(' ', '') + '-Regular' if name.nameID in (3, 6) else family
            name.string = value.encode(name.getEncoding(), errors='replace')
    font.flavor = 'woff2'
    output = root / 'src/fonts' / f'print-{role}.woff2'
    font.save(output)
    report[role] = {'original': original, 'input_sha256': hashlib.sha256(Path(source).read_bytes()).hexdigest(), 'bytes': output.stat().st_size, 'hero_coverage': 'complete', 'characters': len(font.getBestCmap())}
report['sources'] = {
    'chinese': 'https://github.com/bosswnx/huiwenmincho-improved/tree/40b9dbb9bfa51bc4979b62d0dcd3bc064c5ea049',
    'chinese_author': '特里王（汇文明朝体）；bosswnx（全角标点修正）',
    'chinese_license': 'Font metadata: Public Domain; distribution repository: CC0-1.0 (HUIWEN-CC0.txt)',
    'latin': 'https://github.com/google/fonts/tree/main/apache/specialelite',
    'latin_author': 'Brian J. Bonislawsky / Astigmatic',
    'latin_license': 'Apache-2.0 (SPECIAL-ELITE-LICENSE.txt)',
    'changes': 'Subset, internal family rename, WOFF2 conversion only. Original outlines retained.'
}
(root / 'src/fonts/PRINT-PROVENANCE.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
