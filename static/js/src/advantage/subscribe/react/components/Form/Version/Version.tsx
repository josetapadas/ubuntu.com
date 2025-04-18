import React, { useContext } from "react";
import { Col, List, Row, StatusLabel } from "@canonical/react-components";
import {
  defaultValues,
  FormContext,
} from "advantage/subscribe/react/utils/FormContext";
import {
  LTSVersions,
  ProductTypes,
} from "advantage/subscribe/react/utils/utils";
import { PRO_SELECTOR_KEYS } from "advantage/distributor/utils/utils";

const livepatch =
  "Kernel Livepatch to apply kernel patches at run time without the need for an immediate reboot";
const landscape = "Ubuntu systems management with Landscape";
const knowledgeBase = "Access to the Knowledge base";
const realtimeKernel = "Real-time kernel";
const KVMDrivers = "Certified Windows Drivers for KVM guests";
const CISBenchmark =
  "Certified CIS benchmark tooling and DISA-STIG configuration guide";
const CISBenchmarkAndAutomation =
  "Ubuntu Security Guide (USG) for certified CIS benchmark tooling and DISA-STIG tooling & automation";
const FIPS_140_2 =
  "FIPS 140-2 Level 1 cryptographic packages for FedRAMP, HIPAA and PCI-DSS compliance";
const FIPS_140_3 =
  "FIPS 140-3 Level 1 cryptographic packages for FedRAMP, HIPAA and PCI-DSS compliance";
const CIS =
  "Ubuntu Security Guide (USG) for CIS and DISA STIG benchmark tooling & automation";
const CISComingSoon = (
  <>
    Ubuntu Security Guide (USG) for certified CIS benchmark tooling & automation
    <StatusLabel appearance="positive">Coming soon</StatusLabel>
  </>
);
const CommonCriteria = "Common Criteria EAL2";
const ESMEndDate =
  "Expanded Security Maintenance (ESM) for packages in 'main' repository until";
const DesktopESMEndDate =
  "Expanded Security Maintenance (ESM) for packages in 'main' and 'universe' repositories until";
const AAD =
  "Advanced Active Directory integration including native GPO policy support, custom script execution and privilege management";

const PhysicalServerVersionDetails: {
  [key in LTSVersions]: Array<React.ReactNode>;
} = {
  [LTSVersions.noble]: [
    `${ESMEndDate} 2034`,
    livepatch,
    CISComingSoon,
    KVMDrivers,
    landscape,
    knowledgeBase,
    realtimeKernel,
  ],
  [LTSVersions.jammy]: [
    `${ESMEndDate} 2032`,
    livepatch,
    FIPS_140_3,
    CIS,
    KVMDrivers,
    landscape,
    knowledgeBase,
    realtimeKernel,
  ],
  [LTSVersions.focal]: [
    `${ESMEndDate} 2030`,
    livepatch,
    FIPS_140_2,
    CISBenchmarkAndAutomation,
    KVMDrivers,
    landscape,
    knowledgeBase,
  ],
  [LTSVersions.bionic]: [
    `${ESMEndDate} 2028`,
    livepatch,
    FIPS_140_2,
    CISBenchmark,
    CommonCriteria,
    KVMDrivers,
    landscape,
    knowledgeBase,
  ],
  [LTSVersions.xenial]: [
    `${ESMEndDate} 2026`,
    livepatch,
    FIPS_140_2,
    CISBenchmark,
    CommonCriteria,
    KVMDrivers,
    landscape,
    knowledgeBase,
  ],
};

const DesktopVersionDetails: {
  [key in LTSVersions]: Array<React.ReactNode>;
} = {
  [LTSVersions.noble]: [
    `${DesktopESMEndDate} 2034`,
    AAD,
    livepatch,
    CISComingSoon,
    landscape,
    knowledgeBase,
    realtimeKernel,
  ],
  [LTSVersions.jammy]: [
    `${DesktopESMEndDate} 2032`,
    AAD,
    livepatch,
    FIPS_140_3,
    CIS,
    landscape,
    knowledgeBase,
    realtimeKernel,
  ],
  [LTSVersions.focal]: [
    `${DesktopESMEndDate} 2030`,
    AAD,
    livepatch,
    FIPS_140_2,
    CISBenchmarkAndAutomation,
    landscape,
    knowledgeBase,
  ],
  [LTSVersions.bionic]: [
    `${DesktopESMEndDate} 2028`,
    livepatch,
    FIPS_140_2,
    CISBenchmark,
    CommonCriteria,
    landscape,
    knowledgeBase,
  ],
  [LTSVersions.xenial]: [
    `${DesktopESMEndDate} 2026`,
    livepatch,
    FIPS_140_2,
    CISBenchmark,
    CommonCriteria,
    landscape,
    knowledgeBase,
  ],
};

const Version = () => {
  const { version, setVersion, productType } = useContext(FormContext);

  const versionDetails =
    productType === ProductTypes.desktop
      ? DesktopVersionDetails
      : PhysicalServerVersionDetails;

  const versionsSegmentedControl = (
    <div className="p-segmented-control">
      <div
        className="p-segmented-control__list"
        role="tablist"
        aria-label="LTS version options"
      >
        {Object.keys(versionDetails).map((key) => {
          return (
            <button
              key={key}
              className="p-segmented-control__button"
              role="tab"
              aria-selected={version === key}
              aria-controls={key}
              id={key}
              onClick={(e) => {
                e.preventDefault();
                setVersion(key as LTSVersions);
                localStorage.setItem(
                  PRO_SELECTOR_KEYS.VERSION,
                  JSON.stringify(key as LTSVersions),
                );
              }}
            >
              {key} LTS
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div data-testid="wrapper">
      <Row>
        <Col size={12}>{versionsSegmentedControl}</Col>
      </Row>
      <Row>
        <Col size={12}>
          <h4 className="p-heading--5">
            All subscriptions for Ubuntu Pro {version} LTS include:
          </h4>
          <List
            className="versions-features"
            items={versionDetails[version ?? defaultValues.version]}
            divided
          />
        </Col>
      </Row>
    </div>
  );
};

export default Version;
