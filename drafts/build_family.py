#!/usr/bin/env python3
"""
Build the family-friendly, per-class first grade schedule (DRAFT — not published).

Assembles each of the six classes' actual day by combining:
  - the shared spine (breakfast, lunch, recess, specials, pack up, transitions),
    verified identical across all three subject rooms
  - the block segments from whichever subject that class is in during
    Block 1 / 2 / 3, per the "Rotation Order" sheet (STUDENT PERSPECTIVE)
    of SY26-27 Master Schedule.xlsx

Deliberately contains NO student names.
"""
import json, html, pathlib

HERE = pathlib.Path(__file__).parent
PROJ = pathlib.Path("/Users/mekocewalker/Library/CloudStorage/Dropbox/coding-projects/bancroft-newsletter-astro")
OUT  = PROJ / "drafts" / "family-schedule.html"

SUBJ = json.load(open(HERE / "schedule_data.json"))

# ── block windows, in minutes since midnight ──────────────────────────
BLOCKS = {"b1": [(545, 620)], "b2": [(625, 685), (725, 745)], "b3": [(750, 775), (860, 910)]}

def block_of(s, e):
    for b, rs in BLOCKS.items():
        for a, z in rs:
            if s >= a and e <= z:
                return b
    return None

# ── the six classes. Rotation verified against the workbook. ──────────
CLASSES = [
    dict(id="cartagena", name="Cartagena", teacher="Colon",        triad=1, flag="cartagena.svg",
         rot={"b1": "math", "b2": "sla",  "b3": "ela"}),
    dict(id="colombia",  name="Colombia",  teacher="E. Chapoñan",  triad=1, flag="colombia.svg",
         rot={"b1": "sla",  "b2": "ela",  "b3": "math"}),
    dict(id="espana",    name="España",    teacher="Hopkins",      triad=1, flag="espana.svg",
         rot={"b1": "ela",  "b2": "math", "b3": "sla"}),
    dict(id="venezuela", name="Venezuela", teacher="Ortiz",        triad=2, flag="venezuela.svg",
         rot={"b1": "math", "b2": "sla",  "b3": "ela"}),
    dict(id="managua",   name="Managua",   teacher="J. Rivera",    triad=2, flag="managua.svg",
         rot={"b1": "sla",  "b2": "ela",  "b3": "math"}),
    dict(id="dr",        name="DR",        teacher="Alvarez",      triad=2, flag="dr.svg",
         rot={"b1": "ela",  "b2": "math", "b3": "sla"}),
]

SUBJ_LABEL = {
    "math": dict(en="Math",                   es="Matemáticas"),
    "sla":  dict(en="Spanish Language Arts",  es="Lectoescritura en Español"),
    "ela":  dict(en="English Language Arts",  es="Lectoescritura en Inglés"),
}

