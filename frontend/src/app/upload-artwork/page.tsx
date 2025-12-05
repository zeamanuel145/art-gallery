'use client';

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import ThemeToggle from "../../components/ThemeToggle";
import MobileNav from "../../components/MobileNav";
import DefaultAvatar from "../../components/DefaultAvatar";
import PageTransition from "../../components/PageTransition";
import { api, User } from "../../lib/api";

const CATEGORIES = [
  "Painting",
  "Textile",
  "Pottery",
  "Basketry",
  "Sculpture",
  "Religious Icons",
];

export default function UploadArtworkPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("150.00");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Artwork title is required.";
    if (!description.trim()) e.description = "Please add a description.";
    if (!category) e.category = "Please select a category.";
    if (!price || price.trim() === '' || Number.isNaN(Number(price.trim())) || Number(price.trim()) <= 0) e.price = "Enter a valid price greater than 0.";
    if (!file) e.file = "Please upload an artwork image (JPG, PNG, GIF up to 10MB).";
    return e;
  }

  function onFileChosen(f?: File) {
    if (!f) return;
    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/gif"];
    if (!allowed.includes(f.type)) {
      setErrors((s) => ({ ...s, file: "Unsupported file type. Use JPG, PNG or GIF." }));
      return;
    }
    // Validate size (10MB)
    if (f.size > 10 * 1024 * 1024) {
      setErrors((s) => ({ ...s, file: "File is too large. Max 10MB allowed." }));
      return;
    }

    setFile(f);
    setErrors((s) => ({ ...s, file: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFileChosen(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChosen(f);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const eobj = validate();
    if (Object.keys(eobj).length) {
      setErrors(eobj);
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = '';
      
      if (file) {
        // Convert the uploaded file to base64 data URL for storage
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        // Fallback to a random demo image if no file uploaded
        imageUrl = `/assets/paint${Math.floor(Math.random() * 4) + 1}.jpg`;
      }
      
      const { api } = await import('../../lib/api');
      const priceValue = price && price.trim() ? parseFloat(price.trim()) : 0;
      console.log('💰 Price value being sent:', priceValue);
      await api.createArtwork(title, description, imageUrl, priceValue);

      // Trigger refresh of my-artworks page
      window.dispatchEvent(new Event('artworkUploaded'));
      
      // Reset form and show success
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("150.00");
      setFile(null);
      setPreview(null);
      setErrors({});
      
      alert("Artwork uploaded successfully!");
      // Redirect to my-artworks page
      window.location.href = '/my-artworks';
    } catch (err) {
      console.error(err);
      setErrors({ form: "Upload failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Upload Artwork — BRANA Arts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageTransition>
        <div className="page">
          <DashboardSidebar activePage="upload-artwork" />
          <div className="contentArea">
        <header className="topnav" role="banner">
          <div className="brand">
          </div>

          <nav className="centerlinks" aria-label="Main">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/collections" className="nav-link">Explore</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/my-artworks" className="nav-link">My Artworks</Link>
          </nav>

          <div className="right">
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <button className="iconBtn" aria-label="Notifications">🔔</button>
              <div className="avatar">
                {user?.profilePicture ? (
                  <Image 
                    src={user.profilePicture} 
                    alt="User" 
                    width={36} 
                    height={36} 
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <DefaultAvatar size={36} />
                )}
              </div>
              {user && <button onClick={() => { api.logout(); window.location.href = '/'; }} className="logout-btn">Logout</button>}
            </div>
            <div className="flex md:hidden items-center gap-2">
              <div className="avatar">
                {user?.profilePicture ? (
                  <Image 
                    src={user.profilePicture} 
                    alt="User" 
                    width={32} 
                    height={32} 
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <DefaultAvatar size={32} />
                )}
              </div>
              <MobileNav isDashboard={true} />
            </div>
          </div>
        </header>

        <main className="main">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="formHeader">
              <h1>Upload Artwork</h1>
              <p className="subtitle">Fill in the details below to add your artwork to the gallery.</p>
            </div>

            {errors.form && <div role="alert" className="formError">{errors.form}</div>}

            <label className="field">
              <span className="labelText">Artwork Title</span>
              <input
                className={`input ${errors.title ? "inputError" : ""}`}
                placeholder="e.g., 'Sunset Over the Rift Valley'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "err-title" : undefined}
              />
              {errors.title && <div id="err-title" className="error">{errors.title}</div>}
            </label>

            <label className="field">
              <span className="labelText">Description</span>
              <textarea
                className={`textarea ${errors.description ? "inputError" : ""}`}
                placeholder="Describe your artwork, its story, and the techniques used."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "err-desc" : undefined}
              />
              {errors.description && <div id="err-desc" className="error">{errors.description}</div>}
            </label>

            <div className="row">
              <label className="field small">
                <span className="labelText">Category</span>
                <select
                  className={`select ${errors.category ? "inputError" : ""}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "err-cat" : undefined}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <div id="err-cat" className="error">{errors.category}</div>}
              </label>

              <label className="field small">
                <span className="labelText">Price (USD)</span>
                <input
                  className={`input ${errors.price ? "inputError" : ""}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="decimal"
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "err-price" : undefined}
                />
                {errors.price && <div id="err-price" className="error">{errors.price}</div>}
              </label>
            </div>

            <div
              className={`dropzone ${dragActive ? "dragging" : ""} ${errors.file ? "inputError" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
              }}
              aria-label="Upload artwork image"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {preview ? (
                <div className="previewWrap">
                  <img src={preview} alt="Artwork preview" className="preview" />
                  <div className="previewActions">
                    <button
                      type="button"
                      className="remove"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setFile(null);
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove
                    </button>
                    <div className="hint">Click to replace</div>
                  </div>
                </div>
              ) : (
                <div className="dropInner">
                  <div className="icon">🖼️</div>
                  <div className="dragText"><strong>Drag and drop or browse</strong></div>
                  <div className="hint">JPG, PNG, GIF up to 10MB</div>
                </div>
              )}
            </div>
            {errors.file && <div className="error" role="alert">{errors.file}</div>}

            <div style={{ height: 12 }} />

            <div className="actions">
              <button className="submit" type="submit" disabled={submitting} aria-busy={submitting}>
                {submitting ? "Uploading…" : "+ Upload Artwork"}
              </button>
            </div>
          </form>
        </main>
          </div>
        </div>
      </PageTransition>

      <style jsx global>{`
        body {
          background: #fbfaf8;
          color: #a65b2b;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        :root.dark body {
          background: #3d2914 !important;
          color: white !important;
        }
        
        .topnav {
          background: #fbfaf8;
          border-bottom: 1px solid rgba(166, 91, 43, 0.1);
        }
        
        :root.dark .topnav {
          background: #3d2914 !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .nav-link {
          color: #a65b2b !important;
          text-decoration: none;
          font-weight: 600;
        }
        
        :root.dark .nav-link {
          color: white !important;
        }
        
        .nav-link:hover {
          text-decoration: underline;
        }
        
        .iconBtn {
          color: #a65b2b;
        }
        
        :root.dark .iconBtn {
          color: white !important;
        }
        
        h1 {
          color: #a65b2b !important;
        }
        
        :root.dark h1 {
          color: white !important;
        }
        
        .subtitle {
          color: #6b625d;
        }
        
        :root.dark .subtitle {
          color: white !important;
        }
        
        .labelText {
          color: #a65b2b !important;
        }
        
        :root.dark .labelText {
          color: white !important;
        }
        
        .input, .select, .textarea {
          background: #fff;
          border: 1px solid rgba(166, 91, 43, 0.1);
          color: #a65b2b;
        }
        
        :root.dark .input, :root.dark .select, :root.dark .textarea {
          background: #4a3319 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .dropzone {
          background: #fff;
          border: 2px dashed rgba(166, 91, 43, 0.1);
        }
        
        :root.dark .dropzone {
          background: #4a3319 !important;
          border: 2px dashed rgba(255,255,255,0.1) !important;
        }
        
        .dropzone.dragging {
          border-color: rgba(166,91,43,0.28);
        }
        
        :root.dark .dropzone.dragging {
          border-color: rgba(255,255,255,0.28) !important;
        }
        
        .dragText {
          color: #6b625d;
        }
        
        :root.dark .dragText {
          color: white !important;
        }
        
        .hint {
          color: #6b625d;
        }
        
        :root.dark .hint {
          color: white !important;
        }
        
        .remove {
          background: transparent;
          border: 1px solid rgba(166, 91, 43, 0.1);
          color: #a65b2b;
        }
        
        :root.dark .remove {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .submit {
          background: #a65b2b;
          color: #fff !important;
        }
        
        :root.dark .submit {
          background: #a65b2b !important;
          color: white !important;
        }
        
        .error {
          color: #b7463b;
        }
        
        :root.dark .error {
          color: #f4a4a4 !important;
        }
        
        .formError {
          background: #feeae6;
          color: #8a2f25;
        }
        
        :root.dark .formError {
          background: #4a3319 !important;
          color: #f4a4a4 !important;
        }
        
        :root{
          --page-bg: #fbfaf8;
          --muted: #6b625d;
          --accent: #a65b2b;
          --input-bg: #fff;
          --soft: rgba(0,0,0,0.04);
          --card-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        
        :root.dark .main {
          background: #3d2914 !important;
        }
        
        :root.dark .contentArea {
          background: #3d2914 !important;
        }
        *{box-sizing:border-box}
        body { margin: 0; font-family: "Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial; background: var(--page-bg); color: #a65b2b !important; }
        * { color: #a65b2b !important; }
        .page { display: flex; min-height: 100vh; }
        .contentArea { flex: 1; display: flex; flex-direction: column; }
        
        .topnav{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 14px 28px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .brand{ display:flex; align-items:center; gap:12px; }
        .logo{ border-radius: 50%; object-fit: cover; }
        .centerlinks { display:flex; gap:20px; }
        .centerlinks a { color:#a65b2b !important; text-decoration:none; font-weight:600; }
        .centerlinks a:hover { text-decoration:underline; }
        .right{ display:flex; align-items:center; gap:12px; }
        .iconBtn{
          background:transparent;
          border:none;
          font-size:18px;
          cursor:pointer;
        }
        .avatar{ border-radius:999px; overflow:hidden; }
        .avatar img { border-radius: 50%; object-fit: cover; }

        .main{
          max-width: 920px;
          margin: 28px auto;
          padding: 0 20px 80px;
        }

        .form{
          background: transparent;
        }
        .formHeader{ margin-bottom: 22px; }
        h1 { font-family: "Playfair Display", serif; font-size: 36px; margin: 0; color: #a65b2b !important; }
        .subtitle{ margin: 0; color: var(--muted); }

        .field{ display:flex; flex-direction:column; gap:8px; margin-bottom: 14px; }
        .labelText{ font-weight:700; color: #a65b2b !important; font-size: 14px; }
        .input, .select, .textarea{
          background: var(--input-bg);
          border: 1px solid var(--soft);
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }
        .textarea{ min-height: 120px; resize:vertical; }

        .row{ display:flex; gap: 18px; }
        .small{ flex: 1 1 0; }

        .dropzone{
          margin-top: 6px;
          border-radius: 10px;
          border: 2px dashed rgba(0,0,0,0.06);
          background: #fff;
          padding: 32px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition: box-shadow 180ms ease, border-color 120ms ease, transform 120ms ease;
        }
        .dropzone.dragging{
          border-color: rgba(166,91,43,0.28);
          box-shadow: 0 8px 24px rgba(166,91,43,0.06);
          transform: translateY(-2px);
        }
        .dropInner{ text-align:center; color: var(--muted); }
        .dropInner .icon{ font-size: 28px; margin-bottom: 6px; }
        .dragText{ margin-bottom: 6px; color: var(--muted); }
        .hint{ font-size: 12px; color: var(--muted); }

        .previewWrap{ position:relative; width:100%; display:flex; align-items:center; gap:16px; }
        .preview{ width: 160px; height: 120px; object-fit: cover; border-radius: 8px; box-shadow: var(--card-shadow); }
        .previewActions{ display:flex; flex-direction:column; gap:8px; align-items:flex-start; color:var(--muted); }
        .remove{ background:transparent; border:1px solid var(--soft); padding:6px 10px; border-radius:8px; cursor:pointer; }
        .remove:hover{ background: #fff6f2; border-color: rgba(166,91,43,0.08); }

        .actions{ display:flex; justify-content:flex-end; margin-top: 8px; }
        .submit{
          background: var(--accent);
          color: #fff !important;
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          font-weight:700;
          cursor:pointer;
          box-shadow: 0 6px 18px rgba(166,91,43,0.14);
        }
        .submit[disabled]{ opacity: 0.7; cursor:not-allowed; }

        .error{ color: #b7463b; font-size: 13px; margin-top: 6px; }
        .formError{ background: #feeae6; border-radius: 8px; padding: 10px; color: #8a2f25; margin-bottom: 12px; }
        .inputError{ border-color: rgba(183,67,55,0.12) !important; }

        /* responsiveness */
        .logout-btn {
          background: transparent;
          border: 1px solid #a65b2b;
          color: #a65b2b;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .logout-btn:hover {
          background: #a65b2b;
          color: white;
        }
        
        :root.dark .logout-btn {
          border-color: #a65b2b;
          color: white;
        }
        
        :root.dark .logout-btn:hover {
          background: #a65b2b;
          color: white;
        }
        
        @media (max-width: 768px) {
          .centerlinks { display: none; }
        }
        
        @media (max-width: 740px){
          .row{ flex-direction: column; }
          .preview{ display:none; }
          .main{ padding: 0 14px 60px; }
        }
      `}</style>
    </>
  );
}