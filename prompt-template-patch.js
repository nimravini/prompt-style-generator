(() => {
  if (window.__styleComboPromptTemplatePatchInstalled) return;
  window.__styleComboPromptTemplatePatchInstalled = true;

  const ABSTRACT_MODE_NAME = "Abstract / Non-Figurative";
  const CHARACTER_MODE_NAME = "Character Styles / Animation";
  let styleNameOnlyToggle = null;

  const CHARACTER_STYLE_EXPANSION = [
    "UPA-Inspired Character Design Style – Angular mid-century shapes, limited-animation clarity, bold silhouettes, and clever graphic staging",
    "Mid-Century Limited Animation Character Style – Flat shapes, economical poses, strong silhouettes, and expressive simplified acting",
    "Graphic Shape Cartoon Character Design – Characters built from bold circles, triangles, wedges, and clean colour blocks",
    "Clean Vector Mascot Character Style – Polished brand-ready mascot art with simple shapes, crisp outlines, and friendly proportions",
    "Rubber-Hose Cartoon Character Style – Bendy limbs, pie-cut eyes, gloved hands, and elastic vintage cartoon motion",
    "Golden-Age Theatrical Cartoon Look – Squash-and-stretch characters, painted charm, lively expressions, and vintage animation polish",
    "Saturday Morning Cartoon Character Style – Bright heroic shapes, readable costumes, bold poses, and toyetic charm",
    "90s Cable Cartoon Character Style – Chunky silhouettes, offbeat expressions, graphic backgrounds, and playful gross-out shape language",
    "Indie Animation Pilot Character Style – Distinctive silhouettes, expressive faces, clean production-ready design, and bold colour identity",
    "Webtoon Character Illustration Style – Clean digital figures, expressive faces, dramatic lighting, and scroll-friendly composition",
    "Shonen Hero Character Design – Dynamic hair shapes, energetic poses, power motifs, and bold youthful costume language",
    "Shojo Magical-Girl Character Design – Sparkles, ribbon shapes, delicate costume motifs, and elegant transformation energy",
    "Josei Slice-of-Life Character Style – Stylish adult characters, grounded clothing, soft expressions, and subtle emotional posing",
    "Seinen Graphic Character Rendering – Mature proportions, sharper shadows, controlled detail, and cinematic character presence",
    "Kawaii Mascot Character Sheet – Ultra-cute simplified character design with rounded shapes, soft colours, and expression variants",
    "Chibi Expression Sheet Style – Tiny simplified figures with oversized heads, clear emotions, and sticker-like readability",
    "Super-Deformed RPG Character Style – Compact adventure characters with readable gear, bold silhouettes, and game-icon charm",
    "Sticker Mascot Character Design – Die-cut-ready character art with thick outlines, simple poses, and punchy appeal",
    "Vinyl Designer Toy Character Style – Smooth collectible-toy proportions, simplified features, glossy surfaces, and sculptural charm",
    "Plush Toy Character Concept – Soft stuffed-animal proportions, seam details, embroidered features, and cuddly silhouette logic",
    "Felt Craft Creature Character Style – Handmade felt-texture characters with stitched edges, soft forms, and tactile charm",
    "Paper Doll Character Design – Flat outfit layers, cutout silhouettes, wardrobe swaps, and playful dress-up presentation",
    "Fashion Doll Concept Art – Stylised figures, dramatic outfits, accessory focus, and polished toy-display presentation",
    "Character Wardrobe Lineup Style – Multiple outfit variants, consistent silhouette, accessory callouts, and clear design comparison",
    "Character Turnaround Model Sheet – Front, side, back, and three-quarter views with consistent proportions and production notes",
    "Character Expression Sheet – Clear facial emotion range, head angles, mouth shapes, and acting reference poses",
    "Character Pose Sheet – Action poses, idle poses, gesture studies, and readable body-language silhouettes",
    "Character Prop Sheet – Character-specific items, accessories, tools, and costume details shown as clean production callouts",
    "Creature Design Lineup – Multiple creature variants with silhouette comparison, anatomy notes, and scale-friendly presentation",
    "Cozy Creature Companion Style – Appealing animal-like companions with rounded forms, gentle expressions, and soft adventure charm",
    "Monster Mascot Character Style – Friendly monster design with bold shapes, expressive features, and playful asymmetry",
    "Kaiju Suit Character Concept – Large monster silhouette, practical-suit texture, bold proportions, and dramatic creature readability",
    "Dragon Companion Design – Expressive dragon character with readable wings, horns, markings, and personality-driven silhouette",
    "Fantasy Familiar Character Design – Small magical companion creature with charm, symbolic details, and strong silhouette identity",
    "Anthropomorphic Animal Character Design – Animal traits blended with expressive humanlike posing, costume, and personality cues",
    "Furry Character Reference Sheet Style – Clear character markings, front/back views, expression notes, and palette swatches",
    "Goblin Character Concept Style – Pointy silhouettes, expressive ears, scrappy clothing, and impish creature charm",
    "Witchy Character Design Sheet – Magical wardrobe, familiar motifs, potion props, and atmospheric character callouts",
    "Villain Silhouette Character Design – Dramatic shape language, sharp costume cues, and readable menace from outline alone",
    "Hero Team Lineup Style – Distinct cast silhouettes, varied heights, costume families, and group-composition clarity",
    "Sidekick Mascot Design – Small companion character built for charm, expressive posing, and instant visual recognition",
    "NPC Portrait Pack Style – Cohesive character portraits with varied faces, archetypes, clothing, and readable personality",
    "RPG Character Concept Art – Fantasy or sci-fi character design with gear, silhouette, material notes, and adventure-readiness",
    "Tactical Sci-Fi Character Concept – Modular armour, practical equipment, clear faction identity, and readable future-tech shapes",
    "Cyberpunk Character Sheet – Neon-accented clothing, tech implants, attitude-driven posing, and urban character identity",
    "Solarpunk Character Portrait Style – Warm ecological fashion, plant-tech motifs, optimistic colour, and soft futuristic styling",
    "Post-Apocalyptic Survivor Character Design – Worn layers, scavenged gear, practical silhouette, and survival-story details",
    "Retro Platformer Character Sprite – Small readable game character with bold silhouette, limited pixels, and iconic pose language",
    "Handheld RPG Battle Sprite – Compact character sprite with clear weapon, costume, palette, and turn-based game readability",
    "Fighting Game Character Select Portrait – Dramatic cropped portrait, strong attitude, costume identity, and arcade intensity",
    "Visual Novel Character Sprite Style – Clean front-facing character art with outfit variants, expressive faces, and readable staging",
    "Dating Sim Character Sprite Style – Polished character sprites, appealing outfits, expression changes, and clean romantic-comedy staging",
    "Cozy Farming Game Character Portrait – Friendly character busts, warm palettes, simple props, and village-life charm",
    "Board Game Character Card Art – Clear character portrait, readable role iconography, and tabletop-friendly framing",
    "Tabletop Miniature Concept Art – Character design focused on silhouette, sculptable details, pose clarity, and painted-material notes",
    "Fantasy Trading Card Character Art – Dramatic character focus, spell-like atmosphere, ornate framing, and collectible-card polish",
    "Children's Book Animal Character Style – Gentle animal characters with storybook warmth, soft gestures, and expressive faces",
    "Whimsical Storybook Character Style – Playful figures, cosy clothing, gentle linework, and narrative-friendly charm",
    "Editorial Cartoon Character Style – Exaggerated likeness-free figures, simple shapes, sharp expressions, and satirical readability",
    "Newspaper Comic Strip Character Style – Black linework, simple staging, recurring-cast silhouettes, and expressive panel acting",
    "Graphic Novel Character Inking – Confident ink contours, controlled shadows, readable anatomy, and sequential-art polish",
    "Character Silhouette Sticker Style – One-colour or two-colour character shapes built for instant recognition and merch use",
    "Cute Food Mascot Character Style – Snack or ingredient characters with faces, tiny limbs, and cheerful brand-mascot clarity",
    "Brand Mascot Turnaround Style – Commercial mascot views, simplified proportions, logo-friendly silhouette, and pose variants",
    "Educational Workbook Character Style – Friendly teaching characters, clear gestures, simple props, and accessible instructional design"
  ];

  function artTextReplacements() {
    const figurePlural = "stat" + "ues";
    const figureSingle = "stat" + "ue";
    const stoneWord = "mar" + "ble";
    return [
      [ new RegExp(`Vaporwave Classical Bust Collage\\s+[–—-]\\s+Retro remix of ${figurePlural}`, "gi"), "Vaporwave Classical Sculpture Collage – Retro remix of museum artefacts" ],
      [ /Vaporwave Classical Bust Collage/gi, "Vaporwave Classical Sculpture Collage" ],
      [ new RegExp(`Retro remix of ${figurePlural}`, "gi"), "Retro remix of museum artefacts" ],
      [ new RegExp(`Neoclassical ${stoneWord} Heroic Style\\s+[–—-]\\s+Balanced antique composition, sculptural figures, columns, and cool restraint`, "gi"), "Neoclassical Museum Sculpture Style – Balanced antique composition, antique figure studies, columns, and cool restraint" ],
      [ new RegExp(`Neoclassical ${stoneWord} Heroic Style`, "gi"), "Neoclassical Museum Sculpture Style" ],
      [ new RegExp(`${stoneWord} heroic`, "gi"), "museum sculpture" ],
      [ /classical bust/gi, "classical sculpture study" ],
      [ /bust collage/gi, "sculpture collage" ],
      [ new RegExp(`\\b${figurePlural}\\b`, "gi"), "museum artefacts" ],
      [ new RegExp(`\\b${figureSingle}\\b`, "gi"), "museum artefact" ]
    ];
  }

  function neutraliseArtWording(value) {
    if (typeof value !== "string") return value;
    return artTextReplacements().reduce(
      (text, [pattern, replacement]) => text.replace(pattern, replacement),
      value
    );
  }

  function splitStyleName(style) {
    return String(style || "").split(/\s+[–—-]\s+/)[0].trim();
  }

  function styleNamesOnlyActive() {
    return Boolean(styleNameOnlyToggle && styleNameOnlyToggle.checked);
  }

  function formatStyleForOutput(style) {
    const cleaned = neutraliseArtWording(stripTrailingStop(style || ""));
    return styleNamesOnlyActive() ? splitStyleName(cleaned) : cleaned;
  }

  function formattedComboText(slots = currentSlots) {
    return slots.filter(Boolean).map(formatStyleForOutput).join(" + ");
  }

  function formattedStyleLines(slots = currentSlots, prefix = "- ") {
    return slots.filter(Boolean).map(style => `${prefix}${formatStyleForOutput(style)}`).join("\n");
  }

  function addUniqueStyles(target, additions) {
    if (!Array.isArray(target)) return;
    additions.map(neutraliseArtWording).forEach(style => {
      if (style && !target.includes(style)) target.push(style);
    });
  }

  function patchStyleArray(target) {
    if (!Array.isArray(target)) return;
    target.splice(0, target.length, ...target.map(neutraliseArtWording));
  }

  function patchStoredStyleText() {
    patchStyleArray(STYLES);
    patchStyleArray(MOONLIT_JEWELBOX_STYLES);
    patchStyleArray(BEAUTIFUL_STYLES);
    patchStyleArray(FLAT_COLOUR_STYLES);

    Object.values(MODES).forEach(mode => {
      if (Array.isArray(mode.styles)) patchStyleArray(mode.styles);
    });

    if (Array.isArray(currentSlots)) {
      currentSlots = currentSlots.map(neutraliseArtWording);
    }
  }

  function ensureSelectOption(select, value, label, afterValue = null) {
    if (!select || [...select.options].some(option => option.value === value)) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    const after = afterValue ? [...select.options].find(existing => existing.value === afterValue) : null;
    if (after && after.nextSibling) select.insertBefore(option, after.nextSibling);
    else select.appendChild(option);
  }

  function patchCharacterStyles() {
    const characterStyles = CHARACTER_STYLE_EXPANSION.map(neutraliseArtWording);
    const characterPattern = /UPA|Character|Animation|Cartoon|Mascot|Creature|Anime|Manga|Webtoon|Chibi|Toy|Plush|Felt|Doll|Wardrobe|Turnaround|Expression|Pose|Prop|Monster|Kaiju|Dragon|Familiar|Anthropomorphic|Furry|Goblin|Witchy|Villain|Hero|Sidekick|NPC|RPG|Sci-Fi|Cyberpunk|Solarpunk|Survivor|Sprite|Game|Visual Novel|Dating Sim|Farming Game|Card|Miniature|Storybook|Editorial Cartoon|Comic Strip|Graphic Novel|Sticker|Workbook|Avatar|Amigurumi|Browser Pet|Ligne Claire|Peanuts|Safety Card|Corporate Memphis/i;

    addUniqueStyles(STYLES, characterStyles);
    addUniqueStyles(BEAUTIFUL_STYLES, characterStyles);
    addUniqueStyles(FLAT_COLOUR_STYLES, characterStyles);

    const modeStyles = STYLES.filter(style => characterPattern.test(style));
    MODES[CHARACTER_MODE_NAME] = {
      type: "manual",
      styles: modeStyles.length ? modeStyles : characterStyles
    };

    ensureSelectOption(modeSelect, CHARACTER_MODE_NAME, CHARACTER_MODE_NAME, "Flat Colour / Low-Greeble");
  }

  function installStyleNameOnlyToggle() {
    if (document.getElementById("styleNameOnlyToggleWrap")) {
      styleNameOnlyToggle = document.getElementById("styleNameOnlyToggle");
      return;
    }

    const anchor = copyPreviewWrap || document.querySelector(".copy-preview") || document.querySelector(".advanced-grid");
    const parent = anchor?.parentNode;
    if (!parent) return;

    const wrap = document.createElement("label");
    wrap.id = "styleNameOnlyToggleWrap";
    wrap.title = "Hide style descriptions in the combo and copied prompts.";
    wrap.style.display = "inline-flex";
    wrap.style.alignItems = "center";
    wrap.style.gap = "7px";
    wrap.style.width = "max-content";
    wrap.style.maxWidth = "100%";
    wrap.style.margin = "6px 0 10px";
    wrap.style.padding = "6px 10px";
    wrap.style.border = "1px solid rgba(255,255,255,0.14)";
    wrap.style.borderRadius = "999px";
    wrap.style.background = "rgba(255,255,255,0.045)";
    wrap.style.cursor = "pointer";
    wrap.style.userSelect = "none";
    wrap.style.fontSize = "0.78rem";
    wrap.style.fontWeight = "750";
    wrap.style.lineHeight = "1";

    styleNameOnlyToggle = document.createElement("input");
    styleNameOnlyToggle.id = "styleNameOnlyToggle";
    styleNameOnlyToggle.type = "checkbox";
    styleNameOnlyToggle.style.width = "14px";
    styleNameOnlyToggle.style.height = "14px";
    styleNameOnlyToggle.style.margin = "0";
    styleNameOnlyToggle.style.flex = "0 0 auto";

    const text = document.createElement("span");
    text.textContent = "Names Only";

    wrap.append(styleNameOnlyToggle, text);
    parent.insertBefore(wrap, anchor);

    styleNameOnlyToggle.addEventListener("change", () => {
      renderSlots();
      refreshCopyPreview();
    });
  }

  function patchRenderedOutput() {
    renderOutput = function() {
      const filled = currentSlots.filter(Boolean).map(formatStyleForOutput);
      output.innerHTML = "";
      if (!filled.length) {
        output.classList.add("output-empty");
        output.textContent = "Click Generate to summon the style chimera.";
        return;
      }
      output.classList.remove("output-empty");
      filled.forEach(style => {
        const piece = document.createElement("span");
        piece.className = "combo-piece";
        piece.textContent = style;
        output.append(piece);
      });
    };

    const originalRenderSlots = renderSlots;
    renderSlots = function() {
      originalRenderSlots();
      document.querySelectorAll(".slot-card").forEach((card, index) => {
        const text = card.querySelector(".slot-text");
        if (text && currentSlots[index]) text.textContent = formatStyleForOutput(currentSlots[index]);
      });
    };
  }

  function ensurePromptOption(value, label, afterValue = null) {
    if (!copyFormatSelect) return null;
    let option = [...copyFormatSelect.options].find(existing => existing.value === value);
    if (!option) {
      option = document.createElement("option");
      option.value = value;
      const after = afterValue ? [...copyFormatSelect.options].find(existing => existing.value === afterValue) : null;
      if (after && after.nextSibling) copyFormatSelect.insertBefore(option, after.nextSibling);
      else copyFormatSelect.appendChild(option);
    }
    option.textContent = label;
    return option;
  }

  function removePromptOption(value) {
    const option = [...copyFormatSelect.options].find(existing => existing.value === value);
    if (option) option.remove();
  }

  function patchPromptFormatMenu() {
    ensurePromptOption("clean", "Quick image prompt");
    ensurePromptOption("styleOnly", "Style direction only", "chatgpt");
    ensurePromptOption("img2img", "Img2Img / reference-safe", "styleOnly");
    removePromptOption("midjourney");

    if (copyFormatSelect.value === "midjourney") copyFormatSelect.value = "plain";
    if (copyCleanButton) copyCleanButton.textContent = "Copy quick prompt";
  }

  function patchAntiGreebleModes() {
    if (!ANTI_GREEBLE_MODES.standard) return;

    ANTI_GREEBLE_MODES.standard.suffix = "Prioritise clean silhouettes, readable shapes, deliberate detail placement, smooth surfaces, controlled texture, clear lighting, and an uncluttered background. Avoid unnecessary micro-detail, muddy surface noise, tiled texture, random particles, artificial grain, or visual artifacts.";

    ANTI_GREEBLE_MODES.strict.suffix = "Use crisp silhouettes, broad readable shapes, clean edges, restrained surface detail, clear focal hierarchy, and controlled lighting. Keep the background uncluttered. Avoid artifacting, muddy micro-detail, random particles, tiled texture, gritty overlay, and excessive decorative clutter unless essential to the concept.";
  }

  compactCleanupText = function() {
    const k = antiGreebleSelect.value;
    return k === "off" ? ""
      : k === "flatColour" ? "flat colours, clean edges, readable silhouettes, minimal shading, restrained detail, no texture noise"
      : k === "light" ? "clear hierarchy, readable shapes, controlled texture, no visual artifacts"
      : k === "standard" ? "clean silhouettes, readable shapes, controlled detail, uncluttered background, no visual artifacts"
      : k === "strict" ? "crisp silhouettes, restrained detail, clear focal hierarchy, controlled lighting, no clutter, no visual artifacts"
      : k === "img2imgSafe" ? "preserve the core composition and identity, simplify surface detail, avoid extra texture or clutter"
      : k === "lushControlled" ? "rich but controlled detail, broad shapes, readable ornament, clean lighting, low visual noise"
      : k === "abstract" ? "rich colour, layered texture, expressive detail, clean lighting, controlled complexity, no accidental figurative subjects"
      : "";
  };

  function abstractGuardrailsActive() {
    return modeSelect.value === ABSTRACT_MODE_NAME || antiGreebleSelect.value === "abstract";
  }

  function abstractDesignPriorities() {
    return [
      "Design priorities:",
      "Strong overall composition, balanced visual rhythm, intentional colour relationships, coherent spatial flow, and a consistent finish. Allow abstraction, ambiguity, and non-literal forms while keeping the image visually resolved.",
      "",
      "Abstract guardrails:",
      "Avoid forcing a literal subject, character, face, object, readable symbol, text, or single central focal point unless explicitly requested."
    ].join("\n");
  }

  function buildGeneralPrompt(formatName, combo, suffix, compact, stacked) {
    if (formatName === "plain") return combo;
    if (formatName === "stacked") return stacked;

    if (formatName === "clean") {
      return [
        "Create an image combining these visual styles:",
        combo + ".",
        suffix
      ].filter(Boolean).join(" ");
    }

    if (formatName === "chatgpt") {
      return [
        "Create an image using a hybrid visual direction that combines:",
        combo + ".",
        "Apply the style blend coherently to the requested subject, scene, object, pattern, layout, or abstract composition.",
        "Keep the visual hierarchy readable and the finish consistent.",
        suffix
      ].filter(Boolean).join(" ");
    }

    if (formatName === "styleOnly") {
      const lines = [
        "Style direction:",
        combo,
        "",
        "Use this as the visual treatment only. Preserve the requested subject, pose, composition, layout, and intent unless instructed otherwise."
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "img2img") {
      const lines = [
        "Transform the reference using this hybrid visual style:",
        combo,
        "",
        "Preserve the core identity, pose, composition, proportions, markings, and important details from the reference.",
        "Apply the style as a controlled visual treatment rather than redesigning the subject."
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "short") {
      return [
        combo,
        compact || "readable hierarchy, coherent style blend, controlled detail"
      ].filter(Boolean).join(", ");
    }

    if (formatName === "brief") {
      const lines = [
        "Visual direction:",
        stacked,
        "",
        "Design priorities:",
        "Use a coherent style blend, readable visual hierarchy, intentional composition, controlled detail, and a consistent finish.",
        "",
        "Use case:",
        "[optional: character design, sticker, poster, pattern, UI asset, scene, icon, reference sheet, etc.]"
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "structured") {
      return [
        "Subject / brief:",
        "[write the subject, character, object, scene, pattern, or layout here]",
        "",
        "Style blend:",
        stacked,
        "",
        "Composition / format:",
        "[aspect ratio, framing, viewpoint, output type, or layout]",
        "",
        "Mood / palette:",
        "[optional]",
        "",
        "Must preserve:",
        "[important identity, pose, shape, markings, logo, layout, or reference details]",
        "",
        "Avoid:",
        "[things to exclude]",
        "",
        "Cleanup:",
        suffix || "[add any constraints you want here]"
      ].join("\n");
    }

    return combo;
  }

  function buildAbstractPrompt(formatName, combo, suffix, compact, stacked) {
    if (formatName === "plain") return combo;
    if (formatName === "stacked") return stacked;

    if (formatName === "clean") {
      return [
        "Create an abstract, non-figurative image combining these visual styles:",
        combo + ".",
        "Focus on composition, rhythm, colour, texture, atmosphere, and spatial flow rather than a literal subject.",
        suffix
      ].filter(Boolean).join(" ");
    }

    if (formatName === "chatgpt") {
      return [
        "Create an abstract, non-figurative image using a hybrid visual direction that combines:",
        combo + ".",
        "Prioritise composition, colour relationships, visual rhythm, spatial flow, and atmosphere.",
        "Avoid forcing a literal subject, character, face, object, readable symbol, or single central focal point unless explicitly requested.",
        suffix
      ].filter(Boolean).join(" ");
    }

    if (formatName === "styleOnly") {
      const lines = [
        "Style direction:",
        combo,
        "",
        "Use this as the visual treatment only. Preserve the requested intent unless instructed otherwise.",
        "Focus on abstraction, rhythm, colour flow, atmosphere, and spatial movement."
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "img2img") {
      const lines = [
        "Transform the reference using this abstract, non-figurative hybrid visual style:",
        combo,
        "",
        "Preserve the core composition where useful, but translate the result toward abstraction, atmosphere, colour relationships, and spatial flow rather than literal depiction."
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "short") {
      return [
        combo,
        compact || "abstract composition, visual rhythm, colour flow"
      ].filter(Boolean).join(", ");
    }

    if (formatName === "brief") {
      const lines = [
        "Visual direction:",
        stacked,
        "",
        abstractDesignPriorities()
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "structured") {
      return [
        "Subject / brief:",
        "[optional — leave blank for pure abstraction, or describe the anchor idea here]",
        "",
        "Style blend:",
        stacked,
        "",
        "Composition / format:",
        "[aspect ratio, framing, output type, or layout]",
        "",
        "Mood / palette:",
        "[optional]",
        "",
        "Must preserve:",
        "[optional — if adapting from a reference]",
        "",
        "Avoid:",
        "[optional]",
        "",
        abstractDesignPriorities(),
        "",
        "Cleanup:",
        suffix || "[add any constraints you want here]"
      ].join("\n");
    }

    return combo;
  }

  buildPrompt = function(formatName = copyFormatSelect.value) {
    const combo = formattedComboText();
    const anti = ANTI_GREEBLE_MODES[antiGreebleSelect.value] || ANTI_GREEBLE_MODES.off;
    const suffix = anti.suffix.trim();
    const compact = compactCleanupText();
    const stacked = formattedStyleLines();

    if (!combo) return "";
    if (abstractGuardrailsActive()) return buildAbstractPrompt(formatName, combo, suffix, compact, stacked);
    return buildGeneralPrompt(formatName, combo, suffix, compact, stacked);
  };

  if (typeof writeClipboard === "function") {
    copyCleanPrompt = function() {
      writeClipboard(buildPrompt("clean"), "Quick prompt copied!");
    };
    if (copyCleanButton) copyCleanButton.onclick = copyCleanPrompt;
  }

  const originalModeChange = modeSelect.onchange;
  modeSelect.onchange = event => {
    if (modeSelect.value === ABSTRACT_MODE_NAME && antiGreebleSelect.value === "off") {
      antiGreebleSelect.value = "abstract";
    }
    if (originalModeChange) originalModeChange.call(modeSelect, event);
    updateBadge();
    refreshCopyPreview();
  };

  patchStoredStyleText();
  patchCharacterStyles();
  installStyleNameOnlyToggle();
  patchRenderedOutput();
  patchPromptFormatMenu();
  patchAntiGreebleModes();

  if (modeSelect.value === ABSTRACT_MODE_NAME && antiGreebleSelect.value === "off") {
    antiGreebleSelect.value = "abstract";
  }

  renderSlots();
  updateBadge();
  refreshCopyPreview();
  renderSearchResults();
})();
