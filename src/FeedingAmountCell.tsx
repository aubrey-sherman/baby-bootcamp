import React, { useState, useEffect } from 'react';
import './FeedingAmountCell.css';
import { DateTime } from 'luxon';

type FeedingAmountCellProps = {
  volumeInOunces?: number;
  blockId?: string;
  entryId?: string;
  onAmountSave: (
    blockId: string, entryId: string, newAmount: number
  ) => void;
}

/** Displays and allows editing of the feeding amount.
 *
 * CalendarCell -> FeedingAmountCell
 */
function FeedingAmountCell({
  volumeInOunces = 0,
  blockId,
  entryId,
  onAmountSave
}: FeedingAmountCellProps) {
  const [submitted, setSubmitted] = useState(false);
  const [initialWholeNumber, initialDecimal] = volumeInOunces.toFixed(2).split('.');
  const [wholeNumber, setWholeNumber] = useState(initialWholeNumber);
  const [decimalPart, setDecimalPart] = useState(initialDecimal);

  // Update state when prop changes
  useEffect(() => {
    const [newWholeNumber, newDecimal] = volumeInOunces.toFixed(2).split('.');
    setWholeNumber(newWholeNumber);
    setDecimalPart(newDecimal);
  }, [volumeInOunces]);

  function handleWholeNumberChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === '' || /^-?\d+$/.test(value)) {
      setWholeNumber(value);
    }
  };

  function handleDecimalChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === '' || /^\d{0,2}$/.test(value)) {
      setDecimalPart(value.padStart(2, '0'));
    }
  };

  const wholeNumbers = Array.from({ length: 16 }, (_, i) => i);
  const decimalNumbers = Array.from({ length: 4 }, (_, i) =>
    (i * 25).toString().padStart(2, '0')
  );

  const combinedNumber = `${wholeNumber || '0'}.${decimalPart || '00'}`;

  /** Converts saved value from string to number and calls onAmountSave in parent. */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    const newAmount = Number(combinedNumber);

    // Validate the blockId and entryId instead of using non-null assertion
    if (!blockId || !entryId) {
      console.error('Missing blockId or entryId');
      return;
    }

    // Validate the number before saving
    if (isNaN(newAmount)) {
      console.error('Invalid number format');
      return;
    }

    onAmountSave(blockId!, entryId!, newAmount);
  }

  return (
    <div className='FeedingAmountCell'>
      <form onSubmit={handleSubmit}>
        Volume in oz<br />
        <select
          value={wholeNumber}
          onChange={handleWholeNumberChange}
          className="input-right-side"
        >
          {wholeNumbers.map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <span className="decimal-point">.</span>

        <select
          value={decimalPart}
          onChange={handleDecimalChange}
          className="input-left-side"
        >
          {decimalNumbers.map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <button type='submit' className='submit-button'>
          Edit amount
        </button>
      </form>
    </div>
  )
}

export default FeedingAmountCell;