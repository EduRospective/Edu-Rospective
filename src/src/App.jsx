import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText, Users, Bell, LogOut, Download, Settings, Export } from "lucide-react";

// --- Brand & demo data ---
function Logo({ size = 40 }) {
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#2b2b2b" />
    <path d="M12 18L24 12L36 18V30L24 36L12 30V18Z" fill="white" />
    <path d="M12 18L24 24L36 18" stroke="#bfbfbf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

const initialCursuri = [{ id: 1, titlu: "Matematică - Algebra", clasa: "VII A", lectii: 24 }];
const initialElevi = [{ id: 1, nume: "Andrei Pop", clasa: "VII A", email: "andrei.pop@example.com" }];
const initialAnunturi = [{ id: 1, titlu: "Ședință Consiliu Profesori", text: "Ședință miercuri, ora 16:00.", data: new Date().toISOString() }];

// --- localStorage helpers ---
function saveToStorage(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function loadFromStorage(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }

// --- UI ---
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
        <button className="px-3 py-1 border rounded text-sm" onClick={onLogout}><LogOut className="inline mr-2 h-4 w-4"/>Deconectare</button>
      </div>
    </header>
  );
}

function Sidebar({ view, setView }) {
  const Btn = ({ v, icon, children }) => (
    <button className={`block w-full text-left p-2 rounded ${view===v?'bg-indigo-50':''}`} onClick={()=>setView(v)}>
      {icon}{children}
    </button>
  );
  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        <Btn v="dashboard" icon={null}>Dashboard</Btn>
        <Btn v="templates" icon={<FileText className="inline mr-2"/>}>Șabloane PDI/POA</Btn>
        <Btn v="evaluari" icon={<BookOpen className="inline mr-2"/>}>Evaluări & Fișe</Btn>
        <Btn v="directori" icon={<Users className="inline mr-2"/>}>Instrumente Director</Btn>
        <Btn v="anunturi" icon={<Bell className="inline mr-2"/>}>Anunțuri</Btn>
        <Btn v="orar" icon={<Calendar className="inline mr-2"/>}>Calendar</Btn>
        <Btn v="setari" icon={<Settings className="inline mr-2"/>}>Setări</Btn>
      </nav>
    </aside>
  );
}

function Dashboard({ cursuri, elevi, anunturi }) {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded">Cursuri<br/><strong>{cursuri.length}</strong></div>
        <div className="p-4 border rounded">Elevi<br/><strong>{elevi.length}</strong></div>
        <div className="p-4 border rounded">Anunțuri<br/><strong>{anunturi.length}</strong></div>
      </motion.div>
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Instrumente rapide</h3>
        <ul className="list-disc pl-5 text-sm">
          <li>Generator PDI (șabloane descărcabile)</li>
          <li>Checklist audit intern</li>
          <li>Chestionare evaluare (elevi/părinți/profesori)</li>
        </ul>
      </div>
    </div>
  );
}

