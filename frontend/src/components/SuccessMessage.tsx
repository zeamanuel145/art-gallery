'use client';

interface SuccessMessageProps {
  artwork: {
    title: string;
    artist: { username: string };
  };
  onClose: () => void;
}

export default function SuccessMessage({ artwork, onClose }: SuccessMessageProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✅</div>
        <h2>Purchase Successful!</h2>
        <p>You have successfully purchased</p>
        <div className="artwork-details">
          <strong>"{artwork.title}"</strong>
          <span>by {artwork.artist.username}</span>
        </div>
        <p className="message">The artwork has been added to your collection. You will receive a confirmation email shortly.</p>
        <button className="close-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .success-modal {
          background: white;
          border-radius: 12px;
          padding: 40px 30px;
          text-align: center;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .success-icon {
          font-size: 60px;
          margin-bottom: 20px;
        }

        h2 {
          color: #22c55e;
          margin: 0 0 16px 0;
          font-size: 24px;
        }

        p {
          color: #666;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .artwork-details {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .artwork-details strong {
          display: block;
          color: #a65b2b;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .artwork-details span {
          color: #666;
          font-size: 14px;
        }

        .message {
          font-size: 14px;
          color: #666;
          margin: 20px 0;
        }

        .close-btn {
          background: #a65b2b;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 10px;
        }

        .close-btn:hover {
          background: #8f4a20;
        }

        :root.dark .success-modal {
          background: #4a3319;
        }

        :root.dark h2 {
          color: #22c55e;
        }

        :root.dark p {
          color: #ccc;
        }

        :root.dark .artwork-details {
          background: #3d2914;
        }

        :root.dark .artwork-details strong {
          color: #a65b2b;
        }

        :root.dark .artwork-details span {
          color: #ccc;
        }

        :root.dark .message {
          color: #ccc;
        }
      `}</style>
    </div>
  );
}