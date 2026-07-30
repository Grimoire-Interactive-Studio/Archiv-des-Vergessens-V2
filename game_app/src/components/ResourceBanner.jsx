import { formatNumber } from '../engine/math';

/**
 * ResourceBanner Component
 * Zeigt die gesammelten Ressourcen und die Produktionsrate an
 */
export function ResourceBanner({ mneme, totalYieldPerSecond }) {
  return (
    <section className="resource-banner">
      <div className="resource-item">
        <span className="resource-label">Gesammelte Mneme</span>
        <span className="resource-value">{formatNumber(mneme)}</span>
        <span className="resource-rate">+{formatNumber(totalYieldPerSecond)} / Sekunde</span>
      </div>
    </section>
  );
}

export default ResourceBanner;
