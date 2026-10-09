# Verification report — 8 October 2026

## Executed and passed

- Generated and inspected the HTML structure for all 15 required pages.
- Checked 778 local href/src references, including fragment targets: no missing files, images or local page links.
- Confirmed one H1 per page, unique metadata, main landmarks, canonical links and JSON-LD parsing.
- Checked duplicate IDs, labelled form fields, image alt/dimension attributes and dataset IDs/image paths.
- JavaScript syntax check: `node --check dist/assets/main.js`.
- 26 DOM behaviour checks using Happy DOM against the actual HTML and JavaScript: all passed.

DOM checks covered the 12-product listing; category and combined filters; query filters; empty search; price sorting; theme and RTL toggle states; mobile-menu open and Escape close; product ID selection; gallery thumbnail changes; size-to-enquiry linkage; Product schema; six-card journal pagination and second page; category/search/empty states; unique article content and TOC anchors; contact enquiry prefilling; required-field validation; truthful demo confirmation; password mismatch validation; truthful registration feedback; and password visibility.

Original editorial and product image contact sheets were visually inspected for subject relevance before extracting WebP assets. They are clearly illustrative, not verified inventory.

## Not executed

The supported browser-control skill was unavailable in this managed environment. Per the Sites workflow, no alternate browser runner, local preview server or browser installation was used. Therefore page screenshot comparisons, visual viewport audits at 375/430/768/1024/1280/1440/1920px, actual touch/keyboard interaction in a browser, cross-browser validation, Lighthouse/PageSpeed, contrast measurements and official W3C validation were not run. DOM tests verify logic and document updates, not pixel layout. No performance score or complete WCAG compliance is claimed.

## Scope and intentional placeholders

All forms are honest local demos. No email, file upload, account, payment, order or newsletter subscription is created. Phone/address/hours are editable demonstration details. The map is an integration placeholder until a real address is supplied, with an external general-location Google Maps link. Production social URLs, legal terms, LocalBusiness data, form/auth providers and checkout are documented integration steps.

The website is built with responsive CSS and a reduced-motion rule. Final visual and performance acceptance should be completed with supported browser tooling and real business assets before a public commercial launch.

## Version 1.1 focused checks

Passed 26 existing DOM behaviour checks again, plus 30 file-protocol DOM checks covering dark mode and RTL on each of the 15 pages with JSON network requests disabled. Static checks passed 793 local references, classic deferred scripts, unique photo occurrences, and a custom CSS palette containing only #000000, #ffffff and #a54e32. Added a reduced-motion-safe animation rule for every main image. Browser rendering remains unverified.

## Version 1.2 typography and image interaction update

Headings h1–h6 and heading emphasis now inherit 600 weight; body paragraphs use 400 and introductory paragraphs use 500. Every main image has hover and keyboard-focus transform rules. Changed the image entrance animation fill mode from `both` to `backwards`: the finished entrance animation no longer holds its transform at zero and suppresses hover transforms. Reduced-motion overrides disable both entry and hover movement. Static CSS checks confirmed these selectors and weights; browser visual testing remains unavailable. No layout, content, image path or JavaScript changes were made.

## Version 1.3 requested navigation, motion and alignment changes

Moved Home Page 2 into a native Home dropdown on all 15 pages. Page-wide scroll reveals now include each main section; image-only entry animation is disabled. Card/button hover transforms are disabled, while image hover remains. Corresponding titles, metadata and paragraphs in product, journal, collection, benefit, process and pricing rows are measured and equalized after images/fonts load, after filtering and on resizing. Single-column rows retain natural heights. Existing form grid field heights and button/footer layouts are preserved. DOM and static checks were run; pixel-level viewport and visual height acceptance remain unverified because supported browser tooling is unavailable.

## Version 1.4 copy and card presentation

Removed screenshot breadcrumb rows throughout the site. Removed visible developer notes and demo/preview/template/AI attribution wording, including dynamically rendered labels. Guide prices remain indicative; unavailable forms and accounts return accurate status messages without implying successful submission. Simulated customer endorsements were replaced by general creative guidance without names or ratings. Added page-specific text-card outlines, shapes and hover movement while keeping existing page sections. Browser visual testing remains unavailable.

## Version 1.5 screenshot-specific fixes

Added relevant design-brief guidance to the short custom-enquiry column and useful product/custom-question guidance beneath the Contact form. Changed the two form layouts to top alignment to prevent stretching a shorter column into a blank panel. Creative-note paragraphs use upright DM Sans instead of the italic heading face. Changed only the repeated reusable-care card row on About to top-accent cards with circular numbers. All More-menu routes now mark the selected submenu link and parent; an open dropdown has a visible open state. Browser screenshot verification is still unavailable; these fixes were grounded in the four supplied screenshots and verified with static/DOM checks.
