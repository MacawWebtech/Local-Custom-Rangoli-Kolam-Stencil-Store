# Kolam House — Rangoli & Kolam Stencil Store

An original, buildless, 15-page HTML5/CSS/ES-module JavaScript template. Bootstrap 5.3.3 is bundled locally for base utilities; a custom warm-minimalism design system defines the visible experience. No dashboard, checkout or backend is included.

## Start locally

Use any static HTTP server from the extracted folder, for example `python -m http.server 8000`, then visit `http://localhost:8000`. VS Code Live Server also works. The extracted HTML files also work directly with `file://`: classic deferred scripts and bundled `assets/data.js` provide the controls and datasets without HTTP requests. HTTP hosting remains recommended for publishing. No npm installation or compilation is required.

## Structure

All 15 HTML pages are directly in the extracted root; they are not nested in a pages folder. `assets/style.css` holds the design tokens, responsive layouts, themes and RTL rules. `assets/main.js` contains accessible navigation, toggles, data-driven listings, galleries, forms and journal behaviours. `assets/data.js` bundles the editable datasets and image-slot paths for direct local-file use. `assets/products.json` and `assets/posts.json` are source dataset copies; synchronize them with `assets/data.js` if you edit data. `assets/images/` contains the optimized WebP assets. `assets/bootstrap.min.css` is the locally bundled Bootstrap stylesheet. `build.py` is the optional Python page generator; edit it if you want to regenerate the original documents. Keep `dist/assets/main.js` and `style.css` when regenerating.

## Pages and journey

`index.html`: product-led editorial homepage. `home-2.html`: magazine-style alternate with a full-width photograph, distinct compositions and a different section order. `about.html`: editable brand story and craft philosophy. `products.html`: 12 concepts with category, complexity, size, material, occasion and price filters, search and sorting. `product-details.html?id=kambi`: query-driven gallery, dimensions, size choice and contextual enquiry. `festive-collections.html`: ten seasonal and everyday collections. `custom-designs.html`: customization process, brief and reference preview. `pricing.html`: illustrative comparison cards and size table. `blog.html`: eight stories with categories, search and pagination. `blog-details.html?id=first-kolam`: query-driven article content, table of contents, related stories and sharing. `contact.html`: contact information, demo enquiry and a map integration placeholder. `login.html` and `register.html`: separate frontend interfaces. `404.html`: missing-page presentation. `coming-soon.html`: launch placeholder and demo newsletter.

The visitor journey is Discover → Compare → View details → Enquire. Links are relative, and product and article identifiers are passed in query parameters. Configure your hosting platform to serve `404.html` for unknown routes.

## Colors, typography and layout

Edit CSS custom properties at the top of `style.css`. `--primary` controls terracotta, `--bg` the ivory background, `--sand` the warm section fill, and `--text`, `--muted` and `--border` the supporting palette. Dark equivalents are in `[data-theme=dark]`. The interface now uses only black, white and the single terracotta primary `#a54e32`. Photos may contain their natural colours. No sand, brown or gray UI fills remain. Use the two family tokens, `--font-body` and `--font-heading`, to change DM Sans and Playfair Display. Google Fonts supplies these families; Arial and Georgia remain usable offline. Self-host licensed font files if deployment policy requires it.

The default body text is 16px. Desktop and tablet sections have 30px horizontal padding; small mobile layouts use 18px. Grid and Flexbox create equal-height cards and anchored product buttons. Breakpoints include 639, 767, 1023 and 1199px plus a large desktop rule at 1600px. CTA blocks span the page width. All animations respect reduced-motion preference.

## Replace images

Replace files in `assets/images/` while keeping their names, or edit image paths in the HTML/generator and datasets. Provide descriptive alt text and matching width/height attributes. Product images use `object-fit:contain`, lifestyle images use `cover`. Keep below-the-fold lazy loading; do not lazy-load the main hero. Assets are original AI-generated illustrative photography, not photos of real inventory, actual customers or company premises. Source prompts are in `documentation/asset-prompts.md`. Verify a real product's shape and material with actual photography before sales use.

## Edit products and stories

Edit `products.json` fields `id`, `name`, `category`, `complexity`, `size` (in inches), `material`, `price` (INR), `occasion`, `image` (filename without extension), `description`. Maintain unique URL-safe IDs. Add category options to `products.html`/`build.py` when introducing categories. Product sizes and prices are demo data. For rectangular products, replace the single-size model with width/height fields and update conversion/display logic. Homepage product cards are pre-rendered; update the generator and run it to keep them synchronized with dataset edits.

Edit journal metadata in `posts.json`; non-default article sections are in `storyContent` in `main.js`. The first article is pre-rendered in the generator. Use real publication dates and verified author profiles for production. No factual company history, credentials, certifications or actual testimonials are asserted: team roles, milestones and customer stories are clearly editable/fictional demo content.

