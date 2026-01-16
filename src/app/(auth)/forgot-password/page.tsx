"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { forgotPasswordAction } from "./actions";

interface ForgotPasswordState {
  error?: string;
  success?: boolean;
  isOAuthUser?: boolean;
}

export default function ForgotPasswordForm() {
  const notification = useNotification();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");

  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    {} as ForgotPasswordState
  );

  // Handle result
  useEffect(() => {
    if (state.success) {
      notification.success(
        "Password reset instructions have been sent to your email."
      );
    } else if (state.error) {
      notification.error(state.error);
      // Restore form values after error
      if (formRef.current) {
        const emailInput = formRef.current.elements.namedItem(
          "email"
        ) as HTMLInputElement;
        if (emailInput) emailInput.value = email;
      }
    }
  }, [state.success, state.error, notification, email]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "0 16px",
    backgroundColor: "#f5f5f5",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    padding: "24px",
    borderBottom: "1px solid #e0e0e0",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: "0 0 8px 0",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  };

  const contentStyle: React.CSSProperties = {
    padding: "24px",
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "24px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    color: "#666",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 10px 10px 40px",
    fontSize: "14px",
    border: "1px solid #d0d0d0",
    borderRadius: "4px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#fff",
    color: "#333",
  };

  const inputDisabledStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: "#f5f5f5",
    cursor: "not-allowed",
    opacity: 0.6,
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#1976d2",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const buttonDisabledStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#bdbdbd",
    cursor: "not-allowed",
  };

  const textCenterStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "16px",
  };

  const linkStyle: React.CSSProperties = {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: "500",
  };

  const textStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#555",
    marginBottom: "16px",
  };

  if (state.success) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Check Your Email</h1>
            <p style={subtitleStyle}>Password reset instructions sent</p>
          </div>
          <div style={contentStyle}>
            <p style={textStyle}>
              If you registered using your email and password, you will receive
              a password reset email at <strong>{email}</strong>.
            </p>
            <p style={textStyle}>Please check your inbox and spam folder.</p>
            <a
              href="/login"
              style={{
                ...linkStyle,
                display: "block",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Reset Your Password</h1>
          <p style={subtitleStyle}>
            Type in your email and we&#39;ll send you a link to reset your
            password
          </p>
        </div>
        <div style={contentStyle}>
          <form ref={formRef} action={formAction}>
            <div style={formGroupStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <div style={inputWrapperStyle}>
                <span style={iconStyle}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isPending}
                  style={isPending ? inputDisabledStyle : inputStyle}
                  placeholder="you@example.com"
                  onFocus={(e) => {
                    if (!isPending) {
                      e.target.style.borderColor = "#1976d2";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d0d0d0";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={isPending ? buttonDisabledStyle : buttonStyle}
              onMouseEnter={(e) => {
                if (!isPending) {
                  e.currentTarget.style.backgroundColor = "#1565c0";
                }
              }}
              onMouseLeave={(e) => {
                if (!isPending) {
                  e.currentTarget.style.backgroundColor = "#1976d2";
                }
              }}
            >
              {isPending ? "Sending..." : "Send reset email"}
            </button>

            <p style={textCenterStyle}>
              Remember your password?{" "}
              <a
                href="/login"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
