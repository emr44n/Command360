# 21 · Responsive Design & Device Targets

*Addition to the spec pack. Where each part of the product must work well — and where it deliberately doesn't.*

## 1. Primary targets: desktop + tablet
Customers are organisations using **PCs and tablets**. All authoring — Command Studio, Command Classroom, the Card/Media creator — is built and tested for **desktop and tablet (landscape)**. Tablet is the **floor** for editing.

## 2. Mobile (phone): deliberately limited
Phones support a **light** set only:
- ✅ Login, dashboard, **analytics/reports**, browse/preview **templates & community**, light knowledge-base/text edits, account/settings, joining/viewing.
- ❌ Heavy canvas authoring, timeline editing, running live slideshows — **not** supported on phone.
- When a phone user opens an authoring screen, show a friendly **"best on tablet or desktop"** notice instead of a broken cramped editor.

**Why:** authoring is information-dense; forcing the full editor onto a phone is poor UX for high cost and little value (Canva itself heavily simplifies its mobile authoring). The admin/knowledge tasks people *do* need on the go are supported; the rest waits for a bigger screen.

## 3. Build & test
Verify layouts at **desktop + tablet** breakpoints each phase (no overflow/overlap; grids collapse sensibly). Phone gets the limited set above. This is a cross-cutting requirement, checked in every phase that ships UI.