## Themes and RTL

On first visit the page detects the system theme; the manual choice is saved under `kolam-theme`. Direction is saved under `kolam-dir`. Storage failures do not prevent the page loading. The visible direction button reads `RTL`; the document's `dir` attribute changes and the pressed state communicates the active mode. Logical inset and padding properties handle directional layout; only directional arrows are mirrored. English remains the content language when direction changes. Add translated content and the appropriate `lang` value when preparing an actual Arabic or Hebrew version.

## Forms and authentication integration

The `.demo-form` handler prevents sending and validates fields locally. Success messages explicitly say that nothing was sent, uploaded or created. Passwords are not saved; no credentials are logged. Registration checks matching passwords and a required demo acknowledgement. Recovery explains its unconnected status. Remember-me is a frontend control for a future auth provider.

For Formspree, supply a verified endpoint and replace the demo submit handler with a `fetch` POST or standard form submission. Show genuine success only after an accepted response, accessible errors after failures and a pending state while sending. Use `FormData` for actual image uploads. For Netlify Forms, add `data-netlify="true"`, a unique form name and the matching hidden `form-name`, and test on Netlify. Neither provider is currently configured. Reference image validation permits JPG/PNG/WebP up to 5 MB and previews through an object URL; no upload takes place. Add server-side validation, secure storage, consent and anti-spam as required by the real integration.

For Mailchimp/ConvertKit, replace the newsletter handler with the provider's approved form or backend API proxy. Do not put secret API keys in frontend code. Verify subscribed versus confirmation-required responses. Add real business contact information and social profile URLs; none are invented here. Authentication requires a provider/backend with secure sessions and recovery; frontend validation alone is not authentication.

## Map and future payments

The contact page contains the requested Google Maps integration placeholder and an external general-location map link. No real business address was provided. Replace `.map-placeholder` with a responsive iframe obtained for your verified location, with a descriptive title and lazy loading. Never imply that the illustrative location is a real shop. Stripe/PayPal checkout is optional future work, not an active interface. Do not add payment buttons until real prices, inventory, fulfilment and a secure backend/provider flow exist. No booking calendar is required.

## SEO and production checklist

Each HTML page has a unique title/description, one H1, canonical and Open Graph metadata plus breadcrumb schema. Product details add Product schema without fake offers/availability; articles add BlogPosting schema. LocalBusiness schema is deliberately deferred until verified business details exist. Update the origin in `build.py`, regenerate metadata, `sitemap.xml` and `robots.txt` when moving to a production domain. Dynamic product/article pages update metadata to match the selected ID; pre-render individual detail URLs if search-engine indexing of each item is important. A private Site is not a public SEO launch.

Configure your actual brand identity, privacy/terms, verified contact details, allowed file handling, prices, tax/delivery information and final business copy before taking orders. Never remove demo labels while leaving simulated submissions in place. Use actual product photography to verify precise shapes.

## Credits and licensing

Bootstrap 5.3.3, MIT: https://github.com/twbs/bootstrap/blob/v5.3.3/LICENSE . Google Fonts DM Sans and Playfair Display are available under the SIL Open Font License; see https://fonts.google.com/specimen/DM+Sans and https://fonts.google.com/specimen/Playfair+Display . Original custom logo/icon markup and page content were authored for this template. AI-created images are original illustrations; no reference-site photos or product descriptions were copied. https://www.rangolistencil.com/ was researched for category terminology and subject matter only. Its trademarks, assets and commercial offers are not part of this site.

## Changelog

1.0.0 — complete 15-page template; warm editorial design; local Bootstrap; product data and journal data; light/dark and RTL persistence; reduced-motion animations; responsive layouts; locally validated demo forms and image previews; documentation and static integrity checks.

## Support and verification limits

See `documentation/qa-report.md` for checks actually run. Browser screenshot, viewport, cross-browser, W3C validator and Lighthouse checks must be run in an environment with the supported browser tooling. The CSS is designed for mobile/tablet/desktop but no score or visual compliance is asserted without that verification. Nothing depends on a payment or authentication service for browsing. If JSON interactions fail, use HTTP hosting and check dataset paths. If web fonts are blocked, system fallbacks remain readable.

## Requested fixes — version 1.1

Strict black/white/primary palette, subtle reveal/hover animation on every image, unique placeholder paths for repeated photographs, and classic-script/local-data compatibility for RTL/theme controls when opening HTML directly. See `documentation/image-placeholders.md`. Current HTML/CSS/JS are authoritative; the original `build.py` generator predates these focused changes and must not be used to overwrite them.

Version 1.5: custom/contact supporting content, compact form panels, consistent body font, varied About care cards and More-menu active states.
