# Marlowe Dental Studio

A complete, fictional dental-clinic sales showcase for US client pitches, built locally in **Dental Clinic demo website**. Astro generates 24 static pages with self-hosted fonts, original generated photography, illustrated comparisons and procedural Three.js scenes. No backend, account or paid service is required.

The redesign draws on the patient journeys and visual direction of actual US practices, including Tend, Swish and Aventura Dental Arts. See [US-DENTAL-RESEARCH.md](US-DENTAL-RESEARCH.md) for sources and [ASSETS.md](ASSETS.md) for original image provenance and replacement guidance.

## Install, run and build

Use **Node.js 24 LTS**, or Node.js 22.19 or newer.

```sh
npm install
npm run dev
```

Development opens at `http://127.0.0.1:4321/`. If that port is occupied, Astro prints the next available port. For production:

On this Windows workstation you can also double-click **START WEBSITE.cmd** to start the local site and open it in your browser. Close its terminal window to stop the server.

```sh
npm run check
npm run build
npm run audit:links
npm run preview
```

`dist/` contains the complete static website. Upload its contents to any static host that supports directory index files. Configure the host to serve `404.html` for missing routes. Pages need an HTTP server; opening `index.html` directly with `file://` does not support root-relative assets or JavaScript modules.

On this workstation, `.node-runtime` points to the current Node runtime bundled with Codex. The small `scripts/astro.mjs` launcher uses that runtime when the system Node is too old. This optional, ignored file is machine-specific. A current normal Node installation needs no override. The launcher disables Astro CLI telemetry without changing global settings.

After the initial install, running and building need no network access. All application fonts, scripts, artwork and 3D resources are local. Outbound contact, social and clinical-reference links still require a connection if clicked.

## Structure

```text
src/clinic.config.ts       brand, logo, contacts, hours, clinicians, prices, care
src/layouts/Layout.astro   shared shell, fonts, SEO, Dentist JSON-LD
src/components/           header, footer, buttons, icons, FAQ, scenes, comparisons
src/pages/                static routes + reusable service and doctor templates
src/styles/global.css     base tokens, type, forms and shared layouts
src/styles/redesign.css   US-market art direction and responsive 3D stages
src/scripts/main.ts       motion, navigation, forms, hours and gallery
src/scripts/scenes.ts     Three.js lighting, model sequences and scene lifecycle
src/scripts/dental-geometry.ts  original tooth, implant, arch and pulp geometry
public/images/            original WebP photography, SVG comparisons and fallbacks
scripts/                  Astro launcher and built-route/asset audit
dist/                     production output after building
```

## Rebrand in minutes

1. Edit `src/clinic.config.ts`. It holds the name, short wordmark, SVG logo path, tagline, palette, phone, WhatsApp, email, address, time zone, opening hours, doctors, services, price ranges and social links. Header, footer, treatment pages, forms, opening-hours badge and schema use this configuration.
2. Set `siteUrl` to the real production origin. Rebuild to regenerate canonical links, social metadata and the sitemap. The current `.example` origin deliberately identifies this as a fictional site.
3. Swap the mark at `public/images/marlowe-mark.svg` or point `clinic.logo` at another local SVG. The text wordmark follows `clinic.shortName`.
4. Replace the generated photographic demo images with real clinic images. Doctor image paths live in the config. The current team asset is a three-panel portrait sheet: `imageLayout: 'triptych'` and `imageOffset` crop each person. For separate portraits, set `imageLayout: 'single'`, update `imagePosition`, and use each local image path. Studio and smile assets are referenced in About, Blog and Home. Keep descriptive alt text, update dimensions, optimize images, and obtain consent for patient photography.
5. Update the social preview card at `public/images/og-card.svg`. Export a 1200×630 JPEG or PNG for social platforms that do not accept SVG, then change `og:image` in `Layout.astro`.
6. Replace fictional reviews, credentials, ratings, timelines, insurance and location information with verified material. `clinic.demo` controls the shared demo disclosure; remove it only after all demo content is replaced. Replace the privacy notice and connect a real booking/contact service before a live clinic launch.

The semantic color variables are injected from `clinic.colors` on `<html>`. The new `forest`, `warm` and `soft-green` tokens support the cream and green direction in `redesign.css`. Derived muted/line colors are defined in `global.css`. Follow a palette change with a contrast check. SVG artwork has its own fills.

## Pages

`/`, `/about/`, `/services/`, six `/services/[slug]/` treatments, `/team/`, three `/team/[slug]/` profiles, `/gallery/`, `/reviews/`, `/pricing/`, `/blog/`, `/blog/a-calmer-first-visit/`, `/faq/`, `/book/`, `/contact/`, `/emergency/`, `/privacy/`, and `404.html`.

The service template includes procedure steps, suitability, duration, aftercare, FAQs, price guidance and related services. Every page shares the header and footer. Native cross-document View Transitions use a 150ms crossfade; unsupported browsers use ordinary page navigation. There is no preloader, curtain or transition screen.

## Interaction details

