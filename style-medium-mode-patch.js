(() => {
  if (window.__styleComboMediumModePatchInstalled) return;
  window.__styleComboMediumModePatchInstalled = true;

  const SPLIT_MODE_NAME = "Art Style + Art Medium";
  const ART_MEDIUMS = [
    "Oil paint on canvas",
    "Watercolour on textured paper",
    "Gouache illustration",
    "Acrylic paint with visible brush texture",
    "Ink and wash",
    "Graphite pencil drawing",
    "Coloured pencil on toned paper",
    "Charcoal drawing",
    "Soft pastel",
    "Oil pastel",
    "Digital painting",
    "Vector illustration",
    "3D clay render",
    "Cel-shaded digital render",
    "Pixel art sprites",
    "Risograph print",
    "Screenprint",
    "Linocut print",
    "Woodblock print",
    "Etching print",
    "Collage with cut paper",
    "Needle-felted wool",
    "Embroidery thread",
    "Ceramic sculpture",
    "Porcelain figurine",
    "Stained glass",
    "Mosaic tile",
    "Neon tubing",
    "Airbrushed poster paint",
    "Film photography",
    "Instant film photograph",
    "Cyanotype print",
    "VHS still frame",
    "Holographic foil sticker",
    "Enamel pin artwork",
    "Sticker sheet print",
    "Notebook doodle ink",
    "Blueprint line drawing",
    "Textile pattern print",
    "Paper craft diorama"
  ];

  const originalAdvancedNote = typeof advancedNote !== "undefined" ? advancedNote.textContent : "";

  function splitModeActive() {
    return modeSelect.value === SPLIT_MODE_NAME;
  }

  function cleanSlotValue(value) {
    return stripTrailingStop(String(value || "").trim());
  }

  function splitStyleName(value) {
    return cleanSlotValue(value).split(/\s+[–—-]\s+/)[0].trim();
  }

  function namesOnlyActive() {
    return Boolean(document.getElementById("styleNameOnlyToggle")?.checked);
  }

  function formatSplitStyle(value) {
    return namesOnlyActive() ? splitStyleName(value) : cleanSlotValue(value);
  }

  function uniqueValues(source) {
    return [...new Set(source.filter(Boolean))];
  }

  function activeStylePool() {
    return uniqueValues(STYLES).filter(style => !excludedStyles.has(style));
  }

  function activeMediumPool() {
    return uniqueValues(ART_MEDIUMS).filter(medium => !excludedStyles.has(medium));
  }

  function chooseSplitValue(pool, rng, used = new Set()) {
    const usable = pool.filter(item => !used.has(item));
    if (!usable.length) return null;
    return usable[Math.floor(rng() * usable.length)];
  }

  function ensureModeOption() {
    MODES[SPLIT_MODE_NAME] = { type: "manual", styles: STYLES };
    if ([...modeSelect.options].some(option => option.value === SPLIT_MODE_NAME)) return;
    const option = document.createElement("option");
    option.value = SPLIT_MODE_NAME;
    option.textContent = SPLIT_MODE_NAME;
    const after = [...modeSelect.options].find(existing => existing.value === "Everything");
    if (after && after.nextSibling) modeSelect.insertBefore(option, after.nextSibling);
    else modeSelect.appendChild(option);
  }

  function setSplitUiState() {
    const active = splitModeActive();
    countSelect.disabled = active;
    countSelect.title = active ? "Split mode always uses one art style slot and one art medium slot." : "";
    if (active) {
      countSelect.value = "2";
      if (advancedNote) {
        advancedNote.textContent = "Split mode rolls one art style and one art medium separately, so copy formats can keep the visual direction and material/technique apart.";
      }
    } else if (advancedNote && originalAdvancedNote) {
      advancedNote.textContent = originalAdvancedNote;
    }
  }

  const oldGetModePool = getModePool;
  getModePool = function() {
    if (splitModeActive()) return activeStylePool();
    return oldGetModePool();
  };

  const oldGetRoleInfo = getRoleInfo;
  getRoleInfo = function(index, count) {
    if (splitModeActive()) {
      return {
        recipe: { label: SPLIT_MODE_NAME },
        role: index === 0 ? "Art style" : "Art medium"
      };
    }
    return oldGetRoleInfo(index, count);
  };

  const oldGenerateCombo = generateCombo;
  generateCombo = function() {
    if (!splitModeActive()) return oldGenerateCombo();

    countSelect.value = "2";
    syncLockArray(2);

    const rng = getRng("style-medium");
    const used = new Set(currentSlots.filter((slot, index) => lockedSlots[index] && slot));

    if (!(lockedSlots[0] && currentSlots[0])) {
      currentSlots[0] = chooseSplitValue(activeStylePool(), rng, used);
      if (currentSlots[0]) used.add(currentSlots[0]);
    }

    if (!(lockedSlots[1] && currentSlots[1])) {
      currentSlots[1] = chooseSplitValue(activeMediumPool(), rng, used);
    }

    currentSlots = currentSlots.slice(0, 2);
    lockedSlots = lockedSlots.slice(0, 2);
    seedStep++;
    toast.textContent = "";
    setSplitUiState();
    renderSlots();
    updateCount();
    updateBadge();
  };

  const oldRerollSlot = rerollSlot;
  rerollSlot = function(index) {
    if (!splitModeActive()) return oldRerollSlot(index);

    countSelect.value = "2";
    syncLockArray(2);

    const rng = getRng(`style-medium-slot-${index}`);
    currentSlots[index] = index === 0
      ? chooseSplitValue(activeStylePool(), rng, new Set([currentSlots[1]].filter(Boolean)))
      : chooseSplitValue(activeMediumPool(), rng, new Set([currentSlots[0]].filter(Boolean)));

    lockedSlots[index] = false;
    seedStep++;
    toast.textContent = "";
    setSplitUiState();
    renderSlots();
    updateCount();
    updateBadge();
  };

  const oldRenderOutput = renderOutput;
  renderOutput = function() {
    if (!splitModeActive()) return oldRenderOutput();

    const artStyle = formatSplitStyle(currentSlots[0]);
    const artMedium = cleanSlotValue(currentSlots[1]);
    output.innerHTML = "";

    if (!artStyle && !artMedium) {
      output.classList.add("output-empty");
      output.textContent = "Click Generate to roll an art style and art medium.";
      return;
    }

    output.classList.remove("output-empty");
    [
      ["Art style", artStyle],
      ["Art medium", artMedium]
    ].filter(([, value]) => value).forEach(([label, value]) => {
      const piece = document.createElement("span");
      piece.className = "combo-piece";
      piece.textContent = `${label}: ${value}`;
      output.append(piece);
    });
  };

  const oldRenderSlots = renderSlots;
  renderSlots = function() {
    setSplitUiState();
    oldRenderSlots();
    if (!splitModeActive()) return;

    document.querySelectorAll(".slot-card").forEach((card, index) => {
      const text = card.querySelector(".slot-text");
      if (!text) return;
      text.textContent = index === 0 ? formatSplitStyle(currentSlots[0]) : cleanSlotValue(currentSlots[1]);
    });
  };

  function splitLines() {
    const artStyle = formatSplitStyle(currentSlots[0]);
    const artMedium = cleanSlotValue(currentSlots[1]);
    return { artStyle, artMedium, stacked: [`Art style: ${artStyle}`, `Art medium: ${artMedium}`].join("\n") };
  }

  const oldBuildPrompt = buildPrompt;
  buildPrompt = function(formatName = copyFormatSelect.value) {
    if (!splitModeActive()) return oldBuildPrompt(formatName);

    const { artStyle, artMedium, stacked } = splitLines();
    if (!artStyle && !artMedium) return "";

    const anti = ANTI_GREEBLE_MODES[antiGreebleSelect.value] || ANTI_GREEBLE_MODES.off;
    const suffix = anti.suffix.trim();
    const compact = compactCleanupText();
    const inline = `${artStyle} using ${artMedium}`;

    if (formatName === "plain" || formatName === "stacked") return stacked;

    if (formatName === "clean") {
      return [
        "Create an image with this separated visual direction:",
        `Art style: ${artStyle}.`,
        `Art medium: ${artMedium}.`,
        suffix
      ].filter(Boolean).join(" ");
    }

    if (formatName === "chatgpt") {
      return [
        "Create an image using this separated art direction.",
        `Art style: ${artStyle}.`,
        `Art medium / technique: ${artMedium}.`,
        "Keep the style language and the medium treatment distinct but coherent in the final image.",
        suffix
      ].filter(Boolean).join(" ");
    }

    if (formatName === "styleOnly") {
      const lines = [
        "Style direction:",
        `Art style: ${artStyle}`,
        `Art medium: ${artMedium}`,
        "",
        "Use these as the visual treatment only. Preserve the requested subject, pose, composition, layout, and intent unless instructed otherwise."
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "img2img") {
      const lines = [
        "Transform the reference using this separated visual treatment:",
        `Art style: ${artStyle}`,
        `Art medium: ${artMedium}`,
        "",
        "Preserve the core identity, pose, composition, proportions, markings, and important details from the reference. Apply the style and medium as controlled surface treatment rather than redesigning the subject."
      ];
      if (suffix) lines.push("", "Cleanup:", suffix);
      return lines.join("\n");
    }

    if (formatName === "short") {
      return [inline, compact || "readable hierarchy, coherent finish, controlled detail"].filter(Boolean).join(", ");
    }

    if (formatName === "brief") {
      const lines = [
        "Visual direction:",
        stacked,
        "",
        "Design priorities:",
        "Keep the art style and art medium legible as separate decisions while making them work together as one coherent image.",
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
        "Art style:",
        artStyle,
        "",
        "Art medium:",
        artMedium,
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

    return inline;
  };

  const oldUpdateCount = updateCount;
  updateCount = function() {
    if (!splitModeActive()) return oldUpdateCount();

    const pool = activeStylePool();
    const excludedCount = excludedStyles.size;
    modeCount.textContent = `${SPLIT_MODE_NAME}: ${pool.length} active art styles · ${activeMediumPool().length} art media · ${excludedCount} excluded this session`;
    excludedNote.textContent = `Excluded styles are session-only. Refreshing the page clears them. Currently excluded: ${excludedCount}.`;
  };

  const oldUpdateBadge = updateBadge;
  updateBadge = function() {
    oldUpdateBadge();
    if (!splitModeActive()) return;
    const anti = ANTI_GREEBLE_MODES[antiGreebleSelect.value]?.label || "Off";
    quickBadge.textContent = `Art style + art medium · ${anti}`;
    refreshCopyPreview();
  };

  const oldModeChange = modeSelect.onchange;
  modeSelect.onchange = event => {
    if (splitModeActive()) {
      countSelect.value = "2";
      lockedSlots = [false, false];
      currentSlots = [currentSlots[0] || null, currentSlots[1] || null];
    }

    if (oldModeChange) oldModeChange.call(modeSelect, event);
    else generateCombo();

    setSplitUiState();
    renderSearchResults();
    updateCount();
    updateBadge();
  };

  const oldCountChange = countSelect.onchange;
  countSelect.onchange = event => {
    if (splitModeActive()) {
      countSelect.value = "2";
      generateCombo();
      return;
    }
    if (oldCountChange) oldCountChange.call(countSelect, event);
  };

  ensureModeOption();
  setSplitUiState();
  updateCount();
  updateBadge();
  refreshCopyPreview();
})();