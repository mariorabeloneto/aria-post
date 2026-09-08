import { useState, useCallback } from "react";

const SEARCH_SYS = `You are ARIA, a B2B prospecting agent for POST agency (Vila Nova de Gaia, Portugal).
POST services: Gestão de Redes Sociais, Meta Ads, Google Ads, Google My Business, Modelos IA Voxel (AI model campaigns for fashion/jewelry/sneakers/watches/gyms/supplements).

Use web_search to find REAL businesses in Portugal. Analyze each one's digital presence gaps.

YOU MUST respond ONLY with raw valid JSON. Zero text before or after. No markdown. No explanation.

{"leads":[{"nome":"string","setor":"string","localizacao":"string","website":"url or null","instagram":"@handle or null","facebook":"url or null","google_maps":"url or null","telefone":"string or null","email":"email or null","diagnostico":"2+ concrete sentences about digital gaps","oportunidades":["Meta Ads"],"score":8,"abertura_whatsapp":"Olá [Nome]! Vi que a [empresa]...","email_subject":"Assunto curto e direto","email_body":"3 parágrafos PT-PT formal sem saudação nem assinatura"}],"resumo":"string","total":5}

Rules:
- score 1-10 (10=biggest gaps + active business)
- Return 3-6 leads ordered by score desc
- oportunidades ONLY: "Meta Ads","Google Ads","Google My Business","Gestão de Redes Sociais","Website","Modelos IA Voxel"
- Add "Modelos IA Voxel" for fashion/jewelry/footwear/fitness/supplements
- All JSON strings properly escaped`;

const sc = s => s>=8?"#22c55e":s>=5?"#f59e0b":"#ef4444";
const sl = s => s>=8?"HOT":s>=5?"WARM":"COLD";

const EXAMPLES = [
  "Lojas de roupa em Lisboa sem presença digital",
  "Clínicas de estética no Porto sem presença digital",
  "Academias e ginásios em Gaia sem Meta Ads",
  "Lojas de ténis e calçado sem Instagram ativo",
  "Restaurantes em Braga com poucos seguidores",
  "Imobiliárias no Porto sem Google My Business",
];

