# 10 · Command Classroom

Taught / group delivery (Menti/Slido-style). The unit is a **TDE** (Tactical Decision Exercise). An instructor builds a TDE from Blocks, splits the cohort into Groups, and runs it live.

---

## 1. TDE = a sequence of Blocks

A TDE is a slide-deck-like sequence. Block types:

| Block | Purpose |
|---|---|
| **Content** | A slide: text, image, video, a **Card** (file 09) |
| **Poll** | Multiple-choice vote |
| **Quiz** | Scored question |
| **Word cloud** | Live word submissions |
| **Q&A** | Audience questions |
| **Survey** | Multi-question form |
| **Rating scale** | Slider/stars |
| **Open text** | Free-text submissions |
| **Decision** | Captures a decision (see §3) — the key command block |

(These map to block types already in the repo: poll, word_cloud, quiz, qna, survey, content, rating_scale, open_text, studio.)

## 2. Groups

- The cohort splits into **Groups** (Group 1 / 2 / 3…).
- A Group **self-names** at join via **QR code + a short numeric code**.
- Groups need **no accounts** — just the Group name (file 05).

## 3. Decision block (the core mechanic)

A Decision block is dropped onto a slide. Two modes:

| Mode | Behaviour |
|---|---|
| **Open** | Every participant submits on their **own phone** (Mentimeter-style). |
| **Locked** | **One device per Group** (the Group leader's) submits a **collective** decision. |

- **Countdown timer**; **auto-saves on lock**.
- Decisions are captured to the session (file 04), then **auto-wiped by default** or **kept + exported** for evidence (file 13).

## 4. Plenary reveal

After a Decision block, the instructor runs a **Plenary**:
- Pull **all Groups' decisions** onto one screen.
- **Reveal one at a time**, or show **2/3/4 in an auto-expanding grid** to compare and discuss.

## 5. Paths (per-Group routing)

- Each Group follows its own **Path** through the TDE — set at **Build** time.
- Paths can be the **same** for all Groups, or **different** (e.g. a fire Group and a police Group see the incident from their own perspective).

## 6. Flow-map (alternative build view)

- A **node-graph** view (React Flow / xyflow) as an alternative to the linear slide view.
- Good for **branching logic** — connecting slides/blocks and defining Group Paths.
- Nodes suit Classroom slide/Path branching; the **scene itself** is built on the canvas + layers, **not** nodes (file 06).

## 7. Run

- Instructor presses **Present** → the session starts → participants can join.
- **Before start:** participants see a **title/loading screen** (org logo, "Assessment loading…", the session title) — not the live content.
- During the run the instructor advances blocks, opens/closes decisions, and runs plenaries.
