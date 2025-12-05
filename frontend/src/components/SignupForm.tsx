'use client';

import React, { useState } from "react";
import Link from "next/link";
import styles from "./SignupForm.module.css";

type FormState = {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirm: string;
};

export default function SignupForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" })); // clear field error on change
  }

  function validate() {
    const err: Record<string, string> = {};
    if (!form.fullName.trim()) err.fullName = "Full name is required.";
    if (!form.email.trim()) {
      err.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      err.email = "Enter a valid email address.";
    }
    if (!form.password) {
      err.password = "Password is required.";
    } else if (form.password.length < 8) {
      err.password = "Password must be at least 8 characters.";
    }
    if (!form.confirm) {
      err.confirm = "Please confirm your password.";
    } else if (form.password !== form.confirm) {
      err.confirm = "Passwords do not match.";
    }
    return err;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const { api } = await import('../lib/api');
      const username = form.username || form.fullName.toLowerCase().replace(/\s+/g, '');
      await api.register(form.email, form.password, username);
      setSuccess("Your account has been created successfully! You can now log in.");
      setForm({ fullName: "", email: "", username: "", password: "", confirm: "" });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      setErrors({ form: error?.message || "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  function passwordStrengthLabel(pass: string) {
    if (!pass) return "";
    if (pass.length >= 12 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return "Strong";
    if (pass.length >= 8) return "Good";
    return "Weak";
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} role="region" aria-labelledby="signup-heading">
        <div className={styles.header}>
          <h1 id="signup-heading" className={styles.title}>
            Create your account
          </h1>
          <p className={styles.subtitle}>Join our community of art lovers.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className={styles.formError} role="alert">
              {errors.form}
            </div>
          )}

          <label className={styles.label}>
            Full Name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
              placeholder="Enter your full name"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "err-fullName" : undefined}
            />
            {errors.fullName && (
              <div id="err-fullName" className={styles.error}>
                {errors.fullName}
              </div>
            )}
          </label>

          <label className={styles.label}>
            Email Address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="Enter your email address"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
            {errors.email && (
              <div id="err-email" className={styles.error}>
                {errors.email}
              </div>
            )}
          </label>

          <label className={styles.label}>
            Username <span className={styles.optional}>(optional)</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="Choose a username"
              aria-describedby="username-help"
            />
            <div id="username-help" className={styles.hint}>
              A unique short name shown on your profile.
            </div>
          </label>

          <label className={styles.label}>
            Password
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                placeholder="Create a password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "err-password" : undefined}
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
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className={styles.rowBetween}>
              <div className={styles.hint}>Use 8 or more characters with a mix of letters and numbers.</div>
              <div className={styles.strength}>{passwordStrengthLabel(form.password)}</div>
            </div>
            {errors.password && (
              <div id="err-password" className={styles.error}>
                {errors.password}
              </div>
            )}
          </label>

          <label className={styles.label}>
            Confirm Password
            <div style={{ position: 'relative' }}>
              <input
                name="confirm"
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={handleChange}
                className={`${styles.input} ${errors.confirm ? styles.inputError : ""}`}
                placeholder="Confirm your password"
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? "err-confirm" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
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
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? '👁️' : '👁️🗨️'}
              </button>
            </div>
            {errors.confirm && (
              <div id="err-confirm" className={styles.error}>
                {errors.confirm}
              </div>
            )}
          </label>

          <button type="submit" className={styles.submit} disabled={submitting} aria-busy={submitting}>
            {submitting ? "Creating..." : "Sign Up"}
          </button>

          <div className={styles.loginPrompt}>
            Already have an account?{" "}
            <Link href="/login" className={styles.loginLink}>
              Log in
            </Link>
          </div>

          {success && (
            <div className={styles.success} role="status" aria-live="polite">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}