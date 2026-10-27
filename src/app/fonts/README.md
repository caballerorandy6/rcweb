# Fonts

Self-hosted through `next/font/local` (see `src/app/layout.tsx`).

## InterVF-latin.woff2

Variable Inter trimmed to what the site renders: Basic Latin (U+0000-00FF,
enough for the Spanish accents in the copy), typographic punctuation
(U+2000-206F), € ™ and the `wght` axis restricted to 400-700. Symbols outside
that range (→, ∞) come from the system font, as they always did. Regenerate
from the full `InterVariable.woff2` (https://rsms.me/inter/) with fontTools:

```bash
pip install fonttools brotli
python3 - <<'PY'
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer
UNICODES = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+221E,U+FEFF,U+FFFD"
font = instancer.instantiateVariableFont(TTFont("InterVariable.woff2"), {"wght": (400, 700)})
font.flavor = None; font.save("inter-instanced.ttf")  # reopen: the subsetter needs a fully loaded font
font = TTFont("inter-instanced.ttf")
opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["*"]; opts.name_IDs = ["*"]; opts.notdef_outline = True
s = subset.Subsetter(opts); s.populate(unicodes=subset.parse_unicodes(UNICODES)); s.subset(font)
font.flavor = "woff2"; font.save("InterVF-latin.woff2")
PY
```

## Iceland.woff2

Display face for headings, weight 400 only.
