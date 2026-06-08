(() => {
  if (window.__styleComboDataPatchInstalled) return;
  window.__styleComboDataPatchInstalled = true;

  const STYLE_UPDATES = [
    { title: "Gothic Victorian", text: "Gothic Victorian Dark, ornate historical style", aliases: ["Gothic"] },
    { title: "Whimsical Miniature Diorama", text: "Whimsical Miniature Diorama Tiny world built with detail" },
    { title: "Macabre Victorian Mourning Portrait", text: "Macabre Victorian Mourning Portrait Creepy antique vibe", aliases: ["Macabre Mourning Portrait"] },
    { title: "Solarpunk Botanical City Style", text: "Solarpunk Botanical City Style Green architecture, sunlight, community tech, abundant plant life" },
    { title: "Medieval Marginalia Creature Style", text: "Medieval Marginalia Creature Style Odd little manuscript beasts doing ridiculous border activities" },
    { title: "Early Renaissance Panel Style", text: "Early Renaissance Panel Style Tempera clarity, balanced perspective, calm architectural staging" },
    { title: "Baroque Chiaroscuro Drama", text: "Baroque Chiaroscuro Drama Theatrical light, deep shadows, sweeping drapery, opulent intensity" },
    { title: "Rococo Pastel Ornament Style", text: "Rococo Pastel Ornament Style Airy shell curves, gilded flourishes, soft luxury and playful elegance" },
    { title: "Neoclassical Marble Heroic Style", text: "Neoclassical Marble Heroic Style Balanced antique composition, sculptural figures, columns and cool restraint" },
    { title: "Romantic Sublime Landscape", text: "Romantic Sublime Landscape Stormy ruins, moonlight, wild nature and brooding emotional scale" },
    { title: "Post-Impressionist Decorative Painting", text: "Post-Impressionist Decorative Painting Bold contour, expressive colour, structured brushwork and patterned forms" },
    { title: "Symbolist Dream Allegory", text: "Symbolist Dream Allegory Mystical figures, moons, masks and decadent dreamlike symbolism" },
    { title: "Fauvist Colour Painting", text: "Fauvist Colour Painting Wild saturation, bold contours and non-natural expressive colour" },
    { title: "Abstract Expressionist Gesture Painting", text: "Abstract Expressionist Gesture Painting Splashes, drips and raw gestural brush energy" },
    { title: "Arts and Crafts Pattern Style", text: "Arts and Crafts Pattern Style Handcrafted floral repeats, natural ornament and warm material honesty" },
    { title: "Zoological Natural History Plate", text: "Zoological Natural History Plate Detailed animal studies with labels, specimen poses and scientific precision" },
    { title: "Clinical Medical Diagram Style", text: "Clinical Medical Diagram Style Clean anatomical or biological diagramming with labels and instructional clarity" },
    { title: "Editorial Spot Illustration", text: "Editorial Spot Illustration Conceptual magazine-style metaphor images with clean silhouettes" },
    { title: "Superhero Comic Splash Page", text: "Superhero Comic Splash Page Dynamic foreshortening, dramatic inks, speed lines and punch lighting" },
    { title: "Underground Comix Style", text: "Underground Comix Style Heavy ink, counterculture cartooning, grotesque satire and rough print attitude" },
    { title: "Shōjo Manga Romance Style", text: "Shōjo Manga Romance Style Sparkles, floral overlays, airy hair, soft framing and emotive eyes" },
    { title: "Manga Horror Ink Style", text: "Manga Horror Ink Style Dense blacks, unsettling line detail and claustrophobic eerie framing" },
    { title: "Anime Cel Animation Style", text: "Anime Cel Animation Style Clean contour, flat shadow bands, painted backgrounds and cel-like colour" },
    { title: "Limited TV Animation Style", text: "Limited TV Animation Style Held poses, simplified movement, bold flat shapes and clever staging" },
    { title: "Impasto Oil Paint Style", text: "Impasto Oil Paint Style Thick ridged paint, palette-knife texture and raised painterly surface" },
    { title: "Fresco Mural Painting", text: "Fresco Mural Painting Matte plaster wall texture, monumental composition and weathered pigments" },
    { title: "Egg Tempera Panel Style", text: "Egg Tempera Panel Style Crisp detail, matte pigment and delicate luminous panel-paint finish" },
    { title: "Airbrush Gradient Poster Style", text: "Airbrush Gradient Poster Style Soft sprayed gradients, velvety transitions and retro shine" },
    { title: "Pictorialist Soft-Focus Photography", text: "Pictorialist Soft-Focus Photography Hazy tonal prints, poetic blur and painterly photographic atmosphere" },
    { title: "Straight Photography Style", text: "Straight Photography Style Sharp focus, rigorous composition and clean observational realism" },
    { title: "Documentary Photography Style", text: "Documentary Photography Style Candid lived-in realism, available light and social texture" },
    { title: "New Vision Modernist Photography", text: "New Vision Modernist Photography Radical angles, close crops, shadows and machine-age geometry" },
    { title: "High-Fashion Photography Editorial", text: "High-Fashion Photography Editorial Polished lighting, poses, styling and magazine drama" },
    { title: "Italian Neorealist Film Look", text: "Italian Neorealist Film Look Street-location realism, natural light and anti-glamour human texture" },
    { title: "Technicolor Cinema Look", text: "Technicolor Cinema Look Saturated classic-studio colour, glossy drama and storybook brightness" },
    { title: "Giallo Horror Lighting", text: "Giallo Horror Lighting Lurid red-blue shadows, stylish thriller framing and theatrical dread" },
    { title: "Pattachitra Folk Painting", text: "Pattachitra Folk Painting Flat mythic figures, decorative borders and narrative scroll-like detail" },
    { title: "Kalighat Painting Style", text: "Kalighat Painting Style Sweeping brush contours, simplified figures and folk-market immediacy" },
    { title: "Madhubani Painting Style", text: "Madhubani Painting Style Dense pattern fills, double outlines, folk symbols and vivid flat colour" },
    { title: "Kantha Embroidery Surface", text: "Kantha Embroidery Surface Running-stitch texture, quilted cloth and handmade narrative threadwork" },
    { title: "Batik Wax-Resist Textile", text: "Batik Wax-Resist Textile Crackled dye patterns, layered cloth colour and organic resist edges" },
    { title: "Mid-Century Modern Interior Illustration", text: "Mid-Century Modern Interior Illustration Teak furniture, warm geometry, organic curves and clean domestic design" },
    { title: "Low-Poly 3D Style", text: "Low-Poly 3D Style Faceted polygons, simplified geometry and stylised game-ready shapes" },
    { title: "Cel-Shaded Toon Render", text: "Cel-Shaded Toon Render 3D forms with flat shadow bands, crisp outlines and comic/game clarity" },
    { title: "Corporate Memphis Vector Illustration", text: "Corporate Memphis Vector Illustration Flat pastel people, bendy limbs, friendly abstract office shapes" }
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

  function replaceArrayContents(target, source) {
    target.splice(0, target.length, ...uniquePool(source));
  }

  const moonlitPattern = /Kintsugi|Aero|Foggy|Renaissance|Astronomical|Astrology|Byzantine|Persian|Nouveau|Vaporwave|Tarot|Mosaic|Crystal|Mandala|Holographic|Art Deco|Potion|Quilling|Mughal|Ottoman|Papercut|Celestial|Glass|Illumination|Painting|Porcelain|Tile|Marquetry|Majolica|Botanical|Baroque|Rococo|Romantic|Symbolist|Tempera|Fresco|Giallo|Ornament|Drama/i;
  const beautifulPattern = /Kintsugi|Felt|Aero|Foggy|Kawaii|Psychedelia|Marker|Bokeh|Synthwave|Minhwa|Renaissance|Fantasy|Cottagecore|Neon|Porcelain|Pastel|Gouache|Colored Pencil|Lofi|Cyanotype|Byzantine|Amigurumi|Persian|Nouveau|Vaporwave|Mosaic|Cosmic|Crystal|Impressionist|Watercolor|Pichwai|Airline|Card|Embroidery|Mandala|Holographic|Cloudcore|Vintage Travel|Botanical|Fairy|Diorama|Potion|Quilling|Mughal|Alebrije|Ottoman|Majolica|Papercut|Tarot|Talavera|Delft|Baroque|Rococo|Romantic|Post-Impressionist|Symbolist|Fauvist|Arts and Crafts|Tempera|Fresco|Impasto|Airbrush|Technicolor|Pattachitra|Kalighat|Madhubani|Kantha|Batik|Mid-Century|Cel-Shaded/i;
  const flatPattern = /Graffiti|Vector|8-Bit|Enamel|Chart|Mid-Century|Stencil|Mascot|Turnaround|Papel|Brutalist|Transit|Neon Sign|Emblem|Spreadsheet|Flyer|Glass|De Stijl|Ligne Claire|Safety|Matchbox|Heraldic|Flat|Radar|Contour|Pictogram|Infographic|Airline|Suprematist|Neo-Memphis|Art Deco|Tomb|Wayfinding|Bauhaus|Topographic|Typographic|Comic Strip|Monoline|Peanuts|Pop-Illustration|Sci-Fi|Avatar|Portrait on Color|Constructivist|Swiss|Silhouettes|Editorial|Comic|Manga|Anime|Limited TV|Diagram|Poster|Folk|Pattachitra|Kalighat|Madhubani|Low-Poly|Cel-Shaded|Corporate Memphis/i;

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

  ensureOption(modeSelect, ABSTRACT_MODE_NAME, ABSTRACT_MODE_NAME, "Flat Colour / Low-Greeble");
  ensureOption(antiGreebleSelect, "abstract", "Abstract Guardrails", "lushControlled");
  updateCount();
  updateBadge();
  refreshCopyPreview();
  renderSearchResults();
})();
