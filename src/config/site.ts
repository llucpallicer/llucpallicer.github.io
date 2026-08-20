/** Site-wide config — update cvUrl when a CV PDF is available. */
export const siteConfig = {
  cvUrl: import.meta.env.VITE_CV_URL ?? '',
};
