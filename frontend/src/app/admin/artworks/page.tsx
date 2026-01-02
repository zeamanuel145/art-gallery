'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, User } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import { useToast } from '../../../contexts/ToastContext';

export default function AdminArtworksPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userData = await api.getProfile();
        setUser(userData);

        if (userData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        const artworksData = await api.getAllAdminArtworks();
        setArtworks(artworksData);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDelete = async (artworkId: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) {
      return;
    }

    try {
      await api.deleteAdminArtwork(artworkId);
      showToast('Artwork deleted successfully', 'success');
      const artworksData = await api.getAllAdminArtworks();
      setArtworks(artworksData);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete artwork', 'error');
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activePage="admin-artworks" />
      <div style={{ flex: 1, background: '#fbfaf8' }}>
        <Navbar />
        <div style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>Artwork Management</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {artworks.map((artwork) => (
              <div key={artwork._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'relative', width: '100%', height: '200px', background: '#f3f4f6' }}>
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>{artwork.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    by {artwork.artist?.username || artwork.artist?.name || 'Unknown'}
                  </p>
                  {artwork.forSale && artwork.price && (
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#a65b2b', marginBottom: '12px' }}>
                      ${artwork.price.toFixed(2)}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: artwork.sold ? '#fee2e2' : artwork.forSale ? '#d1fae5' : '#f3f4f6',
                      color: artwork.sold ? '#991b1b' : artwork.forSale ? '#065f46' : '#374151',
                    }}>
                      {artwork.sold ? 'Sold' : artwork.forSale ? 'For Sale' : 'Not for Sale'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(artwork._id)}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      padding: '8px',
                      background: 'white',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Delete Artwork
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