function TemplatesManager() {
  const templates = [
    {
      id: "pdi",
      titlu: "Model PDI (Plan dezvoltare instituțională)",
      text: `Titlu PDI\nObiective...\nIndicatori...\nActivități...`
    },
    {
      id: "poa",
      titlu: "Model POA (Plan operațional anual)",
      text: `Titlu POA\nActivități anuale...\nResponsabili...`
    },
    {
      id: "fise_autoevaluare",
      titlu: "Fișe autoevaluare (profesori/directori)",
      text: `Întrebări autoevaluare...`
    },
    {
      id: "rae",
      titlu: "Structură Raport Autoevaluare Anual",
      text: `Sumar executiv...\nAnaliză calitate...`
    },
  ];
  function downloadText(t) {
    const blob = new Blob([t.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${t.id}.txt`; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Șabloane utile</h3>
        <p className="text-sm text-zinc-600">Descărcați modele PDI / POA, fișe și RAE.</p>
      </div>
      <div className="p-4 border rounded space-y-2">
        {templates.map(t=>(
          <div key={t.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium">{t.titlu}</div>
              <div className="text-sm text-zinc-600">Descărcați sau copiați conținutul modelului.</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded text-sm" onClick={()=>downloadText(t)}><Download className="inline mr-2"/>Descarcă</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvaluariManager({ elevi }) {
  const [intrebare, setIntrebare] = useState("");
  const [formulare, setFormulare] = useState(loadFromStorage("formulare", []));
  const [raspunsuri, setRaspunsuri] = useState(loadFromStorage("raspunsuri", {}));

  function creeazaForm() {
    if(!intrebare.trim()) return;
    const f = { id: Date.now(), titlu: intrebare, created: new Date().toISOString() };
    const nou = [f, ...formulare]; setFormulare(nou); saveToStorage("formulare", nou); setIntrebare("");
  }

  function submitDummyResponse(formId) {
    const responses = elevi.map(e => ({ elevId: e.id, raspuns: "OK" }));
    const all = { ...raspunsuri, [formId]: (raspunsuri[formId] || []).concat(responses) };
    setRaspunsuri(all); saveToStorage("raspunsuri", all);
    alert("Răspunsuri demo adăugate (pentru vizualizare).");
  }

  function exportFormResults(formId) {
    const rows = ["formId,studentId,studentName,answer"];
    const rowsArr = (raspunsuri[formId]||[]).map(r=>[formId,r.elevId,`"${(elevi.find(e=>e.id===r.elevId)||{}).nume||""}"`,`"${r.raspuns}"`].join(","));
    const blob = new Blob([rows.concat(rowsArr).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `form_${formId}_results.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Creează chestionar evaluativ</h3>
        <input placeholder="Titlu chestionar (ex: Feedback elevi - semestrul 1)" value={intrebare} onChange={e=>setIntrebare(e.target.value)} />
        <div className="mt-2">
          <button className="px-3 py-1 border rounded text-sm" onClick={creeazaForm}>Creează</button>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Chestionare</h3>
        {formulare.map(f=>(
          <div key={f.id} className="p-2 border rounded mb-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{f.titlu}</div>
              <div className="text-xs text-zinc-500">Creat: {new Date(f.created).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded text-sm" onClick={()=>submitDummyResponse(f.id)}>Adaugă răspunsuri demo</button>
              <button className="px-3 py-1 border rounded text-sm" onClick={()=>exportFormResults(f.id)}><Export className="inline mr-2"/>Export rezultate</button>
            </div>
          </div>
        ))}
        {formulare.length===0 && <div className="text-sm text-zinc-500">Niciun chestionar creat.</div>}
      </div>
    </div>
  );
}

function AnunturiManager({ anunturi, setAnunturi }) {
  const [titlu, setTitlu] = useState("");
  const [text, setText] = useState("");
  function adauga(){ if(!titlu.trim())return; const item={id:Date.now(), titlu, text, data:new Date().toISOString()}; const nou=[item,...anunturi]; setAnunturi(nou); saveToStorage("anunturi", nou); setTitlu(""); setText(""); }
  function exportAnnouncements(){
    const rows = ["id,titlu,text,data"].concat(anunturi.map(a=>[a.id,`"${a.titlu}"`,`"${a.text}"`,a.data].join(","))).join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="anunturi.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Publică anunț</h3>
        <input placeholder="Titlu" value={titlu} onChange={e=>setTitlu(e.target.value)} />
        <textarea className="w-full mt-2" placeholder="Text" value={text} onChange={e=>setText(e.target.value)} />
        <div className="mt-2 flex gap-2">
          <button className="px-3 py-1 border rounded text-sm" onClick={adauga}>Publică</button>
          <button className="px-3 py-1 border rounded text-sm" onClick={exportAnnouncements}><Download className="inline mr-2"/>Export CSV</button>
        </div>
      </div>
      <div className="p-4 border rounded">
        {anunturi.map(a=> (
          <div key={a.id} className="p-2 border rounded mb-2">
            <div className="font-medium">{a.titlu}</div>
            <div className="text-sm text-zinc-600">{a.text}</div>
            <div className="text-xs text-zinc-500">{new Date(a.data).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrarManager() {
  const [evenimente, setEvenimente] = useState(loadFromStorage("orar", []));
  const [titlu, setTitlu] = useState("");
  const [data, setData] = useState("");
  function adauga(){ if(!titlu||!data)return; const e={id:Date.now(), titlu, data}; const nou=[e,...evenimente]; setEvenimente(nou); saveToStorage("orar", nou); setTitlu(""); setData(""); }
  function exportCalendar(){
    const rows = ["id,titlu,data"].concat(evenimente.map(e=>[e.id,`"${e.titlu}"`,e.data].join(","))).join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="calendar.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <input placeholder="Titlu eveniment" value={titlu} onChange={e=>setTitlu(e.target.value)} />
        <input placeholder="Data (YYYY-MM-DD)" value={data} onChange={e=>setData(e.target.value)} />
        <div className="mt-2 flex gap-2">
          <button className="px-3 py-1 border rounded text-sm" onClick={adauga}>Adaugă eveniment</button>
          <button className="px-3 py-1 border rounded text-sm" onClick={exportCalendar}><Download className="inline mr-2"/>Export CSV</button>
        </div>
      </div>
      <div className="p-4 border rounded">
        {evenimente.map(ev=> (
          <div key={ev.id} className="p-2 border rounded mb-2">
            <div className="font-medium">{ev.titlu}</div>
            <div className="text-xs text-zinc-500">{ev.data}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Edurospective() {
  const [user, setUser] = useState(loadFromStorage("user", { name: "Profesor (demo)" }));
  const [view, setView] = useState("dashboard");

  const [cursuri, setCursuri] = useState(loadFromStorage("cursuri", initialCursuri));
  const [elevi, setElevi] = useState(loadFromStorage("elevi", initialElevi));
  const [anunturi, setAnunturi] = useState(loadFromStorage("anunturi", initialAnunturi));
  const [teme, setTeme] = useState(loadFromStorage("teme", []));

  useEffect(()=> saveToStorage("cursuri", cursuri), [cursuri]);
  useEffect(()=> saveToStorage("elevi", elevi), [elevi]);
  useEffect(()=> saveToStorage("anunturi", anunturi), [anunturi]);
  useEffect(()=> saveToStorage("teme", teme), [teme]);

  function logout(){ localStorage.removeItem("user"); setUser(null); }
  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="w-full max-w-md p-6 border rounded">
          <h2 className="text-2xl font-semibold mb-4">Autentificare profesori — Edurospective</h2>
          <input placeholder="Email" className="w-full mb-2" />
          <input placeholder="Parolă" type="password" className="w-full mb-4" />
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={()=>{ const demo = { name: "Prof. Demo" }; setUser(demo); saveToStorage("user", demo); }}>Autentificare demo</button>
            <button className="px-3 py-1 border rounded" onClick={()=>{ alert("Dacă doriți autentificare reală, pot integra OAuth / LDAP / SSO."); }}>Ajutor</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <Sidebar view={view} setView={setView} />
      <main className="p-6">
        <Header user={user} onLogout={logout} />
        <div className="mt-4">
          {view==="dashboard" && <Dashboard cursuri={cursuri} elevi={elevi} anunturi={anunturi} />}
          {view==="templates" && <TemplatesManager />}
          {view==="evaluari" && <EvaluariManager elevi={elevi} />}
          {view==="anunturi" && <AnunturiManager anunturi={anunturi} setAnunturi={setAnunturi} />}
          {view==="orar" && <OrarManager />}
          {view==="directori" && (
            <div className="p-4 border rounded">
              <h3 className="font-semibold">Instrumente pentru directori</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Checklist audit intern</li>
                <li>Module observare lecții</li>
                <li>Rapoarte automate (sumar exportabil)</li>
              </ul>
            </div>
          )}
          {view==="setari" && (
            <div className="p-4 border rounded">
              <h3 className="font-semibold">Setări platformă</h3>
              <p className="text-sm text-zinc-600 mt-2">Opțiuni: export date, personalizare branding, integrare autentificare (LDAP, OAuth), backup automat.</p>
              <div className="mt-4">
                <button className="px-3 py-1 border rounded text-sm" onClick={()=>{
                  const data = { cursuri, elevi, anunturi, teme };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = "backup_edurospective.json"; a.click(); URL.revokeObjectURL(url);
                }}><Download className="inline mr-2"/>Descarcă backup</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
