'use client';

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";

type FormState = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError(null);
  }

  function validate() {
    const err: Partial<FormState> = {};
    if (!form.email.trim()) err.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email address.";

    if (!form.password) err.password = "Password is required.";

    return err;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setSubmitting(true);
    try {
      const { api } = await import('../lib/api');
      const response = await api.login(form.email, form.password);
      
      if (response?.token) {
        // Redirect to dashboard on successful login
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      setServerError(error?.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} role="region" aria-labelledby="login-heading">
        <header className={styles.header}>
          <h1 id="login-heading" className={styles.title}>
            Welcome Back
          </h1>
          <p className={styles.subtitle}>Log in to continue your journey with BRANA Arts.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {serverError && <div className={styles.formError} role="alert">{serverError}</div>}

          <label className={styles.label}>
            <span className={styles.labelText}>Email Address</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
            {errors.email && <div id="err-email" className={styles.error}>{errors.email}</div>}
          </label>

          <div className={styles.labelRow}>
            <label className={`${styles.label} ${styles.labelGrow}`}>
              <span className={styles.labelText}>Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "err-pass" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b625d'
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '👁️' : '👁️🗨️'}
                </button>
              </div>
              {errors.password && <div id="err-pass" className={styles.error}>{errors.password}</div>}
            </label>

            <div className={styles.forgotWrap}>
              <Link href="/forgot" className={styles.forgot}>
                Forgot Password?
              </Link>
              <br />
              <Link href="/reset-password" className={styles.forgot}>
                Reset Password
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>

          <div className={styles.footerText}>
            Don't have an account?{" "}
            <Link href="/signup" className={styles.signup}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}