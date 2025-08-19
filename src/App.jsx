import React, { useState, useEffect } from "react";

/* Edurospective – variantă stabilă (fără iconițe / animații) */

function Logo({ size = 40 }) {
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#2b2b2b" />
    <path d="M12 18L24 12L36 18V30L24 36L12 30V18Z" fill="white" />
    <path d="M12 18L24 24L36 18" stroke="#bfbfbf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

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

function saveToStorage(k, v){ try{localStorage.setItem(k, JSON.stringify(v))}catch{} }
function loadFromStorage(k, fb){ try{const v=localStorage.getItem(k); return v?JSON.parse(v):fb}catch{return fb} }

function Header({ user, onLogout }) {
  return (
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px",borderBottom:"1px solid #e5e5e5"}}>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <div style={{height:40,width:40,display:"grid",placeItems:"center"}}><Logo/></div>
        <div>
          <div style={{fontWeight:600}}>Edurospective</div>
          <div style={{fontSize:12,color:"#666"}}>Instrumente pentru calitate — doar profesori</div>
        </div>
      </div>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <div style={{fontSize:14}}>{user.name}</div>
        <button onClick={onLogout} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Deconectare</button>
      </div>
    </header>
  );
}

function Sidebar({ view, setView }) {
  const Btn = ({ v, children }) => (
    <button
      onClick={()=>setView(v)}
      style={{
        display:"block", width:"100%", textAlign:"left", padding:8, borderRadius:8,
        background: view===v ? "#eef2ff" : "transparent", border:"1px solid #eee", marginBottom:8
      }}
    >{children}</button>
  );
  return (
    <aside style={{width:260, borderRight:"1px solid #eee", padding:16}}>
      <nav>
        <Btn v="dashboard">Dashboard</Btn>
        <Btn v="templates">Șabloane PDI/POA</Btn>
        <Btn v="evaluari">Evaluări & Fișe</Btn>
        <Btn v="anunturi">Anunțuri</Btn>
        <Btn v="orar">Calendar</Btn>
        <Btn v="directori">Instrumente Director</Btn>
        <Btn v="setari">Setări</Btn>
      </nav>
    </aside>
  );
}

function Dashboard({ cursuri, elevi, anunturi }) {
  const Card = ({ label, value }) => (
    <div style={{padding:16, border:"1px solid #eee", borderRadius:8}}>
      {label}<br/><strong>{value}</strong>
    </div>
  );
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      <Card label="Cursuri" value={cursuri.length}/>
      <Card label="Elevi" value={elevi.length}/>
      <Card label="Anunțuri" value={anunturi.length}/>
    </div>
  );
}

