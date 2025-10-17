import { ManifestService } from "@dcd/shared/data-access/manifest";
import { MockManifestService } from "./mock-services/manifest.service";

export const getMockProviders = () => {
  return [
    // Mock Services
    { provide: ManifestService, useClass: MockManifestService }
  ];
};
