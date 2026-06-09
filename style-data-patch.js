(() => {
  if (window.__styleComboDataPatchInstalled) return;
  window.__styleComboDataPatchInstalled = true;

  const STYLE_UPDATES = [
    { title: "Layered Mixed Media Brush Art", text: "Layered Mixed Media Brush Art – Paint, ink, texture all-in-one" },
    { title: "Anita Jeram-inspired watercolour book illustration", text: "Anita Jeram-inspired Watercolour Book Illustration" },
    { title: "Pastel Art Nouveau cartoon", text: "Pastel Art Nouveau Cartoon" },
    { title: "Cubist Geometric figure art", text: "Cubist Geometric Figure Art" },
    { title: "Steampunk Style", text: "Steampunk Style – Gear-heavy art" },
    { title: "Chibi / Kawaii Style", text: "Chibi / Kawaii Style – Cute anime-inspired design" },
    { title: "Mosaic Portrait Style", text: "Mosaic Portrait Style – Tiles form a large face" },
    { title: "Gothic Victorian", text: "Gothic Victorian – Dark, ornate historical style", aliases: ["Gothic"] },
    { title: "Whimsical Miniature Diorama", text: "Whimsical Miniature Diorama – Tiny world built with detail" },
    { title: "Macabre Victorian Mourning Portrait", text: "Macabre Victorian Mourning Portrait – Creepy antique vibe", aliases: ["Macabre Mourning Portrait"] },
    { title: "Solarpunk Botanical City Style", text: "Solarpunk Botanical City Style – Green architecture, sunlight, community tech, abundant plant life" },
    { title: "Medieval Marginalia Creature Style", text: "Medieval Marginalia Creature Style – Odd little manuscript beasts doing ridiculous border activities" },
    { title: "Early Renaissance Panel Style", text: "Early Renaissance Panel Style – Tempera clarity, balanced perspective, calm architectural staging" },
    { title: "Baroque Chiaroscuro Drama", text: "Baroque Chiaroscuro Drama – Theatrical light, deep shadows, sweeping drapery, opulent intensity" },
    { title: "Rococo Pastel Ornament Style", text: "Rococo Pastel Ornament Style – Airy shell curves, gilded flourishes, soft luxury and playful elegance" },
    { title: "Neoclassical Marble Heroic Style", text: "Neoclassical Marble Heroic Style – Balanced antique composition, sculptural figures, columns and cool restraint" },
    { title: "Romantic Sublime Landscape", text: "Romantic Sublime Landscape – Stormy ruins, moonlight, wild nature and brooding emotional scale" },
    { title: "Post-Impressionist Decorative Painting", text: "Post-Impressionist Decorative Painting – Bold contour, expressive colour, structured brushwork and patterned forms" },
    { title: "Symbolist Dream Allegory", text: "Symbolist Dream Allegory – Mystical figures, moons, masks and decadent dreamlike symbolism" },
    { title: "Fauvist Colour Painting", text: "Fauvist Colour Painting – Wild saturation, bold contours and non-natural expressive colour" },
    { title: "Abstract Expressionist Gesture Painting", text: "Abstract Expressionist Gesture Painting – Splashes, drips and raw gestural brush energy" },
    { title: "Arts and Crafts Pattern Style", text: "Arts and Crafts Pattern Style – Handcrafted floral repeats, natural ornament and warm material honesty" },
    { title: "Zoological Natural History Plate", text: "Zoological Natural History Plate – Detailed animal studies with labels, specimen poses and scientific precision" },
    { title: "Clinical Medical Diagram Style", text: "Clinical Medical Diagram Style – Clean anatomical or biological diagramming with labels and instructional clarity" },
    { title: "Editorial Spot Illustration", text: "Editorial Spot Illustration – Conceptual magazine-style metaphor images with clean silhouettes" },
    { title: "Superhero Comic Splash Page", text: "Superhero Comic Splash Page – Dynamic foreshortening, dramatic inks, speed lines and punch lighting" },
    { title: "Underground Comix Style", text: "Underground Comix Style – Heavy ink, counterculture cartooning, grotesque satire and rough print attitude" },
    { title: "Shōjo Manga Romance Style", text: "Shōjo Manga Romance Style – Sparkles, floral overlays, airy hair, soft framing and emotive eyes" },
    { title: "Manga Horror Ink Style", text: "Manga Horror Ink Style – Dense blacks, unsettling line detail and claustrophobic eerie framing" },
    { title: "Anime Cel Animation Style", text: "Anime Cel Animation Style – Clean contour, flat shadow bands, painted backgrounds and cel-like colour" },
    { title: "Limited TV Animation Style", text: "Limited TV Animation Style – Held poses, simplified movement, bold flat shapes and clever staging" },
    { title: "Impasto Oil Paint Style", text: "Impasto Oil Paint Style – Thick ridged paint, palette-knife texture and raised painterly surface" },
    { title: "Fresco Mural Painting", text: "Fresco Mural Painting – Matte plaster wall texture, monumental composition and weathered pigments" },
    { title: "Egg Tempera Panel Style", text: "Egg Tempera Panel Style – Crisp detail, matte pigment and delicate luminous panel-paint finish" },
    { title: "Airbrush Gradient Poster Style", text: "Airbrush Gradient Poster Style – Soft sprayed gradients, velvety transitions and retro shine" },
    { title: "Pictorialist Soft-Focus Photography", text: "Pictorialist Soft-Focus Photography – Hazy tonal prints, poetic blur and painterly photographic atmosphere" },
    { title: "Straight Photography Style", text: "Straight Photography Style – Sharp focus, rigorous composition and clean observational realism" },
    { title: "Documentary Photography Style", text: "Documentary Photography Style – Candid lived-in realism, available light and social texture" },
    { title: "New Vision Modernist Photography", text: "New Vision Modernist Photography – Radical angles, close crops, shadows and machine-age geometry" },
    { title: "High-Fashion Photography Editorial", text: "High-Fashion Photography Editorial – Polished lighting, poses, styling and magazine drama" },
    { title: "Italian Neorealist Film Look", text: "Italian Neorealist Film Look – Street-location realism, natural light and anti-glamour human texture" },
    { title: "Technicolor Cinema Look", text: "Technicolor Cinema Look – Saturated classic-studio colour, glossy drama and storybook brightness" },
    { title: "Giallo Horror Lighting", text: "Giallo Horror Lighting – Lurid red-blue shadows, stylish thriller framing and theatrical dread" },
    { title: "Pattachitra Folk Painting", text: "Pattachitra Folk Painting – Flat mythic figures, decorative borders and narrative scroll-like detail" },
    { title: "Kalighat Painting Style", text: "Kalighat Painting Style – Sweeping brush contours, simplified figures and folk-market immediacy" },
    { title: "Madhubani Painting Style", text: "Madhubani Painting Style – Dense pattern fills, double outlines, folk symbols and vivid flat colour" },
    { title: "Kantha Embroidery Surface", text: "Kantha Embroidery Surface – Running-stitch texture, quilted cloth and handmade narrative threadwork" },
    { title: "Batik Wax-Resist Textile", text: "Batik Wax-Resist Textile – Crackled dye patterns, layered cloth colour and organic resist edges" },
    { title: "Mid-Century Modern Interior Illustration", text: "Mid-Century Modern Interior Illustration – Teak furniture, warm geometry, organic curves and clean domestic design" },
    { title: "Low-Poly 3D Style", text: "Low-Poly 3D Style – Faceted polygons, simplified geometry and stylised game-ready shapes" },
    { title: "Cel-Shaded Toon Render", text: "Cel-Shaded Toon Render – 3D forms with flat shadow bands, crisp outlines and comic/game clarity" },
    { title: "Corporate Memphis Vector Illustration", text: "Corporate Memphis Vector Illustration – Flat pastel people, bendy limbs, friendly abstract office shapes" },
    { title: "Nostalgic Browser Pet Game Sprite Style", text: "Nostalgic Browser Pet Game Sprite Style – Clean vector-style 2D fantasy-creature sprite art with crisp bold uniform linework, cel-shading, flat vibrant colour, and soft ambient-occlusion shading." }
  ];

  const normaliseForMatch = value => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[“”]/g, '"').replace(/[^a-z0-9]+/g, " ").trim();

  const upsertStyle = ({ title, text, aliases = [] }) => {
    const terms = [title, ...aliases].map(normaliseForMatch).filter(Boolean);
    const index = STYLES.findIndex(style => {
      const candidate = normaliseForMatch(style);
      return terms.some(term => candidate === term || candidate.startsWith(term + " "));
    });

    if (index >= 0) STYLES[index] = text;
    else STYLES.push(text);
  };

  STYLE_UPDATES.forEach(upsertStyle);

  const seenStyles = new Set();
  for (let index = 0; index < STYLES.length; index += 1) {
    const key = normaliseForMatch(STYLES[index]);
    if (seenStyles.has(key)) {
      STYLES.splice(index, 1);
      index -= 1;
    } else {
      seenStyles.add(key);
    }
  }

  const explicitTitleOverrides = [
    ...STYLE_UPDATES.map(update => update.title),
    "Album Art Psychedelia (1970s)",
    "Album Cover (Indie Rock Aesthetic)",
    "Art Brut / Outsider Art Vibe",
    "Comic Book Style (Generic)",
    "Fantasy Book Cover (90s style)",
    "Folk Art Primitive",
    "Inkblot Rorschach Abstract",
    "Light and Shadow Realism",
    "Manga Cover (Generic, Safe Style)",
    "Pastel Illustration (Soft, Whimsical)"
  ].sort((a, b) => b.length - a.length);

  const noSeparatorTitles = new Set([
    "Anita Jeram-inspired Watercolour Book Illustration",
    "Cubist Geometric Figure Art",
    "Pastel Art Nouveau Cartoon",
    "Windows Aero Glass Aesthetic"
  ]);

  const titleEndTerms = [
    "Flash Sheet", "Film Look", "Cinema Look", "Game Style", "Book Cover", "Puzzle Page",
    "Art", "Aesthetic", "Animation", "Avatar", "Broadside", "Card", "Chart", "Collage", "Cover", "Design", "Diagram", "Drawing", "Editorial", "Emblem", "Illustration", "Landscape", "Layout", "Lighting", "Look", "Map", "Montage", "Mural", "Page", "Painting", "Photography", "Pictogram", "Plate", "Poster", "Print", "Profile", "Realism", "Render", "Rendering", "Scene", "Sculpture", "Sheet", "Signage", "Sketch", "Snapshot", "Style", "Surface", "Textile", "Texture", "Vibe", "World"
  ].sort((a, b) => b.length - a.length);

  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function addDescriptionSeparator(style) {
    const cleaned = style.replace(/\s+/g, " ").trim();
    if (!cleaned || cleaned.includes(" – ") || noSeparatorTitles.has(cleaned)) return cleaned;

    const explicitTitle = explicitTitleOverrides.find(title => cleaned.startsWith(title + " "));
    if (explicitTitle) return `${explicitTitle} – ${cleaned.slice(explicitTitle.length).trim()}`;

    let splitAt = -1;
    for (const term of titleEndTerms) {
      const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b(?: \\([^)]*\\))?`, "gi");
      let match;
      while ((match = pattern.exec(cleaned))) {
        const candidateEnd = match.index + match[0].length;
        if (candidateEnd < cleaned.length && candidateEnd > splitAt) splitAt = candidateEnd;
      }
    }

    if (splitAt <= 0 || splitAt >= cleaned.length) return cleaned;

    const title = cleaned.slice(0, splitAt).trim();
    const description = cleaned.slice(splitAt).trim();
    if (!title || !description) return cleaned;
    return `${title} – ${description}`;
  }

  STYLES.splice(0, STYLES.length, ...STYLES.map(addDescriptionSeparator));

  function replaceArrayContents(target, source) {
    target.splice(0, target.length, ...uniquePool(source));
  }

  const moonlitPattern = /Kintsugi|Aero|Foggy|Renaissance|Astronomical|Astrology|Byzantine|Persian|Nouveau|Vaporwave|Tarot|Mosaic|Crystal|Mandala|Holographic|Art Deco|Potion|Quilling|Mughal|Ottoman|Papercut|Celestial|Glass|Illumination|Painting|Porcelain|Tile|Marquetry|Majolica|Botanical|Baroque|Rococo|Romantic|Symbolist|Tempera|Fresco|Giallo|Ornament|Drama/i;
  const beautifulPattern = /Kintsugi|Felt|Aero|Foggy|Kawaii|Psychedelia|Marker|Bokeh|Synthwave|Minhwa|Renaissance|Fantasy|Cottagecore|Neon|Porcelain|Pastel|Gouache|Colored Pencil|Lofi|Cyanotype|Byzantine|Amigurumi|Persian|Nouveau|Vaporwave|Mosaic|Cosmic|Crystal|Impressionist|Watercolor|Pichwai|Airline|Card|Embroidery|Mandala|Holographic|Cloudcore|Vintage Travel|Botanical|Fairy|Diorama|Potion|Quilling|Mughal|Alebrije|Ottoman|Majolica|Papercut|Tarot|Talavera|Delft|Baroque|Rococo|Romantic|Post-Impressionist|Symbolist|Fauvist|Arts and Crafts|Tempera|Fresco|Impasto|Airbrush|Technicolor|Pattachitra|Kalighat|Madhubani|Kantha|Batik|Mid-Century|Cel-Shaded|Browser Pet|Creature Sprite/i;
  const flatPattern = /Graffiti|Vector|8-Bit|Enamel|Chart|Mid-Century|Stencil|Mascot|Turnaround|Papel|Brutalist|Transit|Neon Sign|Emblem|Spreadsheet|Flyer|Glass|De Stijl|Ligne Claire|Safety|Matchbox|Heraldic|Flat|Radar|Contour|Pictogram|Infographic|Airline|Suprematist|Neo-Memphis|Art Deco|Tomb|Wayfinding|Bauhaus|Topographic|Typographic|Comic Strip|Monoline|Peanuts|Pop-Illustration|Sci-Fi|Avatar|Portrait on Color|Constructivist|Swiss|Silhouettes|Editorial|Comic|Manga|Anime|Limited TV|Diagram|Poster|Folk|Pattachitra|Kalighat|Madhubani|Low-Poly|Cel-Shaded|Corporate Memphis|Sprite|Browser Pet|Vector-style/i;

  replaceArrayContents(MOONLIT_JEWELBOX_STYLES, STYLES.filter(style => moonlitPattern.test(style)));
  replaceArrayContents(BEAUTIFUL_STYLES, STYLES.filter(style => beautifulPattern.test(style)));
  replaceArrayContents(FLAT_COLOUR_STYLES, STYLES.filter(style => flatPattern.test(style)));

  const ABSTRACT_MODE_NAME = "Abstract / Non-Figurative";
  const abstractPattern = /Abstract|Suprematist|Fractal|Op Art|Plotter|Inkblot|Rorschach|Glitch|Datamosh|Psychedelia|Surreal|Dreamcore|Dada|De Stijl|Neo-Memphis|Brutalist|Generative|Geometric|Cubist|Futurist|Expressionist|Mixed Media|Ink Drip|Light Painting|Bokeh|Motion|Thermographic|Heatmap|Cosmic|Mandala|Papercut|Risograph|Mosaic|Stained Glass|Vaporwave|Cyberdelic|Acrylic|Oil Pastel|Minimalist Flat|Fauvist|Post-Impressionist|Symbolist|Abstract Expressionist/i;
  const abstractStyles = STYLES.filter(style => abstractPattern.test(style));

  MODES[ABSTRACT_MODE_NAME] = { type: "manual", styles: abstractStyles.length ? abstractStyles : STYLES };
  ANTI_GREEBLE_MODES.abstract = {
    label: "Abstract Guardrails",
    suffix: "Use rich colour, layered texture, expressive detail, clean lighting, and controlled complexity. Preserve abstract movement and atmosphere without muddy shapes, cluttered contrast, or accidental figurative subjects."
  };

  function ensureOption(select, value, label, afterValue = null) {
    if ([...select.options].some(option => option.value === value)) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    const after = afterValue ? [...select.options].find(existing => existing.value === afterValue) : null;
    if (after && after.nextSibling) select.insertBefore(option, after.nextSibling);
    else select.appendChild(option);
  }

  function installStyleDatabaseExport() {
    if (document.getElementById("styleDatabaseExport")) return;

    const styleElement = document.createElement("style");
    styleElement.textContent = `
      #styleDatabaseExport textarea {
        width: 100%;
        min-height: min(440px, 54svh);
        resize: vertical;
        padding: 13px;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 18px;
        color: var(--text);
        background: rgba(8, 7, 18, 0.58);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09), 0 10px 26px rgba(0, 0, 0, 0.12);
        line-height: 1.38;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 0.82rem;
        white-space: pre;
      }
      #styleDatabaseExport .style-export-meta {
        margin: 0 0 12px;
        color: var(--muted);
        line-height: 1.5;
        text-wrap: pretty;
      }
      #styleDatabaseExport .style-export-status {
        margin: 10px 0 0;
        color: var(--muted-2);
        min-height: 1.4em;
        font-size: 0.86rem;
      }
    `;
    document.head.appendChild(styleElement);

    const details = document.createElement("details");
    details.id = "styleDatabaseExport";

    const summary = document.createElement("summary");
    summary.textContent = "Style database export";
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "details-body";

    const meta = document.createElement("p");
    meta.className = "style-export-meta";
    body.appendChild(meta);

    const textarea = document.createElement("textarea");
    textarea.id = "styleDatabaseExportText";
    textarea.readOnly = true;
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "Full style database export");
    body.appendChild(textarea);

    const buttons = document.createElement("div");
    buttons.className = "button-row";
    buttons.style.marginTop = "14px";
    buttons.style.marginBottom = "0";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "ghost";
    copyButton.textContent = "Copy full style database";

    const refreshButton = document.createElement("button");
    refreshButton.type = "button";
    refreshButton.className = "ghost";
    refreshButton.textContent = "Refresh export";

    buttons.append(copyButton, refreshButton);
    body.appendChild(buttons);

    const status = document.createElement("p");
    status.className = "style-export-status";
    body.appendChild(status);

    details.appendChild(body);

    const searchDetails = [...document.querySelectorAll("details")].find(section => section.querySelector("#styleSearch"));
    if (searchDetails) searchDetails.after(details);
    else document.querySelector(".tool")?.appendChild(details);

    function updateExport() {
      const exportText = STYLES.join("\n");
      textarea.value = exportText;
      meta.textContent = `${STYLES.length} active styles, one per line. This is the patched live database as the app sees it.`;
      status.textContent = "Export refreshed.";
      return exportText;
    }

    async function copyExport() {
      const exportText = updateExport();
      try {
        await navigator.clipboard.writeText(exportText);
        status.textContent = "Copied full style database.";
      } catch (error) {
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        status.textContent = "Selected and copied where supported. If not, long-press the text box and copy manually.";
      }
    }

    copyButton.addEventListener("click", copyExport);
    refreshButton.addEventListener("click", updateExport);
    details.addEventListener("toggle", () => {
      if (details.open) updateExport();
    });
    updateExport();
  }

  ensureOption(modeSelect, ABSTRACT_MODE_NAME, ABSTRACT_MODE_NAME, "Flat Colour / Low-Greeble");
  ensureOption(antiGreebleSelect, "abstract", "Abstract Guardrails", "lushControlled");
  installStyleDatabaseExport();
  updateCount();
  updateBadge();
  refreshCopyPreview();
  renderSearchResults();
})();
