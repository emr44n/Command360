# Command360 — Sector Knowledge Base (Index)

This is the master index for Command360's sector knowledge base. Each sector file works **backwards from the rules**: the regulation or competency framework an industry is legally required to meet → the competencies their people must develop → the scenarios they train on → how Command360 delivers that → the asset library we must build → the software features required.

That single chain feeds three jobs:
1. **SEO / content** — the pages to build so Command360 surfaces when these buyers (or their LLMs) search.
2. **Back-end asset libraries** — the imagery to generate per sector so a new "aviation" or "COMAH" account ships pre-stocked.
3. **Product features** — what the platform must do, aggregated in `MASTER_SOFTWARE_FEATURE_REQUIREMENTS.md`.

---

## The working method (apply to every sector)

> **Mandate → Competencies → Scenarios → Command360 capability → Assets → Features**

The strength of this market is that the buyers operate under *rigid, published* standards. We don't have to guess what they need to train — the regulator already told them. We map our product to that standard and the content writes itself. This is the same logic across all sectors, blue-light and industrial.

---

## Sector list & build status

| # | Sector file | Status |
|---|---|---|
| 01 | `SECTOR_01_Fire_and_Rescue.md` | ✅ Wave 1 |
| 04 | `SECTOR_04_Aviation_RFFS.md` | ✅ Wave 1 |
| 06 | `SECTOR_06_Major_Hazard_Industrial_COMAH.md` | ✅ Wave 1 |
| 02 | `SECTOR_02_Police_and_Security.md` | ✅ Wave 2 |
| 03 | `SECTOR_03_Ambulance_and_Health.md` | ✅ Wave 2 |
| 05 | `SECTOR_05_Energy_and_Utilities.md` | ✅ Wave 2 |
| 07 | `SECTOR_07_Rail_Metro_and_Transport.md` | ✅ Wave 2 |
| 08 | `SECTOR_08_Maritime_and_Ports.md` | ✅ Wave 2 |
| 09 | `SECTOR_09_Defence_and_Military.md` | ✅ Wave 2 |
| — | `MASTER_SOFTWARE_FEATURE_REQUIREMENTS.md` | ✅ Wave 1 |

(See `command360-market-outreach-intelligence.md` for the named-client roster and outreach angles per sector.)

---

## Shared sector-file template

Every sector file follows the same eight sections so the content is consistent and comparable:

1. **Snapshot** — who they are, UK target universe + counts, procurement nature, buyer/contact roles.
2. **The mandate** — the regulation(s) / standard(s) that force recurring command training. The "rigid guidelines" hook.
3. **Competencies to develop** — the actual competency areas, worked backwards from the mandate.
4. **What they train on** — scenario types.
5. **How Command360 helps** — competency → capability mapping. *This is the seed copy for the SEO pages.*
6. **Asset library required** — the specific imagery/assets to generate for this sector's account type.
7. **Training landscape** — providers, awarding bodies and courses currently serving the sector (informs positioning + keywords).
8. **SEO page targets** — the page cluster + keyword themes for the sector.

---

## SEO page architecture (hub & spoke)

For each sector, build one **hub page** and a cluster of **spoke pages**. Spokes are where the long-tail and LLM-retrieval wins live, because they match the exact competency or scenario language a buyer uses.

```
/sectors/{sector}                     ← HUB (sector overview + how we help)
  /sectors/{sector}/{competency}      ← SPOKE per competency cluster
  /scenarios/{sector}/{scenario}      ← SPOKE per scenario type
  /solutions/{role}                   ← SPOKE per buyer role (e.g. training manager)
  /compliance/{framework}             ← SPOKE per regulation (CAP 699, COMAH, JESIP…)
```

**Keyword logic:** combine `{sector/role}` + `{competency or scenario}` + `{intent}`. Examples:
- "incident command training software", "tactical decision exercise platform"
- "RFFS command training", "airport fire tabletop exercise software"
- "COMAH emergency exercise software", "major incident tabletop tool"
- "JESIP multi-agency exercise platform", "control room decision-making training"

**Copy rule for every page:** state the buyer's competency/obligation in their own words, then one line on how Command360 lets them build that exercise once, reuse it, and capture the evidence. Avoid generic "VR training" language — match the regulation's vocabulary.

---

## Asset library convention (back-end)

So a new account can ship pre-stocked by sector, store assets under a predictable path and tag them. The platform's existing vocabulary applies (**Library** = the shelf, **Look** = a saved visual variant, **Combo** = a multi-layer object, **Hotspot** = clickable region).

```
library/{sector}/{category}/{item}--{state}.{ext}
```

**Universal categories (every sector):**
- `backplate/` — the scene/environment base images (the "stage").
- `hazard/` — fire, smoke, spill, gas cloud, structural collapse (transparent overlays).
- `casualty/` — injured persons, varying severity/position (transparent).
- `asset/` — vehicles, plant, equipment specific to the sector.
- `responder/` — crews, PPE, appliances, partner agencies.
- `prop/` — signage, cordons, equipment, tactical markers.
- `effect/` — animated transparent loops (flame, smoke drift, water, sparks) reused across sectors.

`--state` suffix carries the variant: `--early`, `--developed`, `--knockdown`, `--night`, `--rain`, etc. → these become **Looks** the instructor switches between live.

**Reuse note:** `effect/`, `casualty/`, `responder/` and generic `prop/` assets are largely cross-sector — build once, reuse everywhere. Only `backplate/`, `hazard/` and `asset/` are genuinely sector-specific. That keeps the per-sector content effort small.

---

*Compiled June 2026. Counts are planning estimates; verify framework details before publishing public copy.*
