(() => {
  if (window.__styleComboResultToolbarPatchInstalled) return;
  window.__styleComboResultToolbarPatchInstalled = true;

  const toolbarId = "resultToolbar";
  const formatId = "resultCopyFormatSelect";
  const lockTipId = "lockContextTip";

  function copyLabel() {
    return copyFormatSelect?.options?.[copyFormatSelect.selectedIndex]?.textContent || "Plain combo";
  }

  function antiLabel() {
    return ANTI_GREEBLE_MODES[antiGreebleSelect.value]?.label || "Off";
  }

  function syncResultControls() {
    const formatSelect = document.getElementById(formatId);
    if (formatSelect) formatSelect.value = copyFormatSelect.value;
    if (quickBadge) quickBadge.textContent = `Anti-greeble: ${antiLabel()}`;
    const antiState = document.getElementById("antiGreebleState");
    if (antiState) antiState.textContent = `Current state: ${antiLabel()}`;
  }

  function makeButton(text, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    return button;
  }

  function installToolbar() {
    if (document.getElementById(toolbarId) || !output || !copyFormatSelect) return;

    const style = document.createElement("style");
    style.textContent = `
      .result-toolbar {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(90px, 0.7fr) minmax(128px, 0.9fr);
        gap: 9px;
        align-items: stretch;
        margin-top: 2px;
      }
      .result-toolbar select,
      .result-toolbar button {
        min-height: 42px;
        border-radius: 999px;
        font-size: 0.86rem;
      }
      .result-toolbar select {
        padding-left: 14px;
        background-color: rgba(8, 7, 18, 0.62);
      }
      .result-toolbar .toolbar-bin-button {
        color: var(--text);
        background: rgba(255, 255, 255, 0.078);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.10);
      }
      .settings-section-stack { display: grid; gap: 14px; }
      .settings-section {
        display: grid;
        gap: 10px;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.13);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.045);
      }
      .settings-section-title {
        margin: 0;
        color: var(--accent-three);
        font-size: 0.78rem;
        font-weight: 1000;
        text-transform: uppercase;
        letter-spacing: 0.105em;
      }
      .setting-state-note,
      .lock-context-tip {
        margin: 0;
        color: var(--muted-2);
        font-size: 0.84rem;
        line-height: 1.42;
        text-transform: none;
        letter-spacing: normal;
        font-weight: 760;
      }
      .lock-context-tip {
        position: relative;
        z-index: 2;
        padding: 10px 12px;
        border: 1px solid rgba(249, 213, 110, 0.18);
        border-radius: 18px;
        color: #fff0b5;
        background: rgba(249, 213, 110, 0.075);
      }
      @media (max-width: 720px) {
        .result-toolbar { grid-template-columns: 1fr; }
        .result-toolbar select,
        .result-toolbar button { width: 100%; }
      }
    `;
    document.head.appendChild(style);

    const toolbar = document.createElement("div");
    toolbar.id = toolbarId;
    toolbar.className = "result-toolbar";
    toolbar.setAttribute("aria-label", "Result actions");

    const formatSelect = document.createElement("select");
    formatSelect.id = formatId;
    formatSelect.setAttribute("aria-label", "Copy format");
    [...copyFormatSelect.options].forEach(option => {
      formatSelect.append(new Option(option.textContent, option.value, option.defaultSelected, option.selected));
    });
    formatSelect.value = copyFormatSelect.value;
    formatSelect.onchange = () => {
      copyFormatSelect.value = formatSelect.value;
      copyFormatSelect.dispatchEvent(new Event("change", { bubbles: true }));
      syncResultControls();
    };

    const copyNow = makeButton("Copy", "secondary");
    copyNow.onclick = () => copyButton.click();

    const binCombo = makeButton("Exclude combo", "toolbar-bin-button");
    binCombo.onclick = () => excludeCurrentButton.click();

    toolbar.append(formatSelect, copyNow, binCombo);
    output.insertAdjacentElement("afterend", toolbar);

    syncResultControls();
  }

  function tidyPreviewLabels() {
    const title = document.querySelector(".copy-preview-title");
    if (title) title.textContent = "Preview";
    if (copyPreviewButton) copyPreviewButton.textContent = "Copy preview";
  }

  function organiseAdvanced() {
    const details = [...document.querySelectorAll("details")].find(item => item.querySelector("summary")?.textContent?.toLowerCase().includes("advanced"));
    const grid = details?.querySelector(".settings-grid");
    if (!grid || grid.dataset.organised === "true") return;

    const labels = [...grid.children].filter(node => node.matches?.("label"));
    const hasText = (node, text) => node.textContent.toLowerCase().includes(text.toLowerCase());
    const generation = labels.filter(label => hasText(label, "Slot recipe") || hasText(label, "Weirdness") || hasText(label, "Seed") || hasText(label, "Anti-greeble"));
    const copying = labels.filter(label => hasText(label, "Copy format"));
    const display = labels.filter(label => hasText(label, "Lock controls"));

    const stack = document.createElement("div");
    stack.className = "settings-section-stack";
    stack.dataset.organised = "true";

    function section(title, items) {
      const sectionNode = document.createElement("section");
      sectionNode.className = "settings-section";
      const heading = document.createElement("h3");
      heading.className = "settings-section-title";
      heading.textContent = title;
      const sectionGrid = document.createElement("div");
      sectionGrid.className = "settings-grid";
      items.forEach(item => sectionGrid.append(item));
      sectionNode.append(heading, sectionGrid);
      return sectionNode;
    }

    stack.append(section("Generation", generation), section("Copying", copying), section("Display", display));
    grid.replaceWith(stack);

    const antiControl = generation.find(label => hasText(label, "Anti-greeble"));
    if (antiControl && !document.getElementById("antiGreebleState")) {
      const state = document.createElement("span");
      state.id = "antiGreebleState";
      state.className = "setting-state-note";
      state.textContent = `Current state: ${antiLabel()}`;
      antiControl.append(state);
    }
  }

  function installLockTip() {
    if (!slotContainer || document.getElementById(lockTipId)) return;
    const tip = document.createElement("p");
    tip.id = lockTipId;
    tip.className = "lock-context-tip hidden";
    slotContainer.insertAdjacentElement("afterend", tip);
  }

  function updateLockTip() {
    const tip = document.getElementById(lockTipId);
    if (!tip) return;
    const count = Array.isArray(lockedSlots) ? lockedSlots.filter(Boolean).length : 0;
    tip.classList.toggle("hidden", count === 0);
    if (count) tip.textContent = `${count} slot${count === 1 ? " is" : "s are"} locked. Generate only rerolls the unlocked slots.`;
  }

  const oldUpdateBadge = updateBadge;
  updateBadge = function() {
    oldUpdateBadge();
    syncResultControls();
  };

  const oldRenderSlots = renderSlots;
  renderSlots = function() {
    oldRenderSlots();
    updateLockTip();
  };

  const oldRefreshCopyPreview = refreshCopyPreview;
  refreshCopyPreview = function() {
    oldRefreshCopyPreview();
    syncResultControls();
  };

  installToolbar();
  tidyPreviewLabels();
  organiseAdvanced();
  installLockTip();
  syncResultControls();
  updateLockTip();

  if (!window.__styleComboMediumModePatchInstalled) {
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

    const baseGetModePool = getModePool;
    getModePool = function() {
      if (splitModeActive()) return activeStylePool();
      return baseGetModePool();
    };

    const baseGetRoleInfo = getRoleInfo;
    getRoleInfo = function(index, count) {
      if (splitModeActive()) {
        return {
          recipe: { label: SPLIT_MODE_NAME },
          role: index === 0 ? "Art style" : "Art medium"
        };
      }
      return baseGetRoleInfo(index, count);
    };

    const baseGenerateCombo = generateCombo;
    generateCombo = function() {
      if (!splitModeActive()) return baseGenerateCombo();

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

    const baseRerollSlot = rerollSlot;
    rerollSlot = function(index) {
      if (!splitModeActive()) return baseRerollSlot(index);

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

    const baseRenderOutput = renderOutput;
    renderOutput = function() {
      if (!splitModeActive()) return baseRenderOutput();

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

    const baseRenderSlots = renderSlots;
    renderSlots = function() {
      setSplitUiState();
      baseRenderSlots();
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

    const baseBuildPrompt = buildPrompt;
    buildPrompt = function(formatName = copyFormatSelect.value) {
      if (!splitModeActive()) return baseBuildPrompt(formatName);

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

    const baseUpdateCount = updateCount;
    updateCount = function() {
      if (!splitModeActive()) return baseUpdateCount();

      const pool = activeStylePool();
      const excludedCount = excludedStyles.size;
      modeCount.textContent = `${SPLIT_MODE_NAME}: ${pool.length} active art styles · ${activeMediumPool().length} art media · ${excludedCount} excluded this session`;
      excludedNote.textContent = `Excluded styles are session-only. Refreshing the page clears them. Currently excluded: ${excludedCount}.`;
    };

    const baseUpdateBadge = updateBadge;
    updateBadge = function() {
      baseUpdateBadge();
      if (!splitModeActive()) return;
      const anti = ANTI_GREEBLE_MODES[antiGreebleSelect.value]?.label || "Off";
      quickBadge.textContent = `Art style + art medium · ${anti}`;
      refreshCopyPreview();
    };

    const baseModeChange = modeSelect.onchange;
    modeSelect.onchange = event => {
      if (splitModeActive()) {
        countSelect.value = "2";
        lockedSlots = [false, false];
        currentSlots = [currentSlots[0] || null, currentSlots[1] || null];
      }

      if (baseModeChange) baseModeChange.call(modeSelect, event);
      else generateCombo();

      setSplitUiState();
      renderSearchResults();
      updateCount();
      updateBadge();
    };

    const baseCountChange = countSelect.onchange;
    countSelect.onchange = event => {
      if (splitModeActive()) {
        countSelect.value = "2";
        generateCombo();
        return;
      }
      if (baseCountChange) baseCountChange.call(countSelect, event);
    };

    ensureModeOption();
    setSplitUiState();
    updateCount();
    updateBadge();
    refreshCopyPreview();
  }
})();