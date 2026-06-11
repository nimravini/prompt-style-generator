(() => {
  if (window.__styleComboArtWordingPatchInstalled) return;
  window.__styleComboArtWordingPatchInstalled = true;

  const artWordingReplacements = [
    [ /Vaporwave Classical Bust Collage\s+–\s+Retro remix of statues/gi, "Vaporwave Classical Sculpture Collage – Retro remix of museum artefacts" ],
    [ /Vaporwave Classical Bust Collage\s+Retro remix of statues/gi, "Vaporwave Classical Sculpture Collage – Retro remix of museum artefacts" ],
    [ /Neoclassical Marble Heroic Style\s+–\s+Balanced antique composition, sculptural figures, columns, and cool restraint/gi, "Neoclassical Museum Sculpture Style – Balanced antique composition, antique figure studies, columns, and cool restraint" ],
    [ /Neoclassical Marble Heroic Style\s+Balanced antique composition, sculptural figures, columns, and cool restraint/gi, "Neoclassical Museum Sculpture Style – Balanced antique composition, antique figure studies, columns, and cool restraint" ],
    [ /classical bust/gi, "classical sculpture study" ],
    [ /bust collage/gi, "sculpture collage" ],
    [ /Neoclassical Marble Heroic Style/gi, "Neoclassical Museum Sculpture Style" ],
    [ /marble heroic/gi, "museum sculpture" ],
    [ /\bstatues\b/gi, "museum artefacts" ],
    [ /\bstatue\b/gi, "museum artefact" ]
  ];

  function saferArtWording(value) {
    if (typeof value !== "string") return value;
    return artWordingReplacements.reduce(
      (text, [pattern, replacement]) => text.replace(pattern, replacement),
      value
    );
  }

  function patchArray(target) {
    if (!Array.isArray(target)) return;
    target.splice(0, target.length, ...target.map(saferArtWording));
  }

  patchArray(STYLES);
  patchArray(MOONLIT_JEWELBOX_STYLES);
  patchArray(BEAUTIFUL_STYLES);
  patchArray(FLAT_COLOUR_STYLES);

  Object.values(MODES).forEach(mode => {
    if (Array.isArray(mode.styles)) patchArray(mode.styles);
  });

  if (Array.isArray(currentSlots)) {
    currentSlots = currentSlots.map(saferArtWording);
  }

  if (typeof renderSlots === "function") renderSlots();
  if (typeof updateCount === "function") updateCount();
  if (typeof updateBadge === "function") updateBadge();
  if (typeof refreshCopyPreview === "function") refreshCopyPreview();
  if (typeof renderSearchResults === "function") renderSearchResults();
})();