# ── family wording. `real` is the program name teachers use. ──────────
L = {
  "Breakfast":            dict(en="Breakfast",            es="Desayuno"),
  "Strong Start":         dict(en="Strong Start",         es="Comienzo Fuerte",
                               noteEn="Morning meeting and greeting",
                               noteEs="Reunión y saludo de la mañana"),
  "Fluidez":              dict(en="Math Fluency",         es="Fluidez Matemática", real="Fluidez",
                               noteEn="Quick number practice to warm up",
                               noteEs="Práctica rápida de números para empezar"),
  "Launch":               dict(en="Lesson Start",         es="Inicio de la Lección", real="Launch",
                               noteEn="The teacher introduces today's math idea",
                               noteEs="La maestra presenta la idea de matemáticas del día"),
  "Learn Rotation 1":     dict(en="Learning Stations 1",  es="Estaciones 1", real="Learn Rotation 1",
                               noteEn="Small groups rotate through math activities",
                               noteEs="Grupos pequeños rotan por actividades de matemáticas"),
  "Learn Rotation 2":     dict(en="Learning Stations 2",  es="Estaciones 2", real="Learn Rotation 2",
                               noteEn="Small groups rotate through math activities",
                               noteEs="Grupos pequeños rotan por actividades de matemáticas"),
  "Land":                 dict(en="Wrap-Up",              es="Cierre", real="Land",
                               noteEn="The class shares what they figured out",
                               noteEs="La clase comparte lo que descubrió"),
  "Estudio de Palabras":  dict(en="Spanish Word Study",   es="Estudio de Palabras", real="Estudio de Palabras",
                               noteEn="Spelling and word patterns in Spanish",
                               noteEs="Ortografía y patrones de palabras en español"),
  "Heggerty":             dict(en="Sound Practice",       es="Práctica de Sonidos", real="Heggerty",
                               noteEn="Hearing and playing with the sounds in words",
                               noteEs="Escuchar y jugar con los sonidos de las palabras"),
  "UFLI":                 dict(en="Phonics",              es="Fonética", real="UFLI",
                               noteEn="Letters, sounds and sounding out words",
                               noteEs="Letras, sonidos y cómo pronunciar palabras"),
  "ARC Close Reading":    dict(en="Close Reading",        es="Lectura Detallada", real="ARC Close Reading",
                               noteEn="Reading a text carefully, more than once",
                               noteEs="Leer un texto con atención, más de una vez"),
  "NBSG":                 dict(en="Small Group",          es="Grupo Pequeño", real="NBSG",
                               noteEn="Extra practice in a small group with the teacher",
                               noteEs="Práctica adicional en grupo pequeño con la maestra"),
  "Lunch":                dict(en="Lunch",                es="Almuerzo"),
  "Recess":               dict(en="Recess",               es="Recreo"),
  "Specials":             dict(en="Specials",             es="Especiales"),
  "Pack Up":              dict(en="Pack Up & Dismissal",  es="Recoger y Salida"),
  "Transition":           dict(en="Moving",               es="Transición"),
}

SPECIALS_ROT = json.load(open(PROJ / "src/data/config.json"))["rotations"]
SPECIALS_TR  = json.load(open(PROJ / "src/data/config.json"))["subjectTranslations"]
SPECIALS_IC  = json.load(open(PROJ / "src/data/config.json"))["subjectIcons"]
WEEK         = json.load(open(PROJ / "src/data/weeks/2026-08-24.json"))

# ── assemble each class's real day ────────────────────────────────────
SPINE = [r for r in SUBJ["math"] if block_of(r["start"], r["end"]) is None and r["start"] >= 515]

def day_for(cls):
    out = []
    for r in SPINE:
        out.append(dict(r, src="spine"))
    for b, rs in BLOCKS.items():
        subj = cls["rot"][b]
        for a, z in rs:
            for r in SUBJ[subj]:
                if r["start"] >= a and r["end"] <= z:
                    out.append(dict(r, src=subj, block=b))
    out.sort(key=lambda r: r["start"])
    return out

DAYS = {c["id"]: day_for(c) for c in CLASSES}

# sanity: every class's day must be contiguous 515→915 and total 230 instructional min
for c in CLASSES:
    d = DAYS[c["id"]]
    assert d[0]["start"] == 515 and d[-1]["end"] == 915, c["name"]
    for i in range(len(d) - 1):
        assert d[i]["end"] == d[i + 1]["start"], f'{c["name"]} gap at {d[i]["end"]}'
    core = sum(r["end"] - r["start"] for r in d if r.get("block"))
    assert core == 230, f'{c["name"]} core={core}'
print("all six class days verified: contiguous 8:35–3:15, 230 core minutes each")

DATA = dict(
    classes=[{k: v for k, v in c.items()} for c in CLASSES],
    days=DAYS, labels=L, subjects=SUBJ_LABEL,
    specialsRot=SPECIALS_ROT, specialsTr=SPECIALS_TR, specialsIcons=SPECIALS_IC,
    week=dict(date=WEEK["date"], specials=WEEK["specials"]),
)

TPL = open(HERE / "family_template.html", encoding="utf-8").read()
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(TPL.replace("/*__DATA__*/", json.dumps(DATA, ensure_ascii=False)), encoding="utf-8")
print("wrote", OUT, OUT.stat().st_size, "bytes")
