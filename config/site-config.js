// Public site configuration for retargeting LM Digest.
// This file is served by GitHub Pages, so do not put secrets here.
// Keep topic IDs/categories aligned with the backend research profile.

window.LM_DIGEST_SITE_CONFIG = {
  backendUrl: 'https://lm-digest-intake-internal.yufanxu.workers.dev',
  domain: {
    name: 'liquid metal',
    label: 'Liquid Metal',
    labelPlural: 'Liquid Metals',
    defaultCategory: 'Biomedical, Robotics & Energy',
  },
  topics: [
    { id: 'nuclear', label: 'Nuclear, Accelerator & Fusion Applications' },
    { id: 'planetary', label: 'Planetary & Geo/Astrophysics' },
    { id: 'electronics', label: 'Flexible Electronics, Wearables & Soft Matter' },
    { id: 'biomedical', label: 'Biomedical, Robotics & Energy' },
  ],
  categoryOrder: [
    'Planetary & Geo/Astrophysics',
    'Nuclear, Accelerator & Fusion Applications',
    'Flexible Electronics, Wearables & Soft Matter',
    'Biomedical, Robotics & Energy',
  ],
  categoryAliases: {
    'Nuclear & Fusion Applications': 'Nuclear, Accelerator & Fusion Applications',
  },
};
