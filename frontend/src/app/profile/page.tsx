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

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studio, setStudio] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [accountDetails, setAccountDetails] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const userData = await api.getProfile();
      setUser(userData);
      setFullName(userData.name || "");
      setUsername(userData.username || "");
      setBio(userData.bio || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setStudio(userData.studio || "");
      if (userData.profilePicture) {
        setAvatarPreview(userData.profilePicture);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      setErrors((s) => ({ ...s, avatar: "Please select an image file." }));
      return;
    }
    setAvatarFile(f);
    setErrors((s) => ({ ...s, avatar: "" }));
    
    // Create preview from the actual uploaded file
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(f);
  }

  function removeAvatar() {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!username.trim()) e.username = "Username is required.";
    if (!email.trim()) e.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email.";
    return e;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const eobj = validate();
    if (Object.keys(eobj).length) {
      setErrors(eobj);
      return;
    }
    setSaving(true);
    try {
      const profileData = {
        name: fullName,
        username,
        bio,
        email,
        phone,
        studio,
        profilePicture: avatarPreview || user?.profilePicture || undefined
      };
      
      const updatedUser = await api.updateProfile(profileData);
      setUser(updatedUser);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error('Save error:', err);
      setErrors({ form: "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Head>
        <title>Profile Settings — BRANA Arts</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <PageTransition>
        <div className="page">
          <DashboardSidebar activePage="profile" />
          <div className="contentArea">
        <header className="topnav" role="banner">
        <div className="brand">
        </div>

        <nav className="centerlinks" aria-label="Main navigation">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/collections" className="nav-link">Explore</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/my-artworks" className="nav-link">My Artworks</Link>
        </nav>

        <div className="right">
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button className="iconBtn" aria-label="Notifications">🔔</button>
            <div className="avatarWrap">
              {user?.profilePicture ? (
                <Image 
                  src={user.profilePicture} 
                  alt="User avatar" 
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
            <div className="avatarWrap">
              {user?.profilePicture ? (
                <Image 
                  src={user.profilePicture} 
                  alt="User avatar" 
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
        <form className="form" onSubmit={handleSave} noValidate>
          <div className="pageHeader">
            <h1>Profile Settings</h1>
            <p className="lead">Manage your public profile, contact information, and payment preferences.</p>
          </div>

          {errors.form && <div className="formError" role="alert">{errors.form}</div>}

          {/* Personal Information */}
          <section className="section">
            <div className="labelCol">
              <h3>Personal Information</h3>
              <p className="small">Update your photo and personal details here.</p>
            </div>

            <div className="fieldCol">
              <div className="row avatarRow">
                <div className="avatarPreview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Current avatar" style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <DefaultAvatar size={96} />
                  )}
                </div>

                <div className="avatarActions">
                  <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarChange} style={{ display: "none" }} id="avatarFile" />
                  <div className="avatarBtns">
                    <button type="button" className="linkBtn" onClick={() => fileRef.current?.click()}>Change Photo</button>
                    {avatarPreview && (
                      <button type="button" className="linkBtn danger" onClick={removeAvatar}>Remove</button>
                    )}
                  </div>
                  {errors.avatar && <div className="error">{errors.avatar}</div>}
                </div>
              </div>

              <label className="field">
                <span className="fieldLabel">Full Name</span>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={errors.fullName ? "input inputError" : "input"} />
                {errors.fullName && <div className="error">{errors.fullName}</div>}
              </label>

              <label className="field">
                <span className="fieldLabel">Username</span>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className={errors.username ? "input inputError" : "input"} />
                {errors.username && <div className="error">{errors.username}</div>}
              </label>

              <label className="field">
                <span className="fieldLabel">Artist Bio</span>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="textarea" rows={4} />
              </label>
            </div>
          </section>

          <hr className="divider" />

          {/* Contact Information */}
          <section className="section">
            <div className="labelCol">
              <h3>Contact Information</h3>
              <p className="small">Let us know how to reach you for inquiries and sales.</p>
            </div>

            <div className="fieldCol">
              <label className="field">
                <span className="fieldLabel">Email address</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "input inputError" : "input"} />
                {errors.email && <div className="error">{errors.email}</div>}
              </label>

              <label className="field">
                <span className="fieldLabel">Phone Number</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
              </label>

              <label className="field">
                <span className="fieldLabel">Studio Address</span>
                <input value={studio} onChange={(e) => setStudio(e.target.value)} className="input" />
              </label>
            </div>
          </section>

          <hr className="divider" />

          {/* Payment Preferences */}
          <section className="section">
            <div className="labelCol">
              <h3>Payment Preferences</h3>
              <p className="small">Configure your payment details for sales payouts.</p>
            </div>

            <div className="fieldCol">
              <label className="field inline">
                <span className="fieldLabel">Payment Method</span>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="select">
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Mobile Money</option>
                </select>
              </label>

              <label className="field">
                <span className="fieldLabel">Account Details</span>
                <input placeholder="e.g., Bank Account Number or PayPal email" value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} className="input" />
              </label>
            </div>
          </section>

          <div className="actionsRow">
            <button type="button" className="cancelBtn" onClick={() => { /* reset or navigate */ }}>Cancel</button>
            <button type="submit" className="saveBtn" disabled={saving} aria-busy={saving}>{saving ? "Saving…" : "Save Changes"}</button>
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
        
        .lead {
          color: #6b625d;
        }
        
        :root.dark .lead {
          color: white !important;
        }
        
        .labelCol h3 {
          color: #a65b2b;
        }
        
        :root.dark .labelCol h3 {
          color: white !important;
        }
        
        .small {
          color: #6b625d;
        }
        
        :root.dark .small {
          color: white !important;
        }
        
        .fieldLabel {
          color: #a65b2b !important;
        }
        
        :root.dark .fieldLabel {
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
        
        .saveBtn {
          background: #a65b2b;
          color: #fff !important;
        }
        
        :root.dark .saveBtn {
          background: #a65b2b !important;
          color: white !important;
        }
        
        :root{
          --page-bg: #fbfaf8;
          --muted: #6b625d;
          --accent: #a65b2b;
          --soft: rgba(0,0,0,0.06);
          --card-shadow: 0 8px 24px rgba(0,0,0,0.05);
        }
        
        :root.dark .main {
          background: #3d2914 !important;
        }
        
        :root.dark .contentArea {
          background: #3d2914 !important;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial; background: var(--page-bg); color: #a65b2b !important; }
        * { color: #a65b2b !important; }
        .page { display: flex; min-height: 100vh; }
        .contentArea { flex: 1; display: flex; flex-direction: column; }

        /* Topnav */
        .topnav {
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
        .right { display:flex; align-items:center; gap:12px; }
        .iconBtn{
          background:transparent;
          border:none;
          font-size:18px;
          cursor:pointer;
        }
        .avatarWrap { border-radius:999px; overflow:hidden; }
        .avatarWrap img { border-radius: 50%; object-fit: cover; }

        /* Main layout */
        .main {
          max-width: 920px;
          margin: 28px auto;
          padding: 0 20px 80px;
        }
        .pageHeader { margin-bottom: 22px; text-align:center; }
        h1 { font-family: "Playfair Display", serif; font-size: 36px; margin: 0; color: #a65b2b !important; }
        .lead { margin: 0; color: var(--muted); }

        /* form sections */
        .form { background: transparent; }
        .section { display: grid; grid-template-columns: 220px 1fr; gap: 22px; align-items: start; margin-bottom: 18px; }
        .labelCol { padding-top: 6px; }
        .labelCol h3 { margin: 0 0 6px; font-size: 16px; color: var(--accent); font-weight: 700; font-family: "Playfair Display", serif; }
        .small { margin: 0; color: var(--muted); font-size: 13px; }

        .fieldCol { display:flex; flex-direction: column; gap: 12px; }

        .field { display:flex; flex-direction: column; gap: 8px; }
        .fieldLabel { font-weight: 700; color: #a65b2b !important; font-size: 14px; }
        .input, .select, .textarea { background: #fff; border: 1px solid var(--soft); padding: 10px 12px; border-radius: 6px; font-size: 14px; outline: none; }
        .textarea { min-height: 100px; resize:vertical; }
        .input:focus, .select:focus, .textarea:focus { box-shadow: 0 8px 20px rgba(166,91,43,0.06); border-color: rgba(166,91,43,0.08); }

        .divider { border: none; border-top: 1px solid rgba(0,0,0,0.04); margin: 18px 0; }

        /* avatar row */
        .avatarRow { display:flex; gap: 18px; align-items:center; }
        .avatarPreview { width: 96px; height: 96px; border-radius: 999px; overflow:hidden; background: #efece9; display:flex; align-items:center; justify-content:center; }
        .avatarPreview img { width:100%; height:100%; object-fit:cover; display:block; }
        .avatarActions { display:flex; flex-direction: column; gap: 10px; }
        .avatarBtns { display:flex; gap:12px; }
        .linkBtn { background: transparent; border: none; color: var(--accent); font-weight:700; cursor:pointer; padding:6px 8px; border-radius:6px; }
        .linkBtn.danger { color:#b7463b; }
        .linkBtn:hover { text-decoration: underline; }

        /* errors */
        .error { color: #b7463b; font-size: 13px; }
        .inputError { border-color: rgba(183,67,55,0.12) !important; }
        .formError{ background: #feeae6; border-radius: 8px; padding: 10px; color: #8a2f25; margin-bottom: 12px; }

        /* actions */
        .actionsRow { display:flex; justify-content:flex-end; gap:12px; margin-top: 16px; }
        .cancelBtn { background: transparent; border:none; color: var(--muted); font-weight:700; padding:8px 12px; cursor:pointer; }
        .saveBtn { background: var(--accent); color: #fff !important; border:none; padding:10px 16px; border-radius:8px; font-weight:700; cursor:pointer; box-shadow: 0 6px 18px rgba(166,91,43,0.14); }
        .saveBtn[disabled] { opacity: 0.7; cursor:not-allowed; }

        /* responsive */
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
        
        @media (max-width: 860px) {
          .section { grid-template-columns: 1fr; }
          .labelCol { order: 1; }
          .fieldCol { order: 2; }
          .pageHeader { text-align:left; }
          .actionsRow { justify-content: space-between; }
        }
      `}</style>
    </>
  );
}