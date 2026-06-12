(() => {
  if (window.__styleComboPromptTemplatePatchInstalled) return;
  window.__styleComboPromptTemplatePatchInstalled = true;

  const ABSTRACT_MODE_NAME = "Abstract / Non-Figurative";
  let styleNameOnlyToggle = null;

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
    wrap.style.display = "flex";
    wrap.style.alignItems = "flex-start";
    wrap.style.gap = "10px";
    wrap.style.margin = "12px 0";
    wrap.style.padding = "12px 14px";
    wrap.style.border = "1px solid rgba(255,255,255,0.16)";
    wrap.style.borderRadius = "16px";
    wrap.style.background = "rgba(255,255,255,0.06)";
    wrap.style.cursor = "pointer";

    styleNameOnlyToggle = document.createElement("input");
    styleNameOnlyToggle.id = "styleNameOnlyToggle";
    styleNameOnlyToggle.type = "checkbox";
    styleNameOnlyToggle.style.marginTop = "3px";

    const text = document.createElement("span");
    text.innerHTML = `<strong>Names only</strong><br><small>Hide style descriptions in the combo and copied prompts, e.g. “Pop Art” instead of “Pop Art – Repeating images with loud colours”.</small>`;

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
