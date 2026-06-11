// ── Finanzas Seba · UI Kit · Calculadora Tarjeta ────────────────────────────
// Export: window.UICalculadora

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const REF_YEAR = 2026, REF_MONTH = 6;
const COLORS = ["#2997ff","#ff6584","#30d158","#ffd60a","#06b6d4","#f472b6","#a78bfa"];

const INIT_CUOTAS = [
  { id:1, name:"iPhone For Life", total:1_617_000, numCuotas:36, startMonth:6, startYear:2026, color:"#2997ff" },
  { id:2, name:"Osojimix",        total:120_000,  numCuotas:3,  startMonth:6, startYear:2026, color:"#ff6584" },
];

function fee(c) { return Math.round(c.total / c.numCuotas); }
function statusFor(c, year, month) {
  const si = c.startYear*12 + (c.startMonth-1);
  const vi = year*12 + (month-1);
  const ei = si + c.numCuotas - 1;
  if (vi < si) return { status:"future", num:null, remaining:c.numCuotas };
  if (vi > ei) return { status:"paid",   num:null, remaining:0 };
  const num = vi - si + 1;
  return { status:"active", num, remaining:c.numCuotas - num + 1 };
}
function totalForMonth(cuotas, year, month) {
  return cuotas.reduce((s,c) => statusFor(c,year,month).status==="active" ? s+fee(c) : s, 0);
}
function fmt(n) { return Math.round(n).toLocaleString("es-CL"); }
function getColor(val, lim) {
  if (lim<=0) return "var(--accent)";
  const r = val/lim;
  return r<=0.8 ? "var(--green)" : r<=1 ? "var(--yellow)" : "var(--red)";
}
function getSt(val, lim) {
  if (lim<=0) return "ok";
  const r = val/lim;
  return r<=0.8 ? "ok" : r<=1 ? "warn" : "over";
}

