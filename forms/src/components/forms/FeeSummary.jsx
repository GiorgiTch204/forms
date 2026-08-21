"use client";

import { calculateFee, formatFeeAmount } from "../../../lib/feeCalculator";

export default function FeeSummary({ config, hectares, onHectaresChange }) {
  const parsed = parseFloat(hectares);
  const fee =
    hectares && Number.isFinite(parsed)
      ? calculateFee(config.feeConfig, parsed)
      : null;
  const isTiered = config.feeConfig?.type === "tiered";

  const formatBracketLabel = (bracket, index, brackets) => {
    const prev = brackets[index - 1];
    if (!prev) return `0.1 ჰა-მდე`;
    return `${prev.upTo}–${bracket.upTo} ჰა`;
  };

  return (
    <section className="space-y-4 py-6">
      <h2 className="text-base font-semibold text-gray-800">
        ვადა და საფასური
      </h2>

      <p className="text-sm text-gray-500">{config.termInfo}</p>

      {isTiered ? (
        <div>
          <p className="text-sm text-gray-500 mb-2">
            საფასური ფართობის მიხედვით:
          </p>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {config.feeConfig.brackets.map((bracket, index) => (
                  <tr
                    key={bracket.upTo}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-3 py-2 text-gray-600">
                      {formatBracketLabel(
                        bracket,
                        index,
                        config.feeConfig.brackets,
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700 font-medium">
                      {formatFeeAmount(bracket.amount)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3 py-2 text-gray-600">1000 ჰა-ზე მეტი</td>
                  <td className="px-3 py-2 text-right text-gray-700 font-medium">
                    ორმაგდება
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">{config.feeInfo}</p>
      )}

      <div className="max-w-xs">
        <label className="block text-sm text-gray-500 mb-1">
          ფართობი (ჰექტარი)
        </label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="მაგ. 2.5"
          value={hectares}
          onChange={(e) => onHectaresChange(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
      </div>

      {fee !== null && (
        <div className="bg-blue-50 rounded-md px-4 py-3">
          <span className="text-sm text-gray-600">გადასახდელი საფასური: </span>
          <span className="text-base font-semibold text-blue-700">
            {formatFeeAmount(fee)}
          </span>
        </div>
      )}
    </section>
  );
}