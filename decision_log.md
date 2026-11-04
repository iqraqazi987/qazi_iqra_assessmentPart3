# Decision Log – Alberta Trails (Part 3)

## Embed and API
I embedded an OpenStreetMap view centred on Banff, Alberta. It is responsive, uses `loading="lazy"`, has a descriptive iframe title and provides a separate link if the embed fails. I chose Open-Meteo for current temperature, feels-like temperature and wind speed because this student demo needs no API key.

## Privacy and security
The map iframe uses `referrerpolicy="no-referrer"` and a sandbox limited to scripts and same-origin behavior required by the map. External links opened in a new tab use `rel="noopener noreferrer"`. The weather request contains no secret key or personal data. API output is validated and rendered with `textContent` and DOM methods, not injected as HTML. Residual tracking remains possible: when the map loads, OpenStreetMap and its tile infrastructure may receive the visitor's IP address and browser/network metadata. The weather provider also receives a request and the requested coordinates. Users should be informed of these third parties in a production privacy notice.

## Performance and accessibility
The page uses a small framework-free stylesheet, no unused CSS framework, no external font or icon library, and no hero image (so there is no unnecessary image download). System font fallbacks keep text visible without a font request. The map is lazy-loaded and uses a responsive aspect ratio. JavaScript is an ES module, so it is deferred automatically. Weather requests have an eight-second timeout, validate HTTP and response data, prevent concurrent duplicate requests and cache valid results in session storage for ten minutes. The page includes keyboard focus styles, a skip link and a live region for weather updates. Enable Brotli/gzip at the hosting layer and minify assets during deployment if a build pipeline is added.

## SEO and AIO metadata
Added: descriptive `title`, `description`, `keywords`, `author`, `robots`, `theme-color`, canonical link (example placeholder to replace after deployment), Open Graph `og:type`, `og:title`, `og:description`, `og:url`, Twitter `twitter:card`, `twitter:title`, `twitter:description`, logical H1/H2 headings, descriptive iframe title, and JSON-LD `WebPage` structured data with an Alberta/Banff `TouristAttraction` subject. The README documents the required canonical URL replacement.

## Lighthouse
Lighthouse scores have **not yet been measured** in the target browser/deployment, so no scores are claimed. Run Chrome DevTools → Lighthouse → Mobile after deployment, record the actual Performance and SEO results here, and make further fixes if either is below 90.