function UICalculadora({ cupoTotal, limiteMensual, initialCuotas, initialCupo, onCuotasChange, onCupoChange, onLimiteChange }) {
  const [cuotas, setCuotasRaw] = React.useState(initialCuotas || INIT_CUOTAS);
  const [cupoDisp, setCupoDispRaw] = React.useState(initialCupo || 1_500_000);
  const [limite, setLimiteRaw] = React.useState(limiteMensual || 600_000);
  const [viewY, setViewY] = React.useState(REF_YEAR);
  const [viewM, setViewM] = React.useState(REF_MONTH);
  const [flash, setFlash] = React.useState(false);
  const [fName,setFName]=React.useState(""); const [fTotal,setFTotal]=React.useState("");
  const [fCuotas,setFCuotas]=React.useState(""); const [fMes,setFMes]=React.useState(""); const [fAnio,setFAnio]=React.useState("");
  const [nextId,setNextId]=React.useState(3);

  const setCuotas = (fn) => { const n = typeof fn==="function"?fn(cuotas):fn; setCuotasRaw(n); onCuotasChange?.(n); flashSave(); };
  const setCupoDisp = (v) => { setCupoDispRaw(v); onCupoChange?.(v); };
  const setLimite = (v) => { setLimiteRaw(v); onLimiteChange?.(v); };
  const flashSave = () => { setFlash(true); setTimeout(()=>setFlash(false),2000); };

  const comprometido = cuotas.reduce((s,c)=>{
    const {status,remaining}=statusFor(c,REF_YEAR,REF_MONTH);
    if(status==="active") return s+remaining*fee(c);
    if(status==="future") return s+c.total;
    return s;
  },0);
  const cupoUtil = Math.max(0, cupoTotal - cupoDisp);
  const contado = Math.max(0, cupoUtil - comprometido);
  const activasRef = cuotas.filter(c=>statusFor(c,REF_YEAR,REF_MONTH).status==="active");
  const maxRem = activasRef.reduce((m,c)=>Math.max(m,statusFor(c,REF_YEAR,REF_MONTH).remaining),0);

  const cuotasMes = totalForMonth(cuotas, viewY, viewM);
  const isRef = viewY===REF_YEAR && viewM===REF_MONTH;
  const contadoMes = isRef ? contado : 0;
  const totalMes = cuotasMes + contadoMes;
  const margen = limite - totalMes;
  const st = getSt(totalMes, limite);
  const col = getColor(totalMes, limite);
  const pct = limite>0 ? Math.min(Math.round((totalMes/limite)*100),150) : 0;

  const billingM = viewM===12?1:viewM+1, billingY = viewM===12?viewY+1:viewY;
  const chipMap = { ok:{bg:"rgba(48,209,88,0.15)",color:"var(--green)",txt:"✓ OK"}, warn:{bg:"rgba(255,214,10,0.14)",color:"var(--yellow)",txt:"⚠ ATENCIÓN"}, over:{bg:"rgba(255,69,58,0.14)",color:"var(--red)",txt:"✕ EXCEDE"} };
  const chip = chipMap[st];

  const today = new Date();
  const nextClose = today.getDate()<=23 ? new Date(today.getFullYear(),today.getMonth(),23) : new Date(today.getFullYear(),today.getMonth()+1,23);
  const daysLeft = Math.max(0,Math.ceil((nextClose.getTime()-today.getTime())/86400000));
  const dailyBudget = margen>0&&daysLeft>0 ? Math.floor(margen/daysLeft) : 0;

  const deudaCero = (() => {
    const np = cuotas.filter(c=>statusFor(c,REF_YEAR,REF_MONTH).status!=="paid");
    if(!np.length) return null;
    let mx=0; np.forEach(c=>{ const idx=c.startYear*12+(c.startMonth-1)+c.numCuotas-1; if(idx>mx) mx=idx; });
    return { year:Math.floor(mx/12), month:mx%12+1, meses:mx-(REF_YEAR*12+REF_MONTH-1) };
  })();

  const addCuota = () => {
    const n=fName.trim(),tot=parseInt(fTotal),nq=parseInt(fCuotas),mes=parseInt(fMes),anio=parseInt(fAnio);
    if(!n||isNaN(tot)||isNaN(nq)||isNaN(mes)||isNaN(anio)) return alert("Completa todos los campos.");
    setCuotas(prev=>[...prev,{id:nextId,name:n,total:tot,numCuotas:nq,startMonth:mes,startYear:anio,color:COLORS[prev.length%COLORS.length]}]);
    setNextId(x=>x+1); setFName("");setFTotal("");setFCuotas("");setFMes("");setFAnio("");
  };

  const secTitle = { fontSize:"var(--text-2xs)",fontWeight:600,color:"var(--muted)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10,marginTop:28 };
  const ibStyle = { fontSize:28,fontWeight:300,letterSpacing:"-0.5px",background:"transparent",border:"none",color:"var(--text)",fontFamily:"var(--font-text)",fontVariantNumeric:"tabular-nums",outline:"none",flex:1,minWidth:0 };

  return (
    <div>
      {/* HEADER */}
      <header style={{ marginBottom:36 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ fontSize:11,fontWeight:500,letterSpacing:"0.04em",color:"var(--accent)" }}>CONTROL FINANCIERO</div>
          <button onClick={flashSave} style={{ fontSize:12,fontWeight:600,fontFamily:"inherit",color:flash?"var(--green)":"var(--accent)",background:flash?"rgba(48,209,88,0.12)":"var(--accent-soft)",border:`1px solid ${flash?"rgba(48,209,88,0.2)":"var(--accent-soft-border)"}`,padding:"5px 14px",borderRadius:"var(--radius-pill)",cursor:"pointer" }}>
            {flash?"Guardado ✓":"Guardar"}
          </button>
        </div>
        <h1 style={{ fontSize:"clamp(28px,6vw,40px)",fontWeight:700,lineHeight:1.05,letterSpacing:"-0.03em",margin:"8px 0 0" }}>Facturación<br/><span style={{ color:"var(--accent)" }}>Tarjeta</span></h1>
        <p style={{ fontSize:13,color:"var(--muted)",marginTop:6 }}>Ciclo de facturación: día 23 de cada mes</p>
      </header>

      {/* INPUTS GRID */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"var(--border)",borderRadius:"var(--radius-xl)",overflow:"hidden",marginBottom:1 }}>
        {[
          { label:"Cupo disponible (banco)", val:cupoDisp, set:setCupoDisp, sub:`$${fmt(comprometido)} en cuotas · $${fmt(contado)} contado` },
          { label:"Límite mensual deseado", val:limite, set:setLimite, sub:`Margen libre = $${fmt(Math.max(0,limite-totalForMonth(cuotas,REF_YEAR,REF_MONTH)))}` },
        ].map(({ label,val,set,sub },i) => (
          <div key={i} style={{ background:"var(--surface)",padding:"20px 22px 18px" }}>
            <div style={{ fontSize:11,fontWeight:500,color:"var(--secondary)",letterSpacing:"0.02em",marginBottom:10 }}>{label}</div>
            <div style={{ display:"flex",alignItems:"baseline",gap:4 }}>
              <span style={{ fontSize:20,fontWeight:300,color:"var(--muted)" }}>$</span>
              <input type="number" value={val||""} placeholder="0" onChange={(e)=>set(parseInt(e.target.value)||0)} style={ibStyle} />
            </div>
            <div style={{ fontSize:11,color:"var(--muted)",marginTop:8 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* CUPO BREAKDOWN */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:"var(--border)",borderRadius:"0 0 var(--radius-xl) var(--radius-xl)",overflow:"hidden",marginBottom:24 }}>
        {[
          { l:"Cuotas comprometidas", v:`$${fmt(comprometido)}` },
          { l:"Libre (contado)", v:contado>0?`$${fmt(contado)}`:"$0", c:"var(--green)" },
          { l:"Meses con cuotas", v:maxRem>0?`${maxRem} meses`:"—" },
        ].map(({l,v,c},i)=>(
          <div key={i} style={{ background:"var(--surface)",padding:"14px 22px" }}>
            <div style={{ fontSize:11,fontWeight:500,color:"var(--muted)",marginBottom:4,letterSpacing:"0.01em" }}>{l}</div>
            <div style={{ fontSize:15,fontWeight:600,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums",color:c||"var(--text)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* BILLING HERO */}
      <div style={{ background:"var(--surface)",borderRadius:"var(--radius-xl)",padding:"24px 22px",marginBottom:24 }}>
        <div style={{ fontSize:11,fontWeight:500,color:"var(--secondary)",letterSpacing:"0.02em",marginBottom:8,display:"flex",alignItems:"center",gap:8 }}>
          Pago estimado este ciclo
          <span style={{ fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:"var(--radius-pill)",background:chip.bg,color:chip.color }}>{chip.txt}</span>
        </div>
        <div style={{ fontSize:"clamp(36px,8vw,54px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1,marginBottom:20,fontVariantNumeric:"tabular-nums" }}>
          <span style={{ fontSize:"0.42em",fontWeight:400,color:"var(--secondary)",verticalAlign:"super",marginRight:2 }}>$</span>
          <span style={{ color:col }}>{fmt(totalMes)}</span>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginBottom:6 }}>
            <span>$0</span><span>Límite ${fmt(limite)}</span>
          </div>
          <div style={{ height:4,background:"var(--surface2)",borderRadius:"var(--radius-pill)",overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${Math.min(pct,100)}%`,background:col,borderRadius:"var(--radius-pill)",transition:"width 0.4s ease" }} />
          </div>
        </div>
        <div style={{ fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:6,marginBottom:14 }}>
          <span style={{ width:5,height:5,background:"var(--accent)",borderRadius:"50%",display:"inline-block" }} />
          Facturación el 23 de {MONTHS_ES[billingM-1].toLowerCase()} {billingY}
        </div>
        <div style={{ display:"flex",gap:20,paddingTop:14,borderTop:"1px solid var(--border)",flexWrap:"wrap" }}>
          <div><div style={{ fontSize:11,color:"var(--muted)",marginBottom:2 }}>Cierre en</div>
            <div style={{ fontSize:22,fontWeight:700,letterSpacing:"-0.02em",color:daysLeft<=5?"var(--yellow)":"var(--text)" }}>{daysLeft} días</div></div>
          {dailyBudget>0 && <div><div style={{ fontSize:11,color:"var(--muted)",marginBottom:2 }}>Presupuesto diario libre</div>
            <div style={{ fontSize:22,fontWeight:700,letterSpacing:"-0.02em",color:"var(--green)" }}>${fmt(dailyBudget)}<span style={{ fontSize:12,fontWeight:400,color:"var(--muted)" }}>/día</span></div></div>}
          {deudaCero && <div style={{ marginLeft:"auto",textAlign:"right" }}>
            <div style={{ fontSize:11,color:"var(--muted)",marginBottom:2 }}>Deuda 0</div>
            <div style={{ fontSize:16,fontWeight:700,color:"var(--accent)" }}>{MONTHS_ES[deudaCero.month-1].slice(0,3)} {deudaCero.year}</div>
            <div style={{ fontSize:11,color:"var(--muted)" }}>en {deudaCero.meses} meses</div>
          </div>}
        </div>
        <div style={{ marginTop:18,paddingTop:18,borderTop:"1px solid var(--border)",display:"flex",gap:28,flexWrap:"wrap" }}>
          {[["En cuotas",`$${fmt(cuotasMes)}`],["Contado",isRef?`$${fmt(contadoMes)}`:"—"],["Margen libre",margen>=0?`$${fmt(margen)}`:`-$${fmt(-margen)}`,margen>=0?"var(--green)":"var(--red)"]].map(([l,v,c])=>(
            <div key={l}><div style={{ fontSize:11,fontWeight:500,color:"var(--muted)",marginBottom:3 }}>{l}</div>
              <div style={{ fontSize:15,fontWeight:600,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums",color:c||"var(--text)" }}>{v}</div></div>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <div style={secTitle}>Proyección 12 meses</div>
      <div style={{ overflowX:"auto",marginBottom:28,paddingBottom:4 }}>
        <div style={{ display:"flex",gap:6,minWidth:"max-content" }}>
          {Array.from({length:12},(_,i)=>{
            const d=new Date(REF_YEAR,REF_MONTH-1+i,1); const y=d.getFullYear(),m=d.getMonth()+1;
            const t=totalForMonth(cuotas,y,m)+(i===0?contado:0);
            const isCur=y===viewY&&m===viewM;
            const st2=getSt(t,limite); const col2=getColor(t,limite);
            const pct2=limite>0?Math.min(Math.round((t/limite)*100),100):0;
            return (
              <div key={`${y}-${m}`} onClick={()=>{setViewY(y);setViewM(m);}}
                style={{ background:isCur?"var(--surface2)":"var(--surface)",borderRadius:"var(--radius-lg)",padding:"12px 14px",minWidth:100,cursor:"pointer",flexShrink:0,outline:isCur?"1px solid var(--accent)":st2==="over"?"1px solid rgba(255,69,58,0.4)":st2==="warn"?"1px solid rgba(255,214,10,0.35)":"none",outlineOffset:"-1px" }}>
                <div style={{ fontSize:10,fontWeight:500,color:"var(--muted)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em" }}>{MONTHS_ES[m-1].slice(0,3)} {y}</div>
                <div style={{ fontSize:15,fontWeight:600,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums",color:col2 }}>${fmt(t)}</div>
                <div style={{ height:2,background:"var(--surface2)",borderRadius:"var(--radius-pill)",overflow:"hidden",marginTop:6 }}>
                  <div style={{ height:"100%",width:`${pct2}%`,background:col2,borderRadius:"var(--radius-pill)" }} />
                </div>
                <div style={{ fontSize:10,color:"var(--muted)",marginTop:4 }}>{cuotas.filter(c=>statusFor(c,y,m).status==="active").length} cuotas</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MONTH NAV */}
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
        {["←","→"].map((a,i)=>(
          <button key={a} onClick={()=>{const d=new Date(viewY,viewM-1+(i?1:-1),1);setViewY(d.getFullYear());setViewM(d.getMonth()+1);}}
            style={{ background:"var(--surface)",border:"none",color:"var(--secondary)",width:32,height:32,borderRadius:"var(--radius-sm)",cursor:"pointer",fontSize:14,fontFamily:"inherit",transition:"background 0.15s" }}>{a}</button>
        ))}
        <div style={{ fontSize:14,fontWeight:600,letterSpacing:"-0.01em",flex:1,textAlign:"center" }}>{MONTHS_ES[viewM-1]} {viewY}</div>
      </div>

      {/* CUOTA LIST */}
      <div style={secTitle}>Detalle cuotas</div>
      {cuotas.length===0
        ? <div style={{ textAlign:"center",padding:24,color:"var(--muted)",fontSize:13 }}>Sin compras en cuotas.</div>
        : cuotas.map(c=>{
          const {status,num,remaining}=statusFor(c,viewY,viewM);
          const f=fee(c); const pct3=status==="active"?Math.round((num/c.numCuotas)*100):status==="paid"?100:0;
          const badgeMap={ active:{bg:"rgba(41,151,255,0.15)",c:"var(--accent)",t:"Activa"}, future:{bg:"rgba(255,214,10,0.1)",c:"var(--yellow)",t:"Futura"}, paid:{bg:"rgba(48,209,88,0.12)",c:"var(--green)",t:"Pagada"} };
          const badge=badgeMap[status];
          return (
            <div key={c.id} style={{ background:"var(--surface)",borderRadius:"var(--radius-lg)",padding:"14px 16px",marginBottom:6,display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"center",opacity:status==="paid"?0.35:1,outline:status==="active"?"1px solid var(--accent-soft-border)":"none",outlineOffset:"-1px" }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:600,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:"-0.01em" }}>{c.name}</div>
                <div style={{ fontSize:11,color:"var(--muted)",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" }}>
                  <span style={{ fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:"var(--radius-pill)",background:badge.bg,color:badge.c }}>{badge.t}</span>
                  {status==="active"&&<span>Cuota {num} de {c.numCuotas} · quedan {remaining}</span>}
                  {status==="future"&&<span>Inicia {MONTHS_ES[c.startMonth-1]} {c.startYear}</span>}
                  {status==="paid"&&<span>Completada</span>}
                </div>
                <div style={{ marginTop:8,height:2,background:"var(--surface2)",borderRadius:"var(--radius-pill)",overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${pct3}%`,background:c.color,borderRadius:"var(--radius-pill)",opacity:0.7,transition:"width 0.4s ease" }} />
                </div>
              </div>
              <div style={{ display:"flex",alignItems:"flex-start",gap:8 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:15,fontWeight:600,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums",color:status==="active"?c.color:"var(--muted)" }}>{status==="active"?`$${fmt(f)}`:"—"}</div>
                  <div style={{ fontSize:11,color:"var(--muted)",marginTop:2 }}>{status!=="paid"?`$${fmt(f)}/mes`:`Total: $${fmt(c.total)}`}</div>
                </div>
                <button onClick={()=>setCuotas(prev=>prev.filter(x=>x.id!==c.id))}
                  style={{ background:"none",border:"none",color:"var(--muted)",cursor:"pointer",width:24,height:24,borderRadius:"var(--radius-xs)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>✕</button>
              </div>
            </div>
          );
        })}

      {/* ADD FORM */}
      <div style={{ background:"var(--surface)",borderRadius:"var(--radius-xl)",padding:20,marginTop:28 }}>
        <div style={{ ...secTitle,marginTop:0,marginBottom:16 }}>Agregar compra en cuotas</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          {[["Descripción","text",fName,setFName,"Ej: MacBook Air"],["Monto total ($)","number",fTotal,setFTotal,"500000"]].map(([l,t,v,s,p])=>(
            <div key={l}><label style={{ display:"block",fontSize:11,fontWeight:500,color:"var(--muted)",letterSpacing:"0.03em",marginBottom:6 }}>{l}</label>
              <input type={t} value={v} placeholder={p} onChange={e=>s(e.target.value)} style={{ width:"100%",background:"var(--surface2)",border:"none",borderRadius:"var(--radius-sm)",color:"var(--text)",fontFamily:"var(--font-text)",fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box" }} /></div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:12,marginBottom:12 }}>
          {[["N° cuotas","number",fCuotas,setFCuotas,"12"],["Mes inicio","number",fMes,setFMes,"6"],["Año inicio","number",fAnio,setFAnio,"2026"]].map(([l,t,v,s,p])=>(
            <div key={l}><label style={{ display:"block",fontSize:11,fontWeight:500,color:"var(--muted)",letterSpacing:"0.03em",marginBottom:6 }}>{l}</label>
              <input type={t} value={v} placeholder={p} onChange={e=>s(e.target.value)} style={{ width:"100%",background:"var(--surface2)",border:"none",borderRadius:"var(--radius-sm)",color:"var(--text)",fontFamily:"var(--font-text)",fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box" }} /></div>
          ))}
        </div>
        <button onClick={addCuota} style={{ width:"100%",background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--radius-md)",padding:13,fontFamily:"var(--font-text)",fontSize:14,fontWeight:600,letterSpacing:"-0.01em",cursor:"pointer" }}>
          + Agregar compra
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { UICalculadora, MONTHS_ES, INIT_CUOTAS });
