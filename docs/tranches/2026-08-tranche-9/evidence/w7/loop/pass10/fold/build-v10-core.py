#!/usr/bin/env python3
"""Assemble registry-v10.core.json from the four section folds on disk + the assembler's fields.
Reads only; writes one file. Never pastes the folds by hand."""
import json, os, sys, hashlib

ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion"
P10 = f"{ROOT}/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10"
FOLD = f"{P10}/fold"
ASM = f"{ROOT}/.claude/t9-scratch/work/pass10/fold/asm"
OUT = f"{P10}/registry-v10.core.json"

keys = {"g10": "s10", "g3-4": "s3s4", "g11": "s11", "g13-7-12": "s13s7s12"}
families, sections, charters, foldNotes = [], [], [], {}
for g, k in keys.items():
    p = f"{FOLD}/{g}.json"
    d = json.load(open(p))
    families += d["families"]
    sections += d["sectionConvergence"]
    for c in d.get("charterFiles", []):
        rel = c.replace(ROOT + "/", "")
        charters.append(rel)
    foldNotes[k] = d["notes"]
    print(f"{g}: {len(d['families'])} families, {len(d['sectionConvergence'])} sections, {len(d.get('charterFiles', []))} charters, notes {len(d['notes'])} B")

ids = [f["id"] for f in families]
assert len(ids) == 20 and len(set(ids)) == 20, ids
assert len(sections) == 8, len(sections)
for c in charters:
    assert os.path.isfile(f"{ROOT}/{c}"), c
assert len(charters) == 15, len(charters)  # VERB (banked) and WALK (retired) have none
statuses = {}
for f in families:
    statuses.setdefault(f["status"], []).append(f["id"])
print("statuses:", {k: len(v) for k, v in statuses.items()})
assert len(statuses["ALIVE"]) == 15 and len(statuses["BANKED"]) == 2 and len(statuses["RETIRED"]) == 3, statuses

fields = json.load(open(f"{ASM}/assembler-fields.json"))
core = {
    "pass": 10,
    "converged": False,
    "cleanPassStreak": 0,
    "earliest100": 12,
    "withheld": fields["withheld"],
    "families": families,
    "sectionConvergence": sections,
    "charters": charters,
    "foldNotes": foldNotes,
    "notes": fields["notes"],
}
s = json.dumps(core, indent=1, ensure_ascii=False)
open(OUT, "w").write(s + "\n")
back = json.load(open(OUT))
assert back["pass"] == 10 and len(back["families"]) == 20 and len(back["sectionConvergence"]) == 8
forb = ["scratchpad", "/private/tmp", "/tmp/", ".claude/t9-scratch"]
hits = {w: s.count(w) for w in forb}
print("forbidden-path counts:", hits)
print("bytes", len(s.encode()), "sha1", hashlib.sha1(open(OUT, "rb").read()).hexdigest()[:8])
print("leaders:", [(x["section"], x["leader"], x["convergence"], len(x["gaps"])) for x in sections])
print("numbers:", [(f["id"], f["status"], f["convergence"]) for f in families])
