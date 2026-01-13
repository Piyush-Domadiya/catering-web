"use client";

import { useState } from "react";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BackupPage() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch("/api/backup/export");
      if (res.ok) {
        const data = await res.json();

        // Create downloadable file
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `testful-backup-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setLastBackup(new Date().toLocaleString());
      }
    } catch (error) {
      console.error("Backup failed", error);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Data Backup & Restore
        </h1>
        <p className="text-text-secondary">
          Securely backup your application data or restore from a previous file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Backup Card */}
        <div className="bg-bg-primary p-10 rounded-[2.5rem] border border-border-color shadow-sm hover:shadow-xl transition-all">
          <div className="w-16 h-16 rounded-[1.5rem] bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 mb-8">
            <Download className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Manual Backup
          </h3>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Generate a full snapshot of your database (JSON format). Perfect for
            off-site storage and data portability.
          </p>

          {lastBackup && (
            <div className="p-4 bg-bg-secondary rounded-2xl mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold text-text-secondary">
                  Last Backup
                </span>
              </div>
              <span className="text-sm text-text-muted font-medium">
                {lastBackup}
              </span>
            </div>
          )}

          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Backup
              </>
            )}
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-bg-primary p-10 rounded-[2.5rem] border border-border-color shadow-sm hover:shadow-xl transition-all">
          <div className="w-16 h-16 rounded-[1.5rem] bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 mb-8">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Restore Data
          </h3>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Upload a previously exported backup file to restore your system
            state.
            <span className="text-red-500 font-bold">
              {" "}
              Warning: Not yet implemented.
            </span>
          </p>

          <div className="relative group cursor-not-allowed border-2 border-dashed border-border-color rounded-3xl p-10 text-center mb-4 opacity-50">
            <Upload className="h-10 w-10 text-text-muted mx-auto mb-4" />
            <p className="text-sm font-bold text-text-muted">
              Restore feature coming soon
            </p>
          </div>

          <button
            disabled
            className="w-full bg-bg-secondary text-text-muted py-4 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-not-allowed"
          >
            <Database className="h-5 w-5" />
            Restore System
          </button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-500/10 p-8 rounded-[2rem] border border-amber-100 dark:border-amber-500/20 flex gap-6 items-start">
        <div className="bg-amber-500 p-3 rounded-2xl text-white">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1">
            Backup Recommendation
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed opacity-80">
            We recommend performing a manual backup before any major system
            update or data modifications. Store backups securely in multiple
            locations.
          </p>
        </div>
      </div>
    </div>
  );
}
