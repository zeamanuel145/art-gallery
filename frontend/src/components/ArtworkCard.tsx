'use client';

import { useState } from 'react';
import { Artwork, api } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

interface ArtworkCardProps {
  artwork: Artwork;
  currentUser?: { _id?: string; id?: string };
  onUpdate: () => void;
}

export default function ArtworkCard({ artwork, currentUser, onUpdate }: ArtworkCardProps) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [price, setPrice] = useState('');
  const [showSellForm, setShowSellForm] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await api.likeArtwork(artwork._id);
      onUpdate();
    } catch (error) {
      console.error('Failed to like artwork:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comment.trim()) return;
    try {
      await api.addComment(artwork._id, comment);
      setComment('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    try {
      await api.putForSale(artwork._id, parseFloat(price));
      setShowSellForm(false);
      setPrice('');
      onUpdate();
    } catch (error) {
      console.error('Failed to put artwork for sale:', error);
    }
  };

  const handleBuy = async () => {
    if (!currentUser) return;
    try {
      await api.buyArtwork(artwork._id);
      onUpdate();
    } catch (error) {
      console.error('Failed to buy artwork:', error);
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      showToast('Please log in to add items to cart', 'warning');
      return;
    }
    if (!artwork.forSale || artwork.sold) {
      showToast('This artwork is not available for purchase', 'error');
      return;
    }
    addToCart(artwork);
    showToast(`${artwork.title} added to cart`, 'success');
  };

  const isOwner = currentUser && (currentUser._id === artwork.artist._id || currentUser.id === artwork.artist._id);
  const hasLiked = currentUser && artwork.likedBy?.includes(currentUser._id || currentUser.id || '');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={artwork.imageUrl} 
        alt={artwork.title}
        className="w-full h-64 object-cover"
      />
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{artwork.title}</h3>
        <p className="text-gray-600 mb-2">{artwork.description}</p>
        <p className="text-sm text-gray-500 mb-4">by {artwork.artist.username}</p>
        
        {artwork.forSale && !artwork.sold && (
          <div className="bg-green-100 p-2 rounded mb-4">
            <p className="text-green-800 font-semibold">For Sale: ${artwork.price}</p>
            {!isOwner && currentUser && (
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleBuy}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Buy Now
                </button>
                <button 
                  onClick={handleAddToCart}
                  className={`px-4 py-2 rounded text-white font-semibold ${
                    isInCart(artwork._id) 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {isInCart(artwork._id) ? '✓ In Cart' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        )}

        {artwork.sold && (
          <div className="bg-red-100 p-2 rounded mb-4">
            <p className="text-red-800 font-semibold">Sold</p>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleLike}
            disabled={!currentUser}
            className={`flex items-center gap-2 transition-colors disabled:opacity-50 ${
              hasLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            {hasLiked ? '❤️' : '🤍'} {artwork.likes}
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-blue-500 hover:text-blue-600"
          >
            💬 {artwork.comments.length}
          </button>

          {isOwner && !artwork.sold && !artwork.forSale && (
            <button 
              onClick={() => setShowSellForm(!showSellForm)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Sell
            </button>
          )}
        </div>

        {showSellForm && (
          <form onSubmit={handleSell} className="mb-4 p-3 bg-gray-50 rounded">
            <input
              type="number"
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                List for Sale
              </button>
              <button 
                type="button" 
                onClick={() => setShowSellForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {currentUser && (
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Comment
            </button>
          </form>
        )}
        
        {showComments && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Comments</h4>
            {artwork.comments.map((comment, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                <p className="text-sm font-semibold">{comment.user.username}</p>
                <p className="text-sm">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}