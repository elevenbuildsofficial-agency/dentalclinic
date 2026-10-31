# US dental website research and redesign direction

Reviewed 29 October 2026. This research concerns design and patient journeys, not the clinical quality of these practices.

## Primary US clinic references

| Clinic | Observed on its official site | Application to Marlowe |
| --- | --- | --- |
| [Aventura Dental Arts, Florida](https://aventuradentalarts.com/) | A spacious editorial opening, clinical footage, treatment families, technology, named clinicians, testimonials and location-specific calls. Its agency lists the project in its [own awards record](https://thefirstthelast.agency/about). | More confident typography, carefully directed imagery, clearer relationships between expertise and technology. An original layout and visual identity. |
| [Swish Dental, Texas](https://www.swishsmiles.com/) | Visible booking and telephone actions, friendly photography, treatment categories, locations, insurance verification, membership and financing paths. Visually inspected in-browser. | Make booking and the cost conversation easy to find. Put insurance, patient comfort and a studio introduction early in the page. |
| [Tend, United States](https://www.hellotend.com/site/home) | Its current official page text emphasises judgment-free care, prevention, comprehensive services, online booking, insurance, evening/Saturday access and patient stories. | Clearer US patient language, practical navigation and useful reassurance close to the first appointment CTA. |
| [Studio Dental, San Francisco](https://www.studiodental.com/) | Restrained identity, an explicit Book Now action, and links to clinicians, patient stories, insurance/pricing and location. | Keep the header simple and let space, typography and strong media carry the brand. |
| [Bowery Dental, NYC](https://bowerydental.com/) | Treatment groupings, new-patient/checkup pricing, emergency care and readily available local contact details. | Make first-visit pricing and local practice information concrete, with illustrative prices clearly labelled. |
| [Dental365, United States](https://www.godental365.com/) | Location and scheduling routes, recognisable treatment names, clinician access, patient resources and stories. | Use familiar treatment labels and give practical patient information equal standing with the brand presentation. |

These observations inform a design direction; no conversion-rate claims or hidden technology-stack assumptions were made. Tend blocked the live browser request, so its content was checked through web retrieval and extraction. Studio Dental’s main media did not fully render in the research browser; conclusions about it are limited to the visible navigation and extracted official links. The Tavily research endpoint was rate-limited; direct official-site extraction and visual review supplied the research instead.

## 3D and motion references

- [South Cliff Dental Group — firsthand developer case study](https://andersonmancini.dev/blog/south-cliff-dental-group): a genuine dental Three.js experience. Reference for camera, lighting and scene choreography only; this practice is in the UK.
- [Dentalux — creator portfolio](https://gapsystudio.com/portfolio/dentalux/): reference for warm medical branding and a purposeful 3D presentation.
- [VOKA dentistry visualisations](https://voka.io/our-medical-animation-video-portfolio/dentistry/): separation of tooth structures and restrained anatomical colour.
- [EthosVFX](https://ethosvfx.com/): implant assembly as a readable sequence, with deliberate product framing.
- [AXIOM VFX — Aivorix](https://www.axiomvfx.com/projects/aivorix): believable proportions and considered dental-education sequences.

The model, lighting rig and animations in this project are original. No clinic photographs, videos, logos, proprietary models or code were copied.

## Implemented direction

1. Patient-first US navigation: treatments, clinicians, insurance/pricing, studio, contact, phone and booking.
2. An editorial hero paired with an interactive product-quality dental scene; natural tooth, implant and clear-aligner views have distinct geometry and movement.
3. A molar built from an occlusal surface, four cusps, central grooves and two broad curved roots. The previous lathed crown and separate pointed roots are replaced.
4. Broad softbox reflections, lower exposure, warm enamel, gentle negative fill, grounding shadows and a restrained teal edge light.
5. Original photographic demo assets for the studio, human smile and clinician portraits, stored locally. These do not depict real clinicians or real patients.
6. Treatment exploration, sample insurance information and a clear first-visit journey before the longer educational narrative.
7. Retain all existing routes and local-only validated demo forms. Preserve keyboard navigation, reduced motion and WebGL fallbacks.
8. Synchronize Lenis, GSAP and Three.js on one ticker. Extend anatomy and aligner sections into sticky scroll sequences on sufficiently large screens, with native-flow and reduced-motion alternatives.

## Technical references

[BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html), [CatmullRomCurve3](https://threejs.org/docs/pages/CatmullRomCurve3.html), [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), [PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html), [RectAreaLight](https://threejs.org/docs/pages/RectAreaLight.html), and the [official contact-shadow example](https://threejs.org/examples/webgl_shadow_contact.html).

Smooth-scroll integration follows the [official Lenis GSAP ScrollTrigger integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).

Marlowe remains a fictional pitch demo. Replace illustrative ratings, insurance relationships, credentials, photos, prices and contact information with verified clinic material before production use.
