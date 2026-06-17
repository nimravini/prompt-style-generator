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
})();
