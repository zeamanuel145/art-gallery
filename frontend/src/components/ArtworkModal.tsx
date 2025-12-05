'use client';

import { useState } from 'react';
import { Artwork, User, api } from '../lib/api';

interface ArtworkModalProps {
  artwork: Artwork;
  user: User | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ArtworkModal({ artwork, user, onClose, onUpdate }: ArtworkModalProps) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [price, setPrice] = useState('');
  const [showSellForm, setShowSellForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwner = user?._id === artwork.artist._id || user?.id === artwork.artist._id;
  const hasLiked = user && artwork.likedBy?.includes(user._id || user.id || '');

  const handleLike = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.likeArtwork(artwork._id);
      onUpdate();
    } catch (error) {
      console.error('Failed to like artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setLoading(true);
    try {
      await api.addComment(artwork._id, comment);
      setComment('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    setLoading(true);
    try {
      await api.putForSale(artwork._id, parseFloat(price));
      setShowSellForm(false);
      setPrice('');
      onUpdate();
    } catch (error) {
      console.error('Failed to put artwork for sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.buyArtwork(artwork._id);
      onUpdate();
    } catch (error) {
      console.error('Failed to buy artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{backgroundColor: 'var(--modal-bg)'}}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{backgroundColor: 'var(--modal-bg)', borderBottomColor: 'var(--modal-border)'}}>
          <h2 className="text-2xl font-bold text-amber-900" style={{color: 'var(--modal-text)'}}>{artwork.title}</h2>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 text-2xl font-bold"
            style={{color: 'var(--modal-text)'}}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {artwork.forSale && !artwork.sold && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full font-semibold">
                  ${artwork.price}
                </div>
              )}
              {artwork.sold && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full font-semibold">
                  SOLD
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2" style={{color: 'var(--modal-text)'}}>Artwork Details</h3>
                <p className="text-amber-700 leading-relaxed" style={{color: 'var(--modal-text)'}}>{artwork.description}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-amber-900 mb-2" style={{color: 'var(--modal-text)'}}>Artist</h4>
                <p className="text-amber-600 font-medium" style={{color: 'var(--modal-text)'}}>{artwork.artist.username}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-amber-900 mb-2" style={{color: 'var(--modal-text)'}}>Created</h4>
                <p className="text-amber-700" style={{color: 'var(--modal-text)'}}>{new Date(artwork.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Pricing Info */}
              {artwork.forSale && !artwork.sold && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Available for Purchase</h4>
                  <p className="text-2xl font-bold text-green-600 mb-3">${artwork.price}</p>
                  {!isOwner && user && (
                    <button
                      onClick={handleBuy}
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                    >
                      {loading ? 'Processing...' : 'Buy Now'}
                    </button>
                  )}
                </div>
              )}

              {artwork.sold && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200" style={{backgroundColor: 'var(--modal-card-bg)', borderColor: 'var(--modal-border)'}}>
                  <h4 className="text-lg font-semibold text-red-800" style={{color: 'var(--modal-text)'}}>Sold</h4>
                  <p className="text-red-600" style={{color: 'var(--modal-text)'}}>This artwork has been sold.</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={handleLike}
                  disabled={!user || loading}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    hasLiked 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  } disabled:opacity-50`}
                >
                  {hasLiked ? '❤️' : '🤍'} {artwork.likes} {artwork.likes === 1 ? 'Like' : 'Likes'}
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
                >
                  💬 {artwork.comments.length} {artwork.comments.length === 1 ? 'Comment' : 'Comments'}
                </button>

                {isOwner && !artwork.sold && !artwork.forSale && (
                  <button
                    onClick={() => setShowSellForm(!showSellForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    List for Sale
                  </button>
                )}
              </div>

              {/* Sell Form */}
              {showSellForm && (
                <form onSubmit={handleSell} className="bg-gray-50 p-4 rounded-lg border" style={{backgroundColor: 'var(--modal-card-bg)', borderColor: 'var(--modal-border)'}}>
                  <h4 className="font-semibold mb-3 text-amber-900" style={{color: 'var(--modal-text)'}}>Set Price</h4>
                  <input
                    type="number"
                    placeholder="Enter price ($)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 border text-amber-900 rounded-lg mb-3"
                    style={{borderColor: 'var(--modal-border)', backgroundColor: 'var(--modal-input-bg)', color: 'var(--modal-text)'}}
                    required
                    min="1"
                    step="0.01"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {loading ? 'Listing...' : 'List for Sale'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSellForm(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Comment Form */}
              {user && (
                <form onSubmit={handleComment} className="space-y-3">
                  <textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border text-amber-900 rounded-lg resize-none"
                    style={{borderColor: 'var(--modal-border)', backgroundColor: 'var(--modal-input-bg)', color: 'var(--modal-text)'}}
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={loading || !comment.trim()}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}

              {/* Comments */}
              {showComments && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-amber-900" style={{color: 'var(--modal-text)'}}>Comments</h4>
                  {artwork.comments.length === 0 ? (
                    <p className="text-amber-700 italic" style={{color: 'var(--modal-text)'}}>No comments yet. Be the first to comment!</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {artwork.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg" style={{backgroundColor: 'var(--modal-card-bg)'}}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-amber-900" style={{color: 'var(--modal-text)'}}>{comment.user.username}</span>
                            <span className="text-xs text-amber-700" style={{color: 'var(--modal-text)'}}>
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-amber-700" style={{color: 'var(--modal-text)'}}>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        :root {
          --modal-bg: white;
          --modal-text: #a65b2b;
          --modal-border: #e5e7eb;
          --modal-card-bg: #f9fafb;
          --modal-input-bg: white;
        }
        
        :root.dark {
          --modal-bg: #3d2914 !important;
          --modal-text: white !important;
          --modal-border: rgba(255,255,255,0.1) !important;
          --modal-card-bg: #4a3319 !important;
          --modal-input-bg: #4a3319 !important;
        }
      `}</style>
    </div>
  );
}