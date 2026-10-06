# NOTES.md

## Summary of changes

1. **SQL operator precedence** — Missing parentheses caused `archived = FALSE` and the status filter to apply to only one LIKE branch. Fixed: `AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term)`. Applied in `TaskRepository.java` and both `db/` files.

2. **Artificial API delay** — A `Thread.sleep` (up to 1 000 ms) disguised as "complexity estimation" removed from `TaskController.java`.

3. **Search debounce** — Every keystroke fired a request. Added a 350 ms `useDebounce` hook so only the settled value fetches.

4. **Pagination reset** — Changing filters on page 2+ returned empty results. `setPage(1)` now fires with every query or status change.

5. **Race condition / loading freeze** — Added `AbortController` so stale responses cannot overwrite newer ones. Added the missing `setLoading(false)` in `.catch`.

6. **Invalid status -> 400** — `TaskStatus.valueOf("BOGUS")` caused an unhandled 500. Now returns 400.

7. **Invalid pagination -> sanitised** — `page=0` or `pageSize=-1` caused `IndexOutOfBoundsException`. Guards clamp page >= 1 and pageSize to [1, 200].

8. **Oracle `archived` field** — `task_record` type and both SELECTs omitted `archived`. Added to all three locations.

---

## What was not changed and why

- **In-memory pagination** — All matching rows load into Java memory before slicing. Fixing requires Spring Data `Pageable` — an architectural change outside the patch scope. **Biggest remaining risk.**
- **LIKE wildcards** — `%`/`_` act as SQL wildcards in search. No injection risk; negligible with current data.
- **Logging and config** — `System.out.println`, H2 console, hardcoded CORS: hygiene left for a future pass.

---

## AI tools used

Antigravity (Claude Sonnet) and ChatGPT were used for inspection, analysis, implementation, and verification. I reviewed every diff and ran each fix against the live API. Handwritten notes were written independently to confirm my understanding of each root cause.