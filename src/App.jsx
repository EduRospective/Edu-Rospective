import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  Bell,
  LogOut,
  Download,
  Settings,
  Export,
} from "lucide-react";

/* =========================================================
   Edurospective — Teacher platform (MVP complet)
   - Dashboard
   - Șabloane: PDI, POA, Fișe autoevaluare, RAE (download .txt)
   - Chestionare: creare + rezultate demo + export CSV
   - Anunțuri: publicare + export CSV
   - Calendar/Orar: adăugare + export CSV
   - Setări: backup JSON (download)

   Persistență: localStorage (pregătit de înlocuire cu backend real)
   ========================================================= */

function Logo({ size = 40 }) {
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#2b2b2b" />
    <path d="M12 18L24 12L36 18V30L24 36L12 30V18Z" fill="white" />
    <path d="M12 18L24 24L36 18" stroke="#bfbfbf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

// --- demo data ---
const initialCursuri = [
  { id: 1, titlu: "Matematică - Algebra", clasa: "VII A", lectii: 24 },
  { id: 2, titlu: "Informatică - Bazele programării", clasa: "IX B", lectii: 18 },
];
const initialElevi = [
  { id: 1, nume: "Andrei Pop", clasa: "VII A", email: "andrei.pop@example.com" },
  { id: 2, nume: "Maria Ionescu", clasa: "IX B", email: "maria.ionescu@example.com" },
];
const initialAnunturi = [
  { id: 1, titlu: "Ședință Consiliu Profesori", text: "Miercuri, ora 16:00 — sala profesori.", data: new Date().toISOString() },
];

// --- storage helpers ---
function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function loadFromStorage(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

// --- layout ---
function Header({ user, onLogout }) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg grid place-items-center"><Logo/></div>
        <div>
          <div className="font-semibold">Edurospective</div>
          <div className="text-sm text-zinc-600">Instrumente pentru calitate — doar profesori</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm">{user.name}</div>
        <button className="px-3 py-1 border rounded text-sm" onClick={onLogout}>
          <LogOut className="inline mr-2 h-4 w-4"/>Deconectare
        </button>
      </div>
    </header>
  );
}

function Sidebar({ view, setView }) {
  const Btn = ({ v, icon, children }) => (
    <button
      className={`block w-full text-left p-2 rounded ${view === v ? "bg-indigo-50" : ""}`}
      onClick={() => setView(v)}
    >
      {icon}{children}
    </button>
  );
  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        <Btn v="dashboard">Dashboard</Btn>
        <Btn v="templates" icon={<FileText className="inline mr-2" />}>Șabloane PDI/POA</Btn>
        <Btn v="evaluari" icon={<BookOpen className="inline mr-2" />}>Evaluări & Fișe</Btn>
        <Btn v="anunturi" icon={<Bell className="inline mr-2" />}>Anunțuri</Btn>
        <Btn v="orar" icon={<Calendar className="inline mr-2" />}>Calendar</Btn>
        <Btn v="directori" icon={<Users className="inline mr-2" />}>Instrumente Director</Btn>
        <Btn v="setari" icon={<S

