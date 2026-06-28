# 09 · Card & Media Creator

A **Card** is a media inject — something shown to participants (a social post, a news clip, a phone call, a photo, a map). Cards are built on the **same Konva canvas in single-frame mode** — **not** a second editor (file 06).

---

## 1. Card flavours

| Flavour | What it is |
|---|---|
| **Plain** | Image / text / video / **map** (postcode → OpenStreetMap → draggable pin) |
| **Social** | A social-media post (generic-but-legible template) |
| **News / Article** | A news clip / headline / article |
| **Message / Comms** | A text-message / chat thread |
| **Phone call** | A caller photo + voice clip + effect + transcript (see §5) |

## 2. Full editable detail set (social/news)

Match what mock-post tools expose, so cards are convincing:
- Avatar · handle/username · display name · **verified tick**
- Post text · image/video
- Likes · comments (with their own avatars) · shares · timestamp
- Light/dark mode
- Platform chrome (generic)

## 3. Social/news copyright stance (LOCKED)

- Ship **generic-but-instantly-legible** templates (e.g. *PhotoShare / Chirp / News24*) with **own iconography** — **not** pixel-clones of Instagram/Facebook/X.
- **No real logos / wordmarks / exact trade dress.** That's the legal risk + a procurement red flag for police/fire/gov buyers.
- Fidelity is a **dial the org controls**; recommend an IP check before going closer.

## 4. Destination

A card can be sent to:
- **The Stage** — a pop-up over the scene (closable), **resizable**, **corner-placeable**.
- **A participant phone** — the second screen (file 12).

## 5. Audio cards + transcript (comms)

For a phone call / radio message:
- A **caller row** (avatar + name + "incoming call · 0:42").
- A **waveform** of the voice clip; **phone effect** / **radio effect** toggle; **fade in/out**.
- A **Transcript** panel you can **drop in beside it** as a component — scrollable, so participants can read along (e.g. "Hayes: Control, we've got a second casualty round the rear…").
- Built in Studio, **or** added in a Classroom TDE (add sound + transcript to a piece of footage).

> **Layout matters:** every card — social, footage, this call — can be **resized and corner-placed** on the participant's screen, and the transcript is an **addable component**. Same drag-resize-position rules as everything else.

## 6. Export

- Export a card as **PNG** (for use in TDEs) or **video**.
- Cards are **created in Studio and feed everywhere** — CCTV footage, mobile footage, a Twitter-style feed, a news clip. The studio creates all assets; the rest of the platform consumes them.

## 7. "Live card" (instructor edits live)

A **live card** is a running Studio view the instructor edits **during** a session, syncing to participants in real time. It **reuses the existing realtime event loop** (`STUDIO_EVENT_TRIGGERED` with layer states — file 14) — **not** a new build.
