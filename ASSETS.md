# Original photographic demo assets


## Realistic whitening comparison — 30 October 2026

The home slider uses `public/images/whitening-before-v3.webp` and `public/images/whitening-after-v3.webp`. These are equal-panel WebP exports from one original generated photographic diptych; no tooth-shade edits were made by the export script. Built-in imagegen was used. The original source, `exec-d1a4138c-10e7-475e-b729-a2625f3db71e.png`, is retained in the creator's local image-generation library. The web assets needed to run the site are included in this repository.

Both states are fictional and the slider caption explicitly labels them as AI-generated demo imagery, not a real patient result.

Final prompt:

Use case: photorealistic-natural. Asset: original realistic before-and-after teeth-whitening comparison for a fictional premium US dental website. Create ONE wide photographic DIPTYCH, two EXACTLY EQUAL side-by-side panels, no gutter, each panel landscape 3:2; overall image ratio 3:1. Both panels show the EXACT SAME adult woman's mouth and smile in the EXACT SAME close-up crop, expression, tooth positions, lip shape, natural skin texture, camera angle and soft daylight. Crop from just beneath the nose to the chin, full mouth visible with comfortable margins, natural pink lips, warm medium skin, teeth anatomically plausible with small natural variations. LEFT panel: healthy natural teeth with a mild warm ivory/yellow shade. RIGHT panel: the identical smile with teeth a few shades brighter, believable warm natural white, subtle whitening only. Preserve every tooth edge and gap and every lip/skin detail between panels; the ONLY difference is tooth shade. Authentic editorial macro dental photography, high detail, no smoothing or glossy retouching. No text, labels, numbers, logos, watermarks, divider, UI, instruments, extreme stains, disease, missing teeth, exaggerated Hollywood white, cartoon, illustration or 3D render. This is generated demonstration imagery, not a real clinical result.


Created with the built-in imagegen tool for this US clinic redesign. These fictional people and rooms are not real clinicians, patients, treatment results or a real practice.

Saved local web assets:
- `public/images/smile-v2.webp`
- `public/images/studio-v2.webp`
- `public/images/team-v2.webp`

The team image contains three portraits. CSS crops one equal panel per clinician; `imageLayout`, `imageOffset` and `imagePosition` in clinic.config.ts control replacement. Set `imageLayout` to `single` when using an individual real clinician photograph.

The original generated PNGs are retained in the image-generation library. Local WebP exports are compressed for the website; no external runtime image service is used.

## Final generation prompts

### smile

Use case: photorealistic-natural. Original high-end editorial portrait for a fictional premium US dental clinic website. Smiling woman in her early thirties, warm medium olive skin, shoulder-length dark brown hair tucked behind one ear, cream linen shirt. Head and shoulders, candid laugh, natural healthy teeth with subtle human variation, realistic skin texture. Quiet sage-teal backdrop, soft warm daylight, independent Brooklyn wellness editorial photography, understated confidence. No text, logos, watermarks, instruments, stock pose, glossy artificial skin. Portrait 4:5.

### studio

Use case: photorealistic-natural. Original architectural photograph for a fictional premium Brooklyn dental studio. Sculptural sage green dental chair, warm ivory plaster walls, pale oak joinery, rounded doorway, large frosted industrial windows with diffused morning light, brushed steel dental equipment neatly integrated, small olive plant. Wide composed frame, believable working clinic details, design-hotel quality, natural material textures. No people, writing, logos, signage, watermarks. Realistic architectural photography, not futuristic, not a 3D render. Landscape 3:2.

### team

Use case: photorealistic-natural. One wide photographic TRIPTYCH of three fictional US dental clinicians, THREE EXACTLY EQUAL vertical panels side by side, each with separate but matching sage-gray studio backdrop and soft window lighting. Chest-up editorial portraits, faces aligned vertically, comfortable headroom. LEFT woman age42 dark brunette shoulder-length hair, cream clinic jacket over dark sage scrubs, warm natural smile. CENTER Asian American man age36 short black hair, subtle round glasses, deep sage scrubs, friendly smile. RIGHT Latina woman age35 dark soft curls tied back, cream jacket over sage top, open smile. Authentic skin texture, natural teeth, premium Brooklyn healthcare brand photography. No crossed arms, instruments, badges, text, logos, watermarks or borders. Panels will be cropped into three separate portrait slots. Wide 3:2.