function LeadCard({ lead, saveState, onWA, onEmail }) {
  const [exp, setExp] = useState(false);
  const c = sc(lead.score);
  const hasVoxel = lead.oportunidades?.includes("Modelos IA Voxel");

  const stBg  = saveState==="ok"?"#22c55e10":saveState==="err"?"#ef444410":saveState==="saving"?"#f59e0b08":"#1a2535";
  const stBdr = saveState==="ok"?"#22c55e40":saveState==="err"?"#ef444430":saveState==="saving"?"#f59e0b40":"#2a3a4a";
  const stClr = saveState==="ok"?"#22c55e":saveState==="err"?"#ef4444":saveState==="saving"?"#f59e0b":"#4a5568";
  const stTxt = saveState==="saving"?"⟳ A guardar...":saveState==="ok"?"✓ No Airtable":saveState==="err"?"✗ Erro":"· Aguarda";

  return (
    <div style={{background:"#0c1621",border:`1px solid ${exp?c+"55":"#1e2d3d"}`,borderRadius:10,padding:13,display:"flex",flexDirection:"column",gap:8,transition:"border-color 0.2s"}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{background:c+"18",border:`1px solid ${c}44`,borderRadius:8,padding:"5px 9px",display:"flex",flexDirection:"column",alignItems:"center",minWidth:48,flexShrink:0}}>
          <span style={{fontSize:20,fontWeight:800,color:c,lineHeight:1}}>{lead.score}</span>
          <span style={{fontSize:8,color:c,letterSpacing:"0.12em"}}>{sl(lead.score)}</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <p style={{margin:0,fontSize:14,fontWeight:700,color:"#f1f5f9",wordBreak:"break-word"}}>{lead.nome}</p>
            {hasVoxel && <span style={{fontSize:8,background:"#a855f710",border:"1px solid #a855f730",color:"#a855f7",padding:"1px 6px",borderRadius:3,whiteSpace:"nowrap"}}>✦ VOXEL</span>}
          </div>
          <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
            {lead.setor && <span style={{fontSize:9,background:"#1a2535",padding:"1px 6px",borderRadius:3,color:"#94a3b8"}}>{lead.setor}</span>}
            {lead.localizacao && <span style={{fontSize:10,color:"#4a5568"}}>📍 {lead.localizacao}</span>}
          </div>
        </div>
      </div>

      <span style={{fontSize:8,letterSpacing:"0.2em",color:"#3d5166"}}>DIAGNÓSTICO DIGITAL</span>
      <p style={{margin:0,fontSize:11,color:"#94a3b8",lineHeight:1.65}}>{lead.diagnostico}</p>

      {lead.oportunidades?.length > 0 && (
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {lead.oportunidades.map((op,i) => (
            <span key={i} style={{fontSize:9,background:op==="Modelos IA Voxel"?"#a855f710":c+"10",border:`1px solid ${op==="Modelos IA Voxel"?"#a855f730":c+"30"}`,color:op==="Modelos IA Voxel"?"#a855f7":c,padding:"2px 7px",borderRadius:3}}>{op}</span>
          ))}
        </div>
      )}

      {exp && (
        <div style={{display:"flex",flexWrap:"wrap",gap:5,borderTop:"1px solid #1a2535",paddingTop:7}}>
          {lead.website    && <a href={lead.website} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#64748b",background:"#0a1018",padding:"2px 8px",borderRadius:3,border:"1px solid #1a2535",textDecoration:"none"}}>🌐 Site</a>}
          {lead.instagram  && <a href={`https://instagram.com/${lead.instagram.replace("@","")}`} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#64748b",background:"#0a1018",padding:"2px 8px",borderRadius:3,border:"1px solid #1a2535",textDecoration:"none"}}>📷 {lead.instagram}</a>}
          {lead.facebook   && <a href={lead.facebook} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#64748b",background:"#0a1018",padding:"2px 8px",borderRadius:3,border:"1px solid #1a2535",textDecoration:"none"}}>📘 FB</a>}
          {lead.google_maps && <a href={lead.google_maps} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#64748b",background:"#0a1018",padding:"2px 8px",borderRadius:3,border:"1px solid #1a2535",textDecoration:"none"}}>🗺 Maps</a>}
          {lead.telefone   && <span style={{fontSize:10,color:"#64748b",background:"#0a1018",padding:"2px 8px",borderRadius:3,border:"1px solid #1a2535"}}>📞 {lead.telefone}</span>}
          {lead.email      && <span style={{fontSize:10,color:"#64748b",background:"#0a1018",padding:"2px 8px",borderRadius:3,border:"1px solid #1a2535"}}>✉ {lead.email}</span>}
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}>
        <button onClick={()=>setExp(!exp)} style={{background:"none",border:"none",color:"#3d5166",fontSize:10,cursor:"pointer",padding:0,fontFamily:"inherit"}}>
          {exp?"▲ menos":"▼ mais info"}
        </button>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <button onClick={onWA} style={{background:"#25D36614",border:"1px solid #25D36630",color:"#25D366",fontSize:10,padding:"4px 8px",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>◉ WhatsApp</button>
          <button onClick={onEmail} style={{background:"#3b82f614",border:"1px solid #3b82f630",color:"#60a5fa",fontSize:10,padding:"4px 8px",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>✉ Email</button>
          <span style={{background:stBg,border:`1px solid ${stBdr}`,color:stClr,fontSize:10,padding:"4px 8px",borderRadius:5,whiteSpace:"nowrap"}}>{stTxt}</span>
        </div>
      </div>
    </div>
  );
}

function MsgModal({ lead, type, onClose }) {
  const [cp, setCp] = useState(false);
  const isWA = type==="wa";
  const color = isWA?"#25D366":"#60a5fa";
  const msg = isWA ? lead.abertura_whatsapp : `${lead.email_body||""}`;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,minHeight:400}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d1520",border:"1px solid #1a2535",borderRadius:12,width:"100%",maxWidth:500,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #1a2535",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <span style={{color,fontSize:14}}>{isWA?"◉":"✉"}</span>
          <span style={{flex:1,fontSize:13,fontWeight:700,color:"#f1f5f9",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lead.nome}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#4a5568",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>✕</button>
        </div>
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:11,overflowY:"auto"}}>
          {!isWA && lead.email_subject && (
            <div style={{background:"#080c12",border:"1px solid #1a2535",borderRadius:6,padding:"6px 10px"}}>
              <span style={{fontSize:8,letterSpacing:"0.15em",color:"#3d5166"}}>ASSUNTO: </span>
              <span style={{fontSize:11,color:"#94a3b8"}}>{lead.email_subject}</span>
            </div>
          )}
          <span style={{fontSize:8,letterSpacing:"0.2em",color:"#3d5166"}}>{isWA?"MENSAGEM WHATSAPP":"CORPO DO EMAIL"}</span>
          <div style={{background:"#080c12",border:"1px solid #1a2535",borderRadius:8,padding:"12px 14px",fontSize:12,color:"#e2e8f0",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{msg}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{navigator.clipboard.writeText((isWA?lead.abertura_whatsapp:`Assunto: ${lead.email_subject||""}\n\n${lead.email_body||""}`)||"");setCp(true);setTimeout(()=>setCp(false),2000);}}
              style={{flex:1,background:cp?"#22c55e10":"#1a2535",border:`1px solid ${cp?"#22c55e40":"#2a3a4a"}`,color:cp?"#22c55e":"#94a3b8",fontSize:11,padding:9,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>
              {cp?"✓ Copiado!":"Copiar"}
            </button>
            {isWA && lead.telefone && (
              <a href={`https://wa.me/351${lead.telefone.replace(/\D/g,"")}?text=${encodeURIComponent(lead.abertura_whatsapp||"")}`}
                target="_blank" rel="noreferrer"
                style={{flex:1,textAlign:"center",background:"#25D36614",border:"1px solid #25D36630",color:"#25D366",fontSize:11,padding:9,borderRadius:6,textDecoration:"none",display:"block"}}>
                Abrir WhatsApp →
              </a>
            )}
            {!isWA && lead.email && (
              <a href={`mailto:${lead.email}?subject=${encodeURIComponent(lead.email_subject||"")}&body=${encodeURIComponent(lead.email_body||"")}`}
                style={{flex:1,textAlign:"center",background:"#3b82f614",border:"1px solid #3b82f630",color:"#60a5fa",fontSize:11,padding:9,borderRadius:6,textDecoration:"none",display:"block"}}>
                Abrir Email →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ARIA() {
  const [query, setQuery]       = useState("");
  const [leads, setLeads]       = useState([]);
  const [curQ, setCurQ]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [summary, setSummary]   = useState("");
  const [error, setError]       = useState(null);
  const [modal, setModal]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [saveStates, setSaveStates] = useState({});

  const search = useCallback(async (q) => {
    const sq = (q || query).trim();
    if (!sq || loading) return;
    setLoading(true); setLeads([]); setSummary(""); setError(null);
    setCurQ(sq); if (!q) setQuery("");
    setSaveStates({});
    setHistory(h => [sq, ...h.filter(x => x !== sq)].slice(0, 6));
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 7000,
          system: SEARCH_SYS,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: sq }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      const txt = d.content?.find(b => b.type === "text")?.text || "";
      const p = JSON.parse(txt.replace(/```json|```/g, "").trim());
      const newLeads = p.leads || [];
      setLeads(newLeads);
      setSummary(p.resumo || "");
      setLoading(false);

      // Auto-save: envia para Claude guardar via MCP
      if (newLeads.length > 0) {
        setSaving(true);
        newLeads.forEach(l => setSaveStates(s => ({ ...s, [l.nome]: "saving" })));
        sendPrompt("ARIA_SAVE_ALL:" + JSON.stringify({ leads: newLeads, pesquisa: sq }));
      }
    } catch(e) {
      setError("Erro: " + (e.message || "tenta novamente."));
      setLoading(false);
    }
  }, [query, loading]);

  // Receber confirmação de save do Claude
  // Claude irá confirmar com "ARIA_SAVED:[nome1,nome2,...]"
  // Isto é tratado pelo sistema de mensagens do claude.ai

  return (
    <div style={{background:"#060a10",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#e2e8f0",display:"flex",flexDirection:"column",minHeight:580}}>
      <style>{`textarea:focus{border-color:#f59e0b55!important}@keyframes ap{0%,100%{opacity:.2}50%{opacity:1}}`}</style>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid #1a2535",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20,color:"#f59e0b"}}>◈</span>
          <span style={{fontSize:15,fontWeight:700,letterSpacing:"0.15em",color:"#f8fafc"}}>ARIA</span>
          <span style={{fontSize:9,background:"#f59e0b10",border:"1px solid #f59e0b30",color:"#f59e0b",padding:"1px 7px",borderRadius:4}}>POST</span>
          <span style={{fontSize:8,background:"#a855f710",border:"1px solid #a855f730",color:"#a855f7",padding:"1px 6px",borderRadius:3}}>✦ VOXEL</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {saving && <span style={{fontSize:10,color:"#f59e0b",background:"#f59e0b0a",border:"1px solid #f59e0b30",padding:"3px 8px",borderRadius:4}}>⟳ A guardar no Airtable...</span>}
          {!saving && leads.length > 0 && <span style={{fontSize:13,fontWeight:700,color:"#f59e0b"}}>{leads.length} leads</span>}
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 7px #22c55e",display:"inline-block"}}/>
            <span style={{fontSize:9,color:"#22c55e",letterSpacing:"0.1em"}}>ONLINE</span>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,minHeight:500}}>
        {/* Sidebar */}
        <div style={{width:260,minWidth:240,borderRight:"1px solid #1a2535",padding:14,display:"flex",flexDirection:"column",gap:11,overflowY:"auto",background:"#080d14",flexShrink:0}}>
          <span style={{fontSize:9,letterSpacing:"0.2em",color:"#3d5166"}}>DESCREVE O TEU ICP</span>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();search();}}}
            placeholder="Ex: lojas de roupa em Lisboa sem presença digital..."
            disabled={loading}
            rows={4}
            style={{width:"100%",background:"#0a1018",border:"1px solid #1a2535",borderRadius:8,padding:"9px 11px",color:"#e2e8f0",fontSize:12,resize:"none",lineHeight:1.6,fontFamily:"inherit",outline:"none"}}
          />
          <button onClick={()=>search()} disabled={loading||!query.trim()} style={{width:"100%",padding:10,background:loading||!query.trim()?"#1a2535":"#f59e0b",color:loading||!query.trim()?"#4a5568":"#080c12",border:"none",borderRadius:8,fontSize:12,fontWeight:700,letterSpacing:"0.08em",cursor:loading||!query.trim()?"not-allowed":"pointer",fontFamily:"inherit"}}>
            {loading?"⟳ A varrer...":"PROCURAR ALVOS →"}
          </button>
          <span style={{fontSize:9,letterSpacing:"0.2em",color:"#3d5166"}}>EXEMPLOS</span>
          {EXAMPLES.map((ex,i)=>(
            <button key={i} onClick={()=>search(ex)} disabled={loading} style={{display:"flex",alignItems:"flex-start",gap:5,width:"100%",background:"transparent",border:"1px solid #1a2535",borderRadius:6,padding:"6px 8px",color:"#64748b",fontSize:10,cursor:"pointer",textAlign:"left",lineHeight:1.4,fontFamily:"inherit"}}>
              <span style={{color:"#f59e0b",flexShrink:0}}>→</span>{ex}
            </button>
          ))}
          {history.length>0&&(
            <>
              <span style={{fontSize:9,letterSpacing:"0.2em",color:"#3d5166"}}>HISTÓRICO</span>
              {history.map((h,i)=>(
                <button key={i} onClick={()=>search(h)} style={{display:"flex",justifyContent:"space-between",width:"100%",background:"none",border:"none",borderBottom:"1px solid #0f1820",color:"#4a5568",fontSize:9,textAlign:"left",cursor:"pointer",padding:"4px 0",fontFamily:"inherit"}}>
                  <span>↺ {h}</span><span style={{color:"#3d5166"}}>→</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Main */}
        <div style={{flex:1,padding:14,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
          {saving && (
            <div style={{background:"#f59e0b08",border:"1px solid #f59e0b30",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#f59e0b",display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:5,height:5,borderRadius:"50%",background:"#f59e0b",display:"inline-block",animation:`ap 1s ease-in-out ${i*0.2}s infinite`}}/>)}</div>
              Claude está a guardar os leads no Airtable automaticamente...
            </div>
          )}
          {summary && (
            <div style={{background:"#0c1621",border:"1px solid #1a2535",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#94a3b8",display:"flex",gap:7}}>
              <span style={{color:"#f59e0b",flexShrink:0}}>◎</span>{summary}
            </div>
          )}
          {error && <div style={{background:"#ef444410",border:"1px solid #ef444430",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#ef4444"}}>{error}</div>}
          {loading && (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:50,gap:14}}>
              <div style={{display:"flex",gap:5}}>
                {[0,1,2,3,4].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#f59e0b",display:"inline-block",animation:`ap 1s ease-in-out ${i*0.15}s infinite`}}/>)}
              </div>
              <span style={{fontSize:12,color:"#64748b"}}>A ARIA está a varrer a internet...</span>
              <span style={{fontSize:10,color:"#3d5166"}}>A analisar presença digital de empresas portuguesas</span>
            </div>
          )}
          {!loading && leads.length===0 && !error && (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:50,gap:10,opacity:0.3}}>
              <span style={{fontSize:48,color:"#f59e0b"}}>◈</span>
              <span style={{fontSize:15,fontWeight:700,color:"#94a3b8"}}>Prontos para a caça</span>
              <span style={{fontSize:11,color:"#4a5568",textAlign:"center",lineHeight:1.8}}>Descreve o perfil de empresa que procuras.<br/>A ARIA encontra e guarda automaticamente no Airtable.</span>
            </div>
          )}
          {leads.map((lead,i)=>(
            <LeadCard key={i} lead={lead}
              saveState={saveStates[lead.nome]||"saving"}
              onWA={()=>setModal({lead,type:"wa"})}
              onEmail={()=>setModal({lead,type:"email"})}
            />
          ))}
        </div>
      </div>

      {modal && <MsgModal lead={modal.lead} type={modal.type} onClose={()=>setModal(null)}/>}
    </div>
  );
}
