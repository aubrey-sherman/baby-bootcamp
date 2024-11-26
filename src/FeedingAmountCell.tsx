import React, { useState, useEffect } from 'react';
import './FeedingAmountCell.css';

type FeedingAmountCellProps = {
  volumeInOunces: number;
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
  onAmountSave
}: FeedingAmountCellProps) {
  const [submitted, setSubmitted] = useState(false);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    onAmountSave(blockId, entryId, newAmount);

  }

  return (
    <div className='FeedingAmountCell'>
        Amount: {volumeInOunces} oz.
        <button type='submit' className='submit-button'>Edit amount</button>
    </div>
  )
}

export default FeedingAmountCell;