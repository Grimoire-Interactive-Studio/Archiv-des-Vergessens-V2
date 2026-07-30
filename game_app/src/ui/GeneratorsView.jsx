import GeneratorCard from './GeneratorCard';

export function GeneratorsView({
  generators = {},
  mneme = 0,
  buyMultiplier = 1,
  setBuyMultiplier,
  purchasedKey,
  stats = {},
  onGatherClick,
  onBuyGenerator
}) {
  return (
    <>
      <section className="click-section">
        <button className="btn-gather" onClick={onGatherClick}>
          ✦ Mneme-Partikel Sammeln (+1)
        </button>
      </section>

      {/* Bulk Buy Selector Header */}
      <section className="bulk-buy-bar">
        <span className="bulk-buy-label">Kaufmenge:</span>
        <div className="bulk-buy-toggle">
          {[1, 10, 100, 'max'].map((mult) => (
            <button
              key={mult}
              className={`btn-bulk-option ${buyMultiplier === mult ? 'active' : ''}`}
              onClick={() => setBuyMultiplier && setBuyMultiplier(mult)}
            >
              {mult === 'max' ? 'MAX' : `x${mult}`}
            </button>
          ))}
        </div>
      </section>

      {/* Generators Grid */}
      <section className="generators-grid">
        {Object.entries(generators)
          .filter((_, index, array) => {
            if (index === 0) return true;
            const prevGen = array[index - 1][1];
            return prevGen.level >= 10;
          })
          .map(([key, gen]) => (
            <GeneratorCard
              key={key}
              genKey={key}
              gen={gen}
              mneme={mneme}
              buyMultiplier={buyMultiplier}
              purchasedKey={purchasedKey}
              stats={stats}
              onBuy={onBuyGenerator}
            />
          ))}
      </section>
    </>
  );
}

export default GeneratorsView;