- Booking: care → date/time → details → review → demo confirmation. Date selection uses clinic opening hours, rejects Sundays and past dates, limits selection to 90 days, and removes elapsed same-day slots. Required fields, email, phone and the demo acknowledgment are validated. Back preserves values. Completion clears input values.
- Contact: local validation and a clearly labelled simulated success state. Neither form sends data or uses cookies, localStorage, sessionStorage, email or a database. Please use invented details when demonstrating.
- Gallery: accessible native range inputs support dragging and arrow keys; chips filter the illustrated cases. The horizontal gallery scrolls natively and uses scroll snapping.
- FAQ: semantic `<details>` and keyboard-operable summaries, with a short height animation as a progressive enhancement. Without JavaScript, native disclosure still works.
- Contact hours: computed in `clinic.timezone`, refreshed each minute, including closed days. Holidays need a production scheduling system.
- Header: hides while scrolling down, returns while scrolling up, and stays visible for keyboard focus. Mobile navigation supports Escape and a focus loop. The mobile booking bar remains available.

## 3D and motion

`Scene.astro` exposes `hero`, `anatomy`, `aligner`, `implant` and `accent` variants. `dental-geometry.ts` creates a four-cusp molar with occlusal grooves and two swept roots, a titanium implant with helical threads and a ceramic crown, and a curved ten-tooth arch with a separate transparent tray. Physical enamel, metallic titanium and transmissive plastic use a procedural softbox reflection environment and area lighting. All geometry and lighting resources are local.

Every model arrives assembled. Scrolling opens the tooth layers, separates the implant crown/abutment/fixture, or lifts the seated clear tray. The hero stays in view until its sequence finishes, then releases into the next section. Accessible buttons switch its model and reset to a seated pose; selecting another near the end extends the inspection space for a fresh sequence. Both the hero tooth and the anatomy section expose enamel, dentin, pulp and roots. Treatment pages select relevant models.

`SceneAnnotations.astro` supplies labeled SVG leaders. Their endpoints are projected from each moving mesh on every rendered frame, so the pointer lines follow camera, pointer and scroll movement. Internal anatomy labels appear once their structures are exposed. Label dimensions are measured only on resize.

Scenes load lazily near the viewport, cap DPR at 2 (1.5 on narrow screens), stop rendering offscreen or in a hidden document, and dispose geometry, materials, environment maps, observers, events and renderers on document teardown. Renderer, physical lighting tables and scene code are separate lazy chunks. Reduced motion skips smooth scrolling, reveals and WebGL and shows a variant-specific SVG. SVG also stays visible when WebGL creation or loading fails.

Lenis, GSAP ScrollTrigger and the Three.js renderer share one GSAP ticker. Lenis runs first, then scroll timelines and rendering; there is no separate renderer RAF or frame-skipping limiter. Wheel smoothing, damped pointer movement and scrub easing keep the page and models synchronized. Responsive sticky tracks keep hero, anatomy and About aligner scenes visible during inspection. On phones the hero copy flows before the model track. Reduced motion removes the extra scroll space and restores native scrolling and static diagrams. The mobile menu pauses and resumes Lenis, and nested textareas retain native scrolling.

GSAP also handles masked headline lines, short reveals, rating counts and magnetic buttons. Cross-page navigation remains native. FAQ height interpolation and canvas rendering are intentional animation exceptions.

## Replacing the tooth with a GLB

Place an optimized model at `public/models/tooth.glb`. In `scenes.ts`, import `GLTFLoader` from `three/addons/loaders/GLTFLoader.js`, load `/models/tooth.glb`, and replace the `naturalTooth()` result inside `addNatural()`. Center and scale it to the existing tooth dimensions, retain the returned group and base-position contract, and keep it inside the `presentation` group. This preserves pointer movement, scrolling, pause behavior and cleanup.

Keep the procedural version as the loading/error fallback. Exploded anatomy needs separate named enamel/dentin/pulp/root meshes connected to its timeline. The ten-tooth arch uses separate positions and rotations for each tooth; preserve these if replacing it. Dispose embedded image textures as well as geometry/materials for a textured GLB. Bundle any Draco/Meshopt decoder locally.

## Verification and limitations

See `VERIFICATION.md` for the checks actually completed. Lighthouse values in the brief are targets, not claimed scores. Run Lighthouse on the production build and target hosting environment before quoting a score to a client.

Intentional compromises:

- Portraits, the studio interior, the smiling portrait and the home whitening comparison are original AI-generated photographic demo assets. The gallery retains schematic SVG comparisons. None depict real staff, patients, premises or clinical outcomes; replace them for a real practice. The generated whitening pair and final prompt are documented in ASSETS.md.
- The tooth and movement models are stylised educational sculptures, not clinical simulations or promised treatment outcomes.
- Forms are front-end only, as requested. The map is a local illustration of a fictional address. Insurance partners, financing and testimonials are sample content.
- Social metadata includes a local SVG draft; a PNG/JPEG export is recommended for final social sharing.
- No real booking calendar, messaging provider or holiday database is connected.

General clinical wording was checked against primary patient information from the [NHS whitening guide](https://www.nhs.uk/tests-and-treatments/teeth-whitening/), [NHS root canal guide](https://www.nhs.uk/tests-and-treatments/root-canal-treatment/) and [NHS toothache guidance](https://www.nhs.uk/symptoms/toothache/). The copy is general educational demo material and needs clinical review for an actual practice. Visual references named in the brief were reviewed for tone and pacing; no third-party layout, asset or text was copied.
