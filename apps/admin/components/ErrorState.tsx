"use client";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  variant?: "error" | "warning" | "info";
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  fullPage?: boolean;
}
export  function ErrorState({
  title = 'Server error',
  message = 'Data could not be fetched',
  errorCode,
  variant = "error",
  action,
  secondaryAction,
  fullPage = true,
}: ErrorStateProps) {
  const variantStyles = {
    error: {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
    warning: {
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    info: {
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
  };

  const styles = variantStyles[variant];
  console.log({ action });
  const content = (
    <div className="max-w-md w-full">
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
        <div
          className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <AlertCircle className={`w-8 h-8 ${styles.iconColor}`} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-6">{message}</p>

        {errorCode && (
          <p className="text-xs text-slate-600 mb-6 font-mono bg-slate-900/50 px-3 py-2 rounded border border-slate-700/50">
            Error code: {errorCode}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {action &&
            (action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center justify-center gap-2 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {action.label}
              </button>
            ))}

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}
