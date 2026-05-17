export type SiguiFeatureFlags = Record<string, boolean>;

export type DefineSiguiComponentsOptions = {
  tagPrefix?: string;
  force?: boolean;
  featureFlags?: SiguiFeatureFlags;
};

export function defineSiguiComponents(options?: DefineSiguiComponentsOptions): string[];
