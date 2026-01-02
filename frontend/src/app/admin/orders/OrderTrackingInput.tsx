'use client';

import { useState } from 'react';

interface OrderTrackingInputProps {
  orderId: string;
  currentTrackingNumber?: string;
  onUpdate: (orderId: string, trackingNumber: string) => void;
}

export default function OrderTrackingInput({ orderId, currentTrackingNumber, onUpdate }: OrderTrackingInputProps) {
  const [trackingInput, setTrackingInput] = useState(currentTrackingNumber || '');
  const [showTrackingInput, setShowTrackingInput] = useState(false);

  const handleSubmit = () => {
    if (trackingInput.trim()) {
      onUpdate(orderId, trackingInput);
      setShowTrackingInput(false);
    }
  };

  if (currentTrackingNumber) {
    return (
      <div style={{ fontSize: '14px', color: '#666' }}>
        Tracking: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{currentTrackingNumber}</span>
      </div>
    );
  }

  if (showTrackingInput) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Tracking number"
          value={trackingInput}
          onChange={(e) => setTrackingInput(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', width: '200px' }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '8px 16px',
            background: '#a65b2b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
        <button
          onClick={() => setShowTrackingInput(false)}
          style={{
            padding: '8px 16px',
            background: '#f3f4f6',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowTrackingInput(true)}
      style={{
        padding: '8px 16px',
        background: '#f3f4f6',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      Add Tracking
    </button>
  );
}

