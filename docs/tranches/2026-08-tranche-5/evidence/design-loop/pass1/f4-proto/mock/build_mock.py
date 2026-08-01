#!/usr/bin/env python3
"""Inline the three self-hosted font subsets into the F4 mocks → one self-contained file each.

Usage: python3 build_mock.py            (builds every *.tpl.html beside it)
Fonts are copied verbatim from web/frontend/src/assets/fonts/ (17,236 B for all three).
"""
import base64, pathlib, sys

here = pathlib.Path(__file__).parent
fonts = {
    "__FRAUNCES__": "fraunces-subset.woff2",
    "__FIRACODE__": "firacode-subset.woff2",
    "__PATRICKHAND__": "patrickhand-subset.woff2",
}
data = {}
for token, name in fonts.items():
    raw = (here / "fonts" / name).read_bytes()
    data[token] = "data:font/woff2;base64," + base64.b64encode(raw).decode()

for tpl in sorted(here.glob("*.tpl.html")):
    html = tpl.read_text()
    for token, uri in data.items():
        html = html.replace(token, uri)
    out = here / tpl.name.replace(".tpl.html", ".html")
    out.write_text(html)
    print(f"{out.name}: {len(html):,} B")