function TemplatesManager() {
  const templates = [
    { id: "pdi", titlu: "Model PDI (Plan dezvoltare instituțională)", text: `Titlu PDI\nObiective...\nIndicatori...\nActivități...` },
    { id: "poa", titlu: "Model POA (Plan operațional anual)", text: `Titlu POA\nActivități anuale...\nResponsabili...` },
    { id: "fise_autoevaluare", titlu: "Fișe autoevaluare (profesori/directori)", text: `Întrebări autoevaluare...` },
    { id: "rae", titlu: "Structură Raport Autoevaluare Anual", text: `Sumar executiv...\nAnaliză calitate...` },
  ];
  function downloadText(t) {
    const blob = new Blob([t.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${t.id}.txt`; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div style={{display:"grid",gap:12}}>
      {templates.map(t=>(
        <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:12,border:"1px solid #eee",borderRadius:8}}>
          <div>
            <div style={{fontWeight:600}}>{t.titlu}</div>
            <div style={{fontSize:12,color:"#666"}}>Descărcați sau copiați conținutul modelului.</div>
          </div>
          <button onClick={()=>downloadText(t)} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Descarcă</button>
        </div>
      ))}
    </div>
  );
}

function EvaluariManager({ elevi }) {
  const [intrebare, setIntrebare] = useState("");
  const [formulare, setFormulare] = useState(loadFromStorage("formulare", []));
  const [raspunsuri, setRaspunsuri] = useState(loadFromStorage("raspunsuri", {}));

  function creeazaForm() {
    if (!intrebare.trim()) return;
    const f = { id: Date.now(), titlu: intrebare, created: new Date().toISOString() };
    const nou = [f, ...formulare];
    setFormulare(nou); saveToStorage("formulare", nou); setIntrebare("");
  }
  function submitDummyResponse(formId) {
    const responses = elevi.map(e => ({ elevId: e.id, raspuns: "OK" }));
    const all = { ...raspunsuri, [formId]: (raspunsuri[formId] || []).concat(responses) };
    setRaspunsuri(all); saveToStorage("raspunsuri", all);
    alert("Răspunsuri demo adăugate (pentru vizualizare).");
  }
  function exportFormResults(formId) {
    const rows = ["formId,studentId,studentName,answer"];
    const rowsArr = (raspunsuri[formId]||[]).map(r =>
      [formId, r.elevId, `"${(elevi.find(e=>e.id===r.elevId)||{}).nume||""}"`, `"${r.raspuns}"`].join(",")
    );
    const blob = new Blob([rows.concat(rowsArr).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `form_${formId}_results.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div style={{display:"grid",gap:16}}>
      <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
        <h3 style={{margin:"0 0 8px 0"}}>Creează chestionar evaluativ</h3>
        <input placeholder="Titlu chestionar" value={intrebare} onChange={e=>setIntrebare(e.target.value)} />
        <div style={{marginTop:8}}>
          <button onClick={creeazaForm} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Creează</button>
        </div>
      </div>
      <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
        <h3 style={{margin:"0 0 8px 0"}}>Chestionare</h3>
        {formulare.map(f=>(
          <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:12,border:"1px solid #eee",borderRadius:8,marginBottom:8}}>
            <div>
              <div style={{fontWeight:600}}>{f.titlu}</div>
              <div style={{fontSize:12,color:"#666"}}>Creat: {new Date(f.created).toLocaleString()}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>submitDummyResponse(f.id)} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Răspunsuri demo</button>
              <button onClick={()=>exportFormResults(f.id)} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Export rezultate</button>
            </div>
          </div>
        ))}
        {formulare.length===0 && <div style={{fontSize:12,color:"#666"}}>Niciun chestionar creat.</div>}
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
    <div style={{display:"grid",gap:16}}>
      <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
        <h3 style={{margin:"0 0 8px 0"}}>Publică anunț</h3>
        <input placeholder="Titlu" value={titlu} onChange={e=>setTitlu(e.target.value)} />
        <textarea placeholder="Text" value={text} onChange={e=>setText(e.target.value)} style={{display:"block",width:"100%",marginTop:8}} />
        <div style={{marginTop:8, display:"flex", gap:8}}>
          <button onClick={adauga} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Publică</button>
          <button onClick={exportAnnouncements} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Export CSV</button>
        </div>
      </div>
      <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
        {anunturi.map(a=> (
          <div key={a.id} style={{padding:12,border:"1px solid #eee",borderRadius:8, marginBottom:8}}>
            <div style={{fontWeight:600}}>{a.titlu}</div>
            <div style={{fontSize:14,color:"#444"}}>{a.text}</div>
            <div style={{fontSize:11,color:"#666"}}>{new Date(a.data).toLocaleString()}</div>
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
    const blob = new Blob([rows], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "calendar.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div style={{display:"grid",gap:16}}>
      <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
        <input placeholder="Titlu eveniment" value={titlu} onChange={e=>setTitlu(e.target.value)} />
        <input placeholder="Data (YYYY-MM-DD)" value={data} onChange={e=>setData(e.target.value)} />
        <div style={{marginTop:8, display:"flex", gap:8}}>
          <button onClick={adauga} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Adaugă eveniment</button>
          <button onClick={exportCalendar} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Export CSV</button>
        </div>
      </div>
      <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
        {evenimente.map(ev=> (
          <div key={ev.id} style={{padding:12,border:"1px solid #eee",borderRadius:8, marginBottom:8}}>
            <div style={{fontWeight:600}}>{ev.titlu}</div>
            <div style={{fontSize:11,color:"#666"}}>{ev.data}</div>
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
      <div style={{minHeight:"100vh", display:"grid", placeItems:"center"}}>
        <div style={{width:"100%", maxWidth:480, padding:24, border:"1px solid #eee", borderRadius:8, background:"#fff"}}>
          <h2 style={{fontSize:22, fontWeight:600, marginBottom:16}}>Autentificare profesori — Edurospective</h2>
          <input placeholder="Email" style={{display:"block", width:"100%", marginBottom:8}} />
          <input placeholder="Parolă" type="password" style={{display:"block", width:"100%", marginBottom:16}} />
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>{ const demo = { name: "Prof. Demo" }; setUser(demo); saveToStorage("user", demo); }} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Autentificare demo</button>
            <button onClick={()=>{ alert("Pentru autentificare reală putem integra OAuth / LDAP / SSO."); }} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}>Ajutor</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", display:"grid", gridTemplateColumns:"260px 1fr"}}>
      <Sidebar view={view} setView={setView} />
      <main style={{padding:24}}>
        <Header user={user} onLogout={logout} />
        <div style={{marginTop:16}}>
          {view==="dashboard" && <Dashboard cursuri={cursuri} elevi={elevi} anunturi={anunturi} />}
          {view==="templates" && <TemplatesManager />}
          {view==="evaluari" && <EvaluariManager elevi={elevi} />}
          {view==="anunturi" && <AnunturiManager anunturi={anunturi} setAnunturi={setAnunturi} />}
          {view==="orar" && <OrarManager />}
          {view==="directori" && (
            <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
              <h3 className="font-semibold">Instrumente pentru directori</h3>
              <ul>
                <li>Checklist audit intern</li>
                <li>Module observare lecții</li>
                <li>Rapoarte automate (sumar exportabil)</li>
              </ul>
            </div>
          )}
          {view==="setari" && (
            <div style={{padding:16,border:"1px solid #eee",borderRadius:8}}>
              <h3 style={{margin:"0 0 8px 0"}}>Setări platformă</h3>
              <p style={{fontSize:14,color:"#555"}}>Opțiuni: export date, personalizare branding, integrare autentificare (LDAP, OAuth), backup automat.</p>
              <div style={{marginTop:12}}>
                <button
                  onClick={()=>{
                    const data = { cursuri, elevi, anunturi, teme };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = "backup_edurospective.json"; a.click(); URL.revokeObjectURL(url);
                  }}
                  style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:12}}
                >
                  Descarcă backup
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
