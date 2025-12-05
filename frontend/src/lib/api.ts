const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-gallery-nbjk.onrender.com';

console.log('🔗 API Base URL:', API_BASE_URL);

export interface User {
  _id?: string;
  id?: string;
  email: string;
  username?: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  phone?: string;
  studio?: string;
}

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  artist: User;
  likes: number;
  likedBy?: string[];
  forSale: boolean;
  price?: number;
  owner?: User;
  sold: boolean;
  comments: Array<{
    user: User;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

class ApiClient {
  private async request<T>(path: string, options: RequestInit = {}, requireAuth = false): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    console.log('🚀 Making request to:', url);
    
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    if (requireAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }

    try {
      const response = await fetch(url, { ...options, headers });
      console.log('📊 Response status:', response.status);
      
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const body = isJson ? await response.json() : (await response.text());
      console.log('📝 Response body:', body);

      if (!response.ok) {
        const message = isJson && body?.message ? body.message : `Request failed with ${response.status}`;
        console.error('❌ Request failed:', message);
        throw new Error(message);
      }
      return body as T;
    } catch (error) {
      console.error('❌ Network error:', error);
      throw error;
    }
  }
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth endpoints
  async login(email: string, password: string) {
    console.log('🔑 Attempting login for:', email);
    const data = await this.request<{ token: string; user: User }>(
      `/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
    );
    console.log('✅ Login response:', data);
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async register(email: string, password: string, username: string) {
    console.log('📝 Attempting registration for:', email, username);
    const data = await this.request<{ message: string; user: User }>(
      `/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      },
    );
    console.log('✅ Registration response:', data);
    return data;
  }

  async getProfile(): Promise<User> {
    return this.request<User>(`/auth/profile`, { method: 'GET' }, true);
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>(
      `/users/profile`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      },
      true,
    );
  }

  // Artwork endpoints
  async getArtworks(): Promise<Artwork[]> {
    return this.request<Artwork[]>(`/artworks`, { method: 'GET' });
  }

  async createArtwork(title: string, description: string, imageUrl: string, price?: number): Promise<Artwork> {
    const payload: any = { title, description, imageUrl };
    if (price !== undefined && price > 0) {
      payload.price = Number(price);
    }
    console.log('📦 Creating artwork with payload:', payload);
    return this.request<Artwork>(
      `/artworks`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      true,
    );
  }

  async likeArtwork(id: string): Promise<Artwork> {
    return this.request<Artwork>(`/artworks/${id}/like`, { method: 'PUT' }, true);
  }

  async addComment(id: string, text: string): Promise<Artwork> {
    return this.request<Artwork>(
      `/artworks/${id}/comment`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      },
      true,
    );
  }

  async putForSale(id: string, price: number): Promise<Artwork> {
    return this.request<Artwork>(
      `/artworks/${id}/sell`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      },
      true,
    );
  }

  async buyArtwork(id: string): Promise<Artwork> {
    return this.request<Artwork>(`/artworks/${id}/buy`, { method: 'POST' }, true);
  }

  async getUserArtworks(): Promise<Artwork[]> {
    try {
      const allArtworks = await this.getArtworks();
      const user = await this.getProfile();
      const userId = user._id || user.id;
      return allArtworks.filter(artwork => {
        const artistId = artwork.artist?._id || artwork.artist?.id;
        return artistId === userId;
      });
    } catch (error) {
      console.error('Error fetching user artworks:', error);
      return [];
    }
  }

  async getUserPurchases(): Promise<any[]> {
    return this.request<any[]>(`/artworks/my-purchases`, { method: 'GET' }, true);
  }

  async getUserSales(): Promise<any[]> {
    return this.request<any[]>(`/artworks/my-sales`, { method: 'GET' }, true);
  }



  logout() {
    localStorage.removeItem('token');
  }
}

export const api = new ApiClient();