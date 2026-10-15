"""Build native textured display fonts (fonttools + brotli; ordinary builds use WOFF2).

python scripts/subset-print-fonts.py --chinese Huiwen.ttf --latin SpecialElite-Regular.ttf
Inputs and licenses are recorded in src/fonts/PRINT-PROVENANCE.json.
All displayed page titles are embedded; rerun after changing titles or adding cases.
No texture is synthesized. Missing title characters stop generation.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument('--chinese', required=True)
parser.add_argument('--latin', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
titles = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', """
import {siteCopy} from './src/site-copy.js';
import {projects} from './src/content.js';
import {localiseProjects} from './src/english.js';
const titles = ['heroTitle','aboutTitle','worksTitle','notFoundTitle']
  .flatMap(key => Object.values(siteCopy[key]).flat());
for (const locale of ['zh','en']) titles.push(...localiseProjects(projects,locale).map(p => p.title));
console.log(JSON.stringify(titles));
"""], cwd=root, text=True))
text = ''.join(titles)
is_latin = lambda c: 32 <= ord(c) <= 0x024F or 0x2000 <= ord(c) <= 0x206F
report = {}
for role, source, family in [('chinese', args.chinese, 'Ying Print Chinese'), ('latin', args.latin, 'Ying Print Typewriter')]:
    font = TTFont(source)
    cmap = font.getBestCmap()
    needed = {c for c in text if not is_latin(c)} if role == 'chinese' else {c for c in text if is_latin(c)}
    missing = needed.difference(map(chr, cmap))
    assert not missing, f'{role}: missing title characters {sorted(missing)}'
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
    report[role] = {'original': original, 'input_sha256': hashlib.sha256(Path(source).read_bytes()).hexdigest(), 'bytes': output.stat().st_size, 'title_coverage': 'complete', 'characters': len(font.getBestCmap())}
report['titles'] = titles
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
