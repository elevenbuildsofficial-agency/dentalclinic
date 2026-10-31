# Verification record

Updated 30 October 2026 (Asia/Karachi). The US-market redesign was verified on 29 October. The assembled-to-exploded models, tracking pointer labels, pinned hero and realistic whitening comparison were checked on 30 October in the running local preview, followed by a fresh static build.

## Build and structure

- `npm run check`: 37 source files, zero errors, warnings or hints.
- `npm run build`: 24 HTML pages plus robots.txt, sitemap and local assets; zero build warnings. Serial output avoids a Windows directory-creation race.
- `npm run audit:links`: every internal route and local asset exists; one H1, a meta description and Dentist JSON-LD on every page.
- Production JavaScript gzip sizes: main entry 58.56 KB; lazy scene code 6.64 KB, physical lighting tables 101.14 KB and Three.js core 132.74 KB. The complete 3D payload matters when evaluating performance; the core size alone is not its total cost.
- Fonts, WebP photography, SVG comparisons and 3D resources are local. Generated photography provenance and final prompts are in ASSETS.md.

## Responsive and visual checks

On 29 October, all 24 routes, including the custom 404, were visited at **375 × 812, 768 × 1024, 1024 × 768 and 1440 × 1000** CSS pixels. Each had one H1 and no document horizontal overflow. Completed image loads had no broken-image result during the phone route check. Home, the live 3D views, About's aligner stage and all three clinician portrait crops were inspected visually. The 30 October follow-up visually checked the new model sequences and generated photo slider at **1280 × 720**; responsive CSS and reduced-motion paths were reviewed in source. The new sticky tracks were not re-tested at all four earlier viewport sizes.

Screenshots are in `qa/`: `home-v2-desktop.jpg`, `home-v2-mobile.jpg`, `hero-v2-implant.jpg`, `hero-v2-aligner.jpg`, `anatomy-v2-scroll.jpg`, `aligner-v2-scroll.jpg` and `booking-v2-confirmation.jpg`. Earlier v1 captures and its source snapshot remain for comparison.

The 30 October captures include `anatomy-arrival-assembled.jpg`, `anatomy-layer-pointers.jpg`, `hero-implant-pointers-exposed.jpg`, `hero-aligner-pointers-exposed.jpg` and `realistic-whitening-comparison.jpg`.

## Motion and 3D

| Check | Observed result |
| --- | --- |
| Hero natural tooth | Arrives assembled, then exposes enamel, dentin, pulp and roots with moving pointer labels |
| Hero implant control | Starts with crown seated; scroll separates crown, abutment and implant with labeled leaders |
| Hero aligner control | Starts with tray seated; scrolling lifts it while both pointer labels follow their parts |
| Hero stage and release | Model remained at 112px during inspection; after separation, the hero released and the patient-perks section entered the viewport |
| Switching near sequence end | Switching to the implant at a late scroll position extended its track and reset to a seated pose, then separated during further scrolling |
| About scroll sequence | The tray arrived seated, then lifted while its scene remained staged |
| Home anatomy sequence | Closed arrival pose; progressive separation and four projected pointer lines; reversing scroll restored the closed pose |
| Mobile menu | Opens, exposes navigation and closes with Escape; Lenis resumes afterward |
| Treatment disclosure | Opens and closes with Escape |
| Console smoke tests | No application errors captured during the final development-preview model checks; prior production smoke tests also passed |

Source review confirms that Lenis runs on the prioritized GSAP ticker, ScrollTrigger receives its scroll updates, and visible Three.js scenes render on that same ticker. The former independent render RAF and frame-skipping limiter are removed. Pointer damping uses elapsed time. No frame-rate benchmark was performed, so this record does not claim measured 60fps.

Responsive sticky tracks keep the hero, anatomy and About aligner models visible during their sequences. On narrow screens, the hero copy flows before the model track. Label endpoints are projected from their moving mesh coordinates after rendering; dimensions are read on resize rather than on scroll frames. Reduced-motion styles remove extra scroll space and the JavaScript skips Lenis, motion reveals and WebGL. Static SVGs remain available, including a labeled exploded anatomy diagram for reduced motion. IntersectionObserver and document visibility pause rendering; teardown disposes resources and listeners. OS-level motion emulation and WebGL context-loss injection were not performed.

The new home comparison loads two local generated WebP photographs, each 1086 × 724 pixels. The visible caption identifies the pair as AI-generated and not a real patient result. ArrowRight changed the native range from 50 to 51 and its split to 51%; both photographic layers loaded successfully. The gallery's existing schematic comparisons remain unchanged.

## Visitor journey

The boundary is page navigation → front-end form state → visible demo confirmation. There is no API or database by design.

The redesigned booking flow was completed with fictional details: empty service selection was rejected, Clear Aligners selected, an open Monday produced time slots, details were entered, a review displayed the selected appointment, and completion explicitly stated that no booking, email or storage occurred. The contact form also reached its local validated success state. No real personal details were used.

Gallery checks on the production preview: the Clear aligners chip showed one illustrated case; ArrowRight changed its comparison input from 50 to 51 and its visual split to 51%. The FAQ opened using Enter. Initial-build validation of Sundays, required fields, invalid email, Back, restart and contact errors remains applicable because those form handlers were retained.

Semantic landmarks, skip link, visible focus, explicit form labels, status messages, alt descriptions, native disclosures, keyboard range controls and reduced-motion paths are included. This was a targeted review, not a complete automated accessibility audit.

## Limits and production work

- Lighthouse was not run. Requested scores remain unmeasured targets.
- The test machine emitted graphics-driver shader precision warnings during earlier development checks; models rendered. Target-device performance still needs measurement.
- Clinicians, credentials, photography, ratings, reviews, prices, insurance, location and results are fictional or illustrative. The models are simplified educational artwork.
- Booking, messaging, insurance verification, payment, holidays, analytics and hosting integrations are outside this front-end demo.
- Export the draft SVG social image to PNG/JPEG for reliable social previews.
- README.md covers installation, rebranding, photography replacement and GLB substitution. US-DENTAL-RESEARCH.md records official clinic and motion references.

The development website remains running on `http://127.0.0.1:4322/` at the user's explicit request. Double-click `START WEBSITE.cmd` to launch a local preview again after it is stopped.
