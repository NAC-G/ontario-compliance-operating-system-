--add78fe8eb355024ba9f101653a7673fc8398ce473093155e86e471217b4
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/src/index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function handleLearningDashboard() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NAC Learning \u2014 Ontario Contractor Training Academy</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  --black:#060606;--surface:#101010;--surface2:#181818;--surface3:#202020;--border:#252525;
  --green:#00FF41;--green-dim:#00cc33;--green-glow:rgba(0,255,65,0.14);--green-subtle:rgba(0,255,65,0.055);
  --amber:#F59E0B;--amber-dim:#d4870a;--amber-glow:rgba(245,158,11,0.14);--amber-subtle:rgba(245,158,11,0.055);
  --red:#ef4444;--blue:#3b82f6;--blue-subtle:rgba(59,130,246,0.08);--blue-border:rgba(59,130,246,0.25);
  --text:#e4e4e4;--text-muted:#606060;--text-dim:#909090;
  --bebas:'Bebas Neue',sans-serif;--dm:'DM Sans',sans-serif;--mono:'DM Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;background:var(--black);color:var(--text);font-family:var(--dm);overflow:hidden;}
.shell{display:grid;grid-template-rows:54px 1fr;grid-template-columns:264px 1fr;height:100vh;}
.topbar{grid-column:1/-1;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 22px;gap:14px;z-index:100;}
.sidebar{background:var(--surface);border-right:1px solid var(--border);overflow-y:auto;display:flex;flex-direction:column;}
.main{overflow-y:auto;background:var(--black);}
.logo{font-family:var(--bebas);font-size:21px;letter-spacing:2px;color:var(--green);display:flex;align-items:center;gap:8px;flex-shrink:0;}
.logo-sub{color:var(--text-muted);font-size:12px;font-family:var(--dm);font-weight:400;letter-spacing:0;}
.v3-badge{background:rgba(0,255,65,0.1);border:1px solid rgba(0,255,65,0.25);color:var(--green);font-family:var(--mono);font-size:9px;padding:3px 7px;border-radius:3px;letter-spacing:1px;flex-shrink:0;}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:12px;}
.badge-xp{background:var(--amber-subtle);border:1px solid var(--amber);color:var(--amber);font-family:var(--mono);font-size:10px;padding:3px 9px;border-radius:4px;letter-spacing:1px;}
.badge-streak{background:var(--green-subtle);border:1px solid var(--green);color:var(--green);font-family:var(--mono);font-size:10px;padding:3px 9px;border-radius:4px;letter-spacing:1px;}
.user-dot{width:30px;height:30px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-family:var(--bebas);font-size:15px;color:var(--black);cursor:pointer;flex-shrink:0;}
.sidebar-section{padding:14px 12px 6px;}
.sidebar-label{font-family:var(--mono);font-size:11px;letter-spacing:2px;color:var(--text-dim);text-transform:uppercase;padding:0 8px;margin-bottom:8px;font-weight:500;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 11px;border-radius:6px;cursor:pointer;transition:all .14s;margin-bottom:3px;border:1px solid transparent;}
.nav-item:hover{background:var(--surface2);}
.nav-item.active{background:var(--green-subtle);border-color:rgba(0,255,65,0.16);}
.nav-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.nav-info{flex:1;min-width:0;}
.nav-name{font-size:13px;font-weight:600;color:var(--text);line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nav-meta{font-family:var(--mono);font-size:10px;color:var(--text-dim);margin-top:2px;}
.prog-ring{position:relative;width:28px;height:28px;flex-shrink:0;}
.prog-ring svg{transform:rotate(-90deg);}
.prog-pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:9px;color:var(--green);font-weight:500;}
.view{display:none;padding:26px 30px 40px;}
.view.active{display:block;}
.page-title{font-family:var(--bebas);font-size:42px;letter-spacing:3px;line-height:1;}
.page-title span{color:var(--green);}
.page-sub{font-size:13px;color:var(--text-muted);margin-top:6px;max-width:640px;line-height:1.65;}
.alert{border-radius:7px;padding:11px 14px;margin-bottom:12px;font-size:12px;line-height:1.65;}
.alert-title{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;display:block;}
.alert-blue{background:var(--blue-subtle);border:1px solid var(--blue-border);color:#93c5fd;}
.alert-amber{background:var(--amber-subtle);border:1px solid rgba(245,158,11,0.25);color:#fcd34d;}
.alert-red{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.22);color:#fca5a5;}
.alert-green{background:var(--green-subtle);border:1px solid rgba(0,255,65,0.18);color:#86efac;}
.alert strong{font-weight:700;}
.stat-row{display:flex;gap:12px;margin:18px 0 26px;}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:13px 16px;flex:1;}
.stat-val{font-family:var(--bebas);font-size:28px;letter-spacing:2px;}
.stat-val.green{color:var(--green);}
.stat-val.amber{color:var(--amber);}
.stat-label{font-size:10px;color:var(--text-muted);margin-top:2px;font-family:var(--mono);letter-spacing:1px;text-transform:uppercase;}
.section-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;}
.section-title{font-family:var(--bebas);font-size:20px;letter-spacing:2px;}
.section-line{flex:1;height:1px;background:var(--border);}
.course-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(305px,1fr));gap:16px;}
.course-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:all .18s;position:relative;}
.course-card:hover{border-color:rgba(0,255,65,0.35);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,255,65,0.06);}
.card-banner{height:106px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.card-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6));}
.card-level{position:absolute;top:9px;right:9px;font-family:var(--mono);font-size:8px;letter-spacing:1px;padding:2px 6px;border-radius:3px;text-transform:uppercase;z-index:1;}
.level-beginner{background:rgba(0,255,65,0.14);color:var(--green);border:1px solid rgba(0,255,65,0.28);}
.level-intermediate{background:rgba(245,158,11,0.14);color:var(--amber);border:1px solid rgba(245,158,11,0.28);}
.level-advanced{background:rgba(239,68,68,0.14);color:var(--red);border:1px solid rgba(239,68,68,0.28);}
.audit-flag{position:absolute;top:9px;left:9px;background:rgba(59,130,246,0.18);border:1px solid rgba(59,130,246,0.38);color:#93c5fd;font-family:var(--mono);font-size:8px;padding:2px 5px;border-radius:3px;z-index:1;letter-spacing:1px;}
.lock-overlay{position:absolute;inset:0;background:rgba(6,6,6,0.7);display:flex;align-items:center;justify-content:center;z-index:2;}
.lock-overlay span{font-size:22px;}
.card-body{padding:13px 15px 15px;}
.card-title{font-family:var(--bebas);font-size:17px;letter-spacing:1.5px;line-height:1.2;margin-bottom:3px;}
.card-desc{font-size:11px;color:var(--text-muted);line-height:1.55;margin-bottom:9px;}
.card-meta{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;}
.card-meta-item{display:flex;align-items:center;gap:3px;font-family:var(--mono);font-size:9px;color:var(--text-dim);}
.card-progress-bar{background:var(--border);height:2px;border-radius:2px;margin-bottom:9px;}
.card-progress-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--green),var(--green-dim));}
.card-tags{display:flex;gap:4px;flex-wrap:wrap;}
.card-tag{font-family:var(--mono);font-size:8px;background:var(--surface2);border:1px solid var(--border);color:var(--text-muted);padding:2px 6px;border-radius:3px;}
.card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:11px;padding-top:11px;border-top:1px solid var(--border);}
.btn-start{background:var(--green);color:var(--black);font-family:var(--bebas);font-size:12px;letter-spacing:1px;border:none;padding:7px 13px;border-radius:4px;cursor:pointer;transition:all .14s;}
.btn-start:hover{background:var(--green-dim);}
.btn-continue{background:transparent;color:var(--green);font-family:var(--bebas);font-size:12px;letter-spacing:1px;border:1px solid var(--green);padding:7px 13px;border-radius:4px;cursor:pointer;transition:all .14s;}
.btn-continue:hover{background:var(--green-subtle);}
.btn-upgrade{background:var(--amber);color:var(--black);font-family:var(--bebas);font-size:12px;letter-spacing:1px;border:none;padding:7px 13px;border-radius:4px;cursor:pointer;transition:all .14s;}
.btn-upgrade:hover{background:var(--amber-dim);}
.back-btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-size:10px;color:var(--text-muted);cursor:pointer;margin-bottom:18px;transition:color .14s;}
.back-btn:hover{color:var(--green);}
.course-hero{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:22px;display:flex;gap:20px;margin-bottom:20px;position:relative;overflow:hidden;}
.course-hero::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;background:radial-gradient(circle,var(--green-glow),transparent 70%);pointer-events:none;}
.hero-emoji{font-size:52px;flex-shrink:0;line-height:1;}
.hero-info{flex:1;}
.hero-title{font-family:var(--bebas);font-size:28px;letter-spacing:2px;line-height:1;margin-bottom:5px;}
.hero-desc{font-size:12px;color:var(--text-muted);line-height:1.65;margin-bottom:12px;max-width:560px;}
.hero-stats{display:flex;gap:16px;flex-wrap:wrap;}
.hero-stat{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:10px;color:var(--text-dim);}
.hero-stat strong{color:var(--text);}
.progress-section{background:var(--surface2);border-radius:5px;padding:9px 13px;margin-top:12px;}
.progress-label{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--text-muted);margin-bottom:5px;}
.progress-bar-full{height:4px;background:var(--border);border-radius:4px;}
.progress-bar-fill{height:100%;background:linear-gradient(90deg,var(--green),var(--green-dim));border-radius:4px;}
.detail-grid{display:grid;grid-template-columns:1fr 278px;gap:16px;}
.modules-list{display:flex;flex-direction:column;gap:9px;}
.module-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.module-header{display:flex;align-items:center;gap:10px;padding:11px 13px;cursor:pointer;transition:background .14s;}
.module-header:hover{background:var(--surface2);}
.module-num{font-family:var(--bebas);font-size:22px;letter-spacing:1px;color:var(--green);width:30px;flex-shrink:0;line-height:1;}
.module-info{flex:1;}
.module-title{font-family:var(--bebas);font-size:15px;letter-spacing:1px;line-height:1.2;}
.module-meta{font-family:var(--mono);font-size:9px;color:var(--text-muted);margin-top:2px;}
.module-new{background:var(--amber);color:var(--black);font-family:var(--bebas);font-size:8px;letter-spacing:1px;padding:1px 5px;border-radius:2px;margin-left:6px;vertical-align:middle;}
.module-toggle{color:var(--text-muted);font-size:14px;transition:transform .18s;}
.module-toggle.open{transform:rotate(180deg);}
.module-lessons{border-top:1px solid var(--border);display:none;}
.module-lessons.open{display:block;}
.lesson-row{display:flex;align-items:center;gap:9px;padding:8px 13px;border-bottom:1px solid var(--border);cursor:pointer;transition:all .14s;}
.lesson-row:last-child{border-bottom:none;}
.lesson-row:hover{background:var(--surface2);}
.lesson-row.complete .lesson-num{background:var(--green);color:var(--black);}
.lesson-num{width:20px;height:20px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px;flex-shrink:0;}
.lesson-info{flex:1;}
.lesson-title{font-size:11px;font-weight:500;color:var(--text);}
.lesson-type-row{display:flex;align-items:center;gap:6px;margin-top:2px;}
.lesson-type{font-family:var(--mono);font-size:8px;padding:1px 5px;border-radius:3px;}
.type-video{background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.18);}
.type-activity{background:var(--amber-subtle);color:var(--amber);border:1px solid rgba(245,158,11,0.18);}
.type-quiz{background:rgba(168,85,247,0.1);color:#c084fc;border:1px solid rgba(168,85,247,0.18);}
.type-benchmark{background:rgba(239,68,68,0.1);color:var(--red);border:1px solid rgba(239,68,68,0.18);}
.lesson-duration{font-family:var(--mono);font-size:9px;color:var(--text-muted);}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:12px;}
.panel-header{padding:10px 13px;border-bottom:1px solid var(--border);font-family:var(--bebas);font-size:14px;letter-spacing:1px;display:flex;align-items:center;gap:7px;}
.panel-body{padding:11px 13px;}
.benchmark-item{display:flex;align-items:center;gap:9px;margin-bottom:11px;}
.benchmark-info{flex:1;}
.benchmark-name{font-size:11px;font-weight:500;}
.benchmark-sub{font-family:var(--mono);font-size:9px;color:var(--text-muted);margin-top:2px;}
.benchmark-score{font-family:var(--bebas);font-size:19px;letter-spacing:1px;}
.score-green{color:var(--green);}
.score-amber{color:var(--amber);}
.score-none{color:var(--text-muted);}
.resource-item{display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid var(--border);}
.resource-item:last-child{border-bottom:none;}
.resource-icon{width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
.res-pdf{background:rgba(239,68,68,0.09);}
.res-doc{background:rgba(0,255,65,0.09);}
.resource-name{font-size:11px;font-weight:500;}
.resource-size{font-family:var(--mono);font-size:9px;color:var(--text-muted);margin-top:1px;}
.lesson-nav{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
.crumb{font-family:var(--mono);font-size:10px;color:var(--text-muted);cursor:pointer;}
.crumb:hover{color:var(--green);}
.crumb-sep{color:var(--border);}
.video-container{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:18px;}
.video-player{width:100%;aspect-ratio:16/9;background:#000;display:flex;align-items:center;justify-content:center;}
.play-btn{width:64px;height:64px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .14s;border:none;}
.play-btn:hover{transform:scale(1.08);}
.video-title-bar{padding:10px 14px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.video-title{font-family:var(--bebas);font-size:15px;letter-spacing:1px;}
.video-meta{font-family:var(--mono);font-size:9px;color:var(--text-muted);}
.lesson-grid{display:grid;grid-template-columns:1fr 305px;gap:16px;}
.lesson-main{display:flex;flex-direction:column;gap:12px;}
.content-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px;}
.content-card-title{font-family:var(--bebas);font-size:14px;letter-spacing:1px;color:var(--green);margin-bottom:11px;display:flex;align-items:center;gap:7px;}
.content-body{font-size:12px;color:var(--text-dim);line-height:1.8;}
.content-body p{margin-bottom:9px;}
.content-body ul,.content-body ol{margin-left:16px;margin-bottom:9px;}
.content-body li{margin-bottom:4px;color:var(--text-muted);}
.content-body strong{color:var(--text);}
.ref{font-family:var(--mono);font-size:9px;color:var(--green);background:var(--green-subtle);border:1px solid rgba(0,255,65,0.14);padding:1px 5px;border-radius:3px;display:inline-block;}
.objectives-list{display:flex;flex-direction:column;gap:7px;}
.objective-item{display:flex;align-items:flex-start;gap:8px;font-size:11px;color:var(--text-dim);}
.obj-check{width:16px;height:16px;border-radius:3px;border:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px;font-size:9px;}
.obj-check.done{background:var(--green);border-color:var(--green);color:var(--black);}
.activity-card{background:var(--amber-subtle);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:13px 15px;}
.activity-header{display:flex;align-items:center;gap:7px;margin-bottom:8px;flex-wrap:wrap;}
.activity-title{font-family:var(--bebas);font-size:13px;letter-spacing:1px;color:var(--amber);}
.activity-type-tag{font-family:var(--mono);font-size:8px;color:var(--amber);background:rgba(245,158,11,0.09);border:1px solid rgba(245,158,11,0.18);padding:2px 6px;border-radius:3px;}
.activity-steps{font-size:11px;color:var(--text-muted);line-height:1.7;}
.activity-steps ol{margin-left:14px;}
.activity-steps li{margin-bottom:5px;}
.deliverable-box{background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.14);border-radius:4px;padding:8px 11px;margin-top:9px;}
.deliverable-label{font-family:var(--mono);font-size:8px;color:var(--amber);letter-spacing:1px;text-transform:uppercase;margin-bottom:3px;}
.deliverable-text{font-size:11px;color:var(--text-dim);}
.tab-row{display:flex;border-bottom:1px solid var(--border);margin-bottom:13px;}
.tab{padding:8px 13px;font-family:var(--mono);font-size:9px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;color:var(--text-muted);border-bottom:2px solid transparent;transition:all .14s;}
.tab:hover{color:var(--text);}
.tab.active{color:var(--green);border-bottom-color:var(--green);}
.tab-panel{display:none;}
.tab-panel.active{display:block;}
.quiz-q{font-size:13px;font-weight:500;color:var(--text);margin-bottom:13px;line-height:1.6;}
.quiz-options{display:flex;flex-direction:column;gap:6px;}
.quiz-option{display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border-radius:5px;border:1px solid var(--border);cursor:pointer;transition:all .14s;font-size:11px;color:var(--text-muted);}
.quiz-option:hover{border-color:var(--green);color:var(--text);background:var(--green-subtle);}
.quiz-option.selected{border-color:var(--green);color:var(--green);background:var(--green-subtle);}
.quiz-option.correct{border-color:var(--green);color:var(--green);background:var(--green-subtle);}
.quiz-option.wrong{border-color:var(--red);color:var(--red);background:rgba(239,68,68,0.05);}
.option-letter{font-family:var(--bebas);font-size:13px;letter-spacing:1px;flex-shrink:0;width:16px;}
.quiz-nav{display:flex;align-items:center;justify-content:space-between;margin-top:13px;}
.quiz-feedback{margin-top:10px;padding:9px 11px;border-radius:5px;font-size:11px;}
.quiz-counter{font-family:var(--mono);font-size:10px;color:var(--text-muted);}
.btn-primary{background:var(--green);color:var(--black);font-family:var(--bebas);font-size:13px;letter-spacing:1px;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .14s;}
.btn-primary:hover{background:var(--green-dim);}
.btn-secondary{background:transparent;color:var(--text-muted);font-family:var(--bebas);font-size:13px;letter-spacing:1px;border:1px solid var(--border);padding:8px 16px;border-radius:4px;cursor:pointer;}
.bench-ring-wrap{width:90px;height:90px;position:relative;margin:0 auto 12px;}
.bench-ring-wrap svg{transform:rotate(-90deg);}
.bench-ring-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.bench-ring-num{font-family:var(--bebas);font-size:24px;letter-spacing:1px;line-height:1;}
.bench-ring-label{font-family:var(--mono);font-size:8px;color:var(--text-muted);letter-spacing:1px;}
.bench-cats{display:flex;flex-direction:column;gap:8px;margin-top:12px;}
.bench-cat{display:flex;align-items:center;gap:8px;}
.bench-cat-name{font-size:10px;color:var(--text-muted);width:130px;flex-shrink:0;}
.bench-cat-bar{flex:1;height:3px;background:var(--border);border-radius:3px;}
.bench-cat-fill{height:100%;border-radius:3px;}
.bench-cat-score{font-family:var(--mono);font-size:9px;color:var(--text-dim);width:28px;text-align:right;}
.lesson-sidebar{display:flex;flex-direction:column;gap:12px;}
.next-box{background:var(--green-subtle);border:1px solid rgba(0,255,65,0.18);border-radius:7px;padding:11px;}
.next-label{font-family:var(--mono);font-size:8px;color:var(--green);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
.next-title{font-size:11px;font-weight:600;color:var(--text);margin-bottom:7px;}
.note-area{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:4px;padding:8px;color:var(--text-muted);font-family:var(--dm);font-size:11px;resize:vertical;min-height:80px;}
.note-area:focus{outline:none;border-color:var(--green);}
.reg-chip{display:inline-block;font-family:var(--mono);font-size:8px;background:var(--green-subtle);border:1px solid rgba(0,255,65,0.18);color:var(--green);padding:2px 6px;border-radius:3px;margin:2px;}
.mlitsd-chip{font-family:var(--mono);font-size:8px;color:#93c5fd;background:var(--blue-subtle);border:1px solid var(--blue-border);padding:2px 6px;border-radius:3px;display:inline-block;}
.cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:13px;margin-top:18px;}
.cert-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:17px;text-align:center;position:relative;}
.cert-card.earned{border-color:var(--amber);box-shadow:0 0 18px rgba(245,158,11,0.07);}
.cert-card.locked{opacity:0.44;}
.cert-emoji{font-size:36px;margin-bottom:9px;}
.cert-title{font-family:var(--bebas);font-size:16px;letter-spacing:1.5px;margin-bottom:5px;line-height:1.2;}
.cert-date{font-family:var(--mono);font-size:9px;color:var(--amber);margin-bottom:8px;}
.cert-reg{font-family:var(--mono);font-size:8px;color:var(--text-muted);margin-bottom:8px;}
.cert-status{font-family:var(--mono);font-size:9px;color:var(--text-muted);}
.cert-ribbon{position:absolute;top:8px;right:8px;background:var(--amber);color:var(--black);font-family:var(--bebas);font-size:8px;letter-spacing:1px;padding:2px 5px;border-radius:2px;}
.cert-dl-btn{background:var(--amber-subtle);border:1px solid rgba(245,158,11,0.25);color:var(--amber);font-family:var(--bebas);font-size:11px;letter-spacing:1px;padding:6px 12px;border-radius:4px;cursor:pointer;margin-top:8px;width:100%;}
.pricing-hero{text-align:center;padding:20px 0 36px;}
.pricing-hero .page-title{font-size:48px;}
.pricing-hero .page-sub{margin:8px auto 0;text-align:center;}
.pricing-toggle{display:flex;align-items:center;justify-content:center;gap:12px;margin:20px 0 32px;}
.toggle-label{font-family:var(--mono);font-size:11px;color:var(--text-muted);}
.toggle-label.active{color:var(--text);}
.toggle-track{width:44px;height:24px;background:var(--border);border-radius:12px;cursor:pointer;position:relative;transition:background .2s;}
.toggle-track.on{background:var(--green);}
.toggle-thumb{width:18px;height:18px;background:var(--text);border-radius:50%;position:absolute;top:3px;left:3px;transition:left .2s;}
.toggle-track.on .toggle-thumb{left:23px;background:var(--black);}
.save-badge{background:var(--green-subtle);border:1px solid rgba(0,255,65,0.2);color:var(--green);font-family:var(--mono);font-size:9px;padding:3px 8px;border-radius:3px;letter-spacing:1px;}
.plans-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;max-width:1060px;margin:0 auto;}
.plan-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px 16px;position:relative;transition:all .18s;}
.plan-card:hover{border-color:rgba(0,255,65,0.2);transform:translateY(-2px);}
.plan-card.featured{border-color:var(--green);box-shadow:0 0 30px rgba(0,255,65,0.09);}
.plan-card.featured::before{content:'MOST POPULAR';position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--green);color:var(--black);font-family:var(--bebas);font-size:9px;letter-spacing:1px;padding:3px 10px;border-radius:0 0 5px 5px;}
.plan-name{font-family:var(--bebas);font-size:20px;letter-spacing:2px;color:var(--text);margin-bottom:4px;margin-top:4px;}
.plan-tagline{font-size:10px;color:var(--text-muted);margin-bottom:14px;line-height:1.5;}
.plan-price{margin-bottom:14px;}
.plan-amount{font-family:var(--bebas);font-size:36px;letter-spacing:1px;color:var(--green);line-height:1;}
.plan-amount.amber{color:var(--amber);}
.plan-amount.gray{color:var(--text-muted);}
.plan-per{font-family:var(--mono);font-size:9px;color:var(--text-muted);margin-top:1px;}
.plan-annual{font-family:var(--mono);font-size:9px;color:var(--green);margin-top:3px;}
.plan-annual.amber{color:var(--amber);}
.plan-divider{height:1px;background:var(--border);margin:12px 0;}
.plan-features{display:flex;flex-direction:column;gap:7px;margin-bottom:16px;}
.plan-feature{display:flex;align-items:flex-start;gap:7px;font-size:11px;color:var(--text-muted);line-height:1.4;}
.feat-check{flex-shrink:0;margin-top:1px;font-size:10px;}
.feat-check.green{color:var(--green);}
.feat-check.amber{color:var(--amber);}
.feat-check.gray{color:var(--border);}
.plan-cta{width:100%;padding:9px;border-radius:5px;font-family:var(--bebas);font-size:14px;letter-spacing:1px;cursor:pointer;border:none;transition:all .14s;}
.cta-green{background:var(--green);color:var(--black);}
.cta-green:hover{background:var(--green-dim);}
.cta-amber{background:var(--amber);color:var(--black);}
.cta-amber:hover{background:var(--amber-dim);}
.cta-outline{background:transparent;color:var(--green);border:1px solid var(--green) !important;}
.cta-outline:hover{background:var(--green-subtle);}
.cta-gray{background:var(--surface2);color:var(--text);border:1px solid var(--border) !important;}
.cta-gray:hover{border-color:var(--text-muted) !important;}
.add-ons-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:13px;max-width:900px;margin:0 auto;}
.addon-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px;display:flex;gap:12px;align-items:flex-start;}
.addon-icon{font-size:22px;flex-shrink:0;}
.addon-info{flex:1;}
.addon-name{font-family:var(--bebas);font-size:15px;letter-spacing:1px;margin-bottom:3px;}
.addon-desc{font-size:11px;color:var(--text-muted);line-height:1.5;margin-bottom:8px;}
.addon-price{font-family:var(--bebas);font-size:18px;letter-spacing:1px;color:var(--amber);}
.compare-table{width:100%;border-collapse:collapse;margin:0 auto;max-width:900px;}
.compare-table th{font-family:var(--bebas);font-size:13px;letter-spacing:1px;padding:10px 12px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-muted);}
.compare-table th:first-child{color:var(--text);}
.compare-table td{padding:9px 12px;border-bottom:1px solid var(--border);font-size:11px;color:var(--text-muted);}
.compare-table td:first-child{font-weight:500;color:var(--text);}
.compare-table tr:last-child td{border-bottom:none;}
.check-yes{color:var(--green);font-size:13px;}
.check-partial{color:var(--amber);font-size:11px;}
.check-no{color:var(--border);}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.view.active{animation:fadeIn .2s ease}
@media(max-width:900px){.shell{grid-template-columns:1fr;}.sidebar{display:none;}.detail-grid,.lesson-grid{grid-template-columns:1fr;}.plans-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));}}
</style>
</head>
<body>
<div class="shell">
<div class="topbar">
  <div class="logo">\u26A1 NAC <span class="logo-sub">Learning Academy</span></div>
  <div class="v3-badge">\u2713 V3 \xB7 MLITSD VERIFIED \xB7 APR 2026</div>
  <div class="topbar-right">
    <div class="badge-xp">\u26A1 1,240 XP</div>
    <div class="badge-streak">\u{1F525} 7 DAY</div>
    <a href="/dashboard" style="font-family:var(--mono);font-size:10px;color:var(--text-muted);text-decoration:none;padding:5px 10px;border:1px solid var(--border);border-radius:4px;">\u2190 Admin Dashboard</a>
    <div class="user-dot">J</div>
  </div>
</div>
<div class="sidebar">
  <div class="sidebar-section">
    <div class="sidebar-label">In Progress</div>
    <div id="sidebarCourses"></div>
  </div>
  <div class="sidebar-section">
    <div class="sidebar-label">Platform</div>
    <div class="nav-item active" onclick="showView('catalog')">
      <div class="nav-icon" style="background:var(--surface2)">\u{1F4CB}</div>
      <div class="nav-info"><div class="nav-name">Course Catalog</div><div class="nav-meta">6 courses available</div></div>
    </div>
    <div class="nav-item" onclick="showView('certs')">
      <div class="nav-icon" style="background:var(--surface2)">\u{1F4CB}</div>
      <div class="nav-info"><div class="nav-name">Certifications</div><div class="nav-meta">2 earned</div></div>
    </div>
    <div class="nav-item" onclick="showView('pricing')">
      <div class="nav-icon" style="background:var(--surface2)">\u{1F4CB}</div>
      <div class="nav-info"><div class="nav-name">Plans & Pricing</div><div class="nav-meta">Upgrade your plan</div></div>
    </div>
  </div>
  <div style="padding:12px;margin-top:auto">
    <div style="background:var(--amber-subtle);border:1px solid rgba(245,158,11,0.2);border-radius:6px;padding:10px 12px;">
      <div style="font-family:var(--mono);font-size:11px;color:var(--amber);letter-spacing:1px;margin-bottom:5px">CURRENT PLAN</div>
      <div style="font-family:var(--bebas);font-size:18px;letter-spacing:1px;color:var(--text)">PROFESSIONAL</div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--text-dim);margin-top:3px">Renews Jun 1, 2026</div>
      <button class="btn-upgrade" style="width:100%;margin-top:8px;font-size:11px" onclick="showView('pricing')">Upgrade to Team \u2192</button>
    </div>
  </div>
</div>
<div class="main">

<div class="view active" id="view-catalog">
  <div class="page-title">COURSE <span>LIBRARY</span></div>
  <div class="page-sub">Ontario contractor compliance training \u2014 every lesson, activity, and quiz referenced to current MLITSD legislation. All content verified April 2026.</div>
  <div class="alert alert-blue" style="margin-top:12px;max-width:750px">
    <span class="alert-title">\u2713 V3 REGULATORY AUDIT COMPLETE \u2014 APRIL 2026 \u2014 21 TOTAL CORRECTIONS APPLIED</span>
    O. Reg. 420/21 incident reporting citations; three-tier reporting timelines; WSIB Form 7 obligation; WHMIS Dec 2025 HPR amendments (GHS 7th ed.); WAH practical component and site-specific training requirements; WAH construction-only scope; no-grace-period expiry; policy JHSC (300+); O. Reg. 297/13 self-employed exemption; 3-year record retention. All content verified against ontario.ca/laws.
  </div>
  <div class="stat-row">
    <div class="stat-card"><div class="stat-val green">6</div><div class="stat-label">Courses</div></div>
    <div class="stat-card"><div class="stat-val green">44</div><div class="stat-label">Modules</div></div>
    <div class="stat-card"><div class="stat-val amber">134</div><div class="stat-label">Hours</div></div>
    <div class="stat-card"><div class="stat-val amber">21</div><div class="stat-label">Audit Fixes</div></div>
  </div>
  <div class="section-header"><div class="section-title">ALL COURSES</div><div class="section-line"></div></div>
  <div class="course-grid" id="catalogGrid"></div>
</div>

<div class="view" id="view-course"><div id="courseDetailContent"></div></div>
<div class="view" id="view-lesson"><div id="lessonContent"></div></div>

<div class="view" id="view-certs">
  <div class="page-title">MY <span>CERTIFICATIONS</span></div>
  <div class="page-sub">Complete all modules and pass benchmark assessments to earn your NAC certificate. Each certificate references its governing Ontario regulation \u2014 defensible at MLITSD inspection.</div>
  <div class="cert-grid" id="certGrid"></div>
</div>

<div class="view" id="view-pricing">
  <div class="pricing-hero">
    <div class="page-title">PLANS & <span>PRICING</span></div>
    <div class="page-sub">Ontario's most regulatory-accurate contractor compliance training. Every lesson, quiz, and certificate verified against current MLITSD legislation. No guesswork. No liability.</div>
  </div>
  <div class="pricing-toggle">
    <span class="toggle-label active" id="toggleMonthly">Monthly</span>
    <div class="toggle-track" id="billingToggle" onclick="toggleBilling()"><div class="toggle-thumb"></div></div>
    <span class="toggle-label" id="toggleAnnual">Annual</span>
    <span class="save-badge" id="saveBadge" style="display:none">SAVE UP TO 27%</span>
  </div>
  <div class="plans-grid" id="plansGrid"></div>
  <div style="max-width:1060px;margin:40px auto 0">
    <div class="section-header"><div class="section-title">ADD-ONS</div><div class="section-line"></div></div>
    <div class="add-ons-grid" id="addOnsGrid"></div>
    <div style="margin-top:36px">
      <div class="section-header"><div class="section-title">PLAN COMPARISON</div><div class="section-line"></div></div>
      <table class="compare-table" id="compareTable"></table>
    </div>
    <div class="alert alert-green" style="margin-top:24px;text-align:center">
      <strong>All plans include a 14-day free trial.</strong> No credit card required. Cancel any time. Content updates included for the life of your subscription \u2014 regulations change, your training stays current.
    </div>
  </div>
</div>

</div>
</div>

<script>
const COURSES = [
{
  id:'ocos1',emoji:'\u{1F6E1}\uFE0F',color:'#00FF41',banner:'linear-gradient(135deg,#081408,#021002)',
  title:'Ontario Contractor Compliance Foundations',
  desc:'OHSA duties, mandatory O.Reg 297/13 awareness training, incident reporting timelines under O.Reg 420/21, WSIB Form 7, JHSC/HSR thresholds, and Working for Workers 2024 amendments.',
  level:'beginner',hours:'26h',lessons:29,cert:true,progress:45,auditUpdated:true,
  tags:['OHSA','O.Reg 297/13','O.Reg 420/21','JHSC','HSR','MLITSD'],
  modules:[
    {title:'Ontario Workplace Law Essentials',isNew:false,lessons:[
      {title:'Introduction to the OHSA \u2014 Parties, Duties & Scope',type:'video',duration:'18 min'},
      {title:'Rights & Responsibilities: Employer (s.25), Supervisor (s.27), Worker (s.28)',type:'video',duration:'22 min'},
      {title:'The MLITSD \u2014 Inspector Powers, Stop-Work Orders & Penalties',type:'video',duration:'16 min'},
      {title:'Working for Workers Acts Five & Six \u2014 2024 OHSA Amendments',type:'video',duration:'14 min'},
      {title:'Activity: OHSA Party & Section Mapping',type:'activity',duration:'30 min'},
      {title:'Module 1 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Hazard Identification & Control',isNew:false,lessons:[
      {title:'Hazard Recognition Framework \u2014 Anticipate, Identify, Evaluate, Control',type:'video',duration:'20 min'},
      {title:'Creating Your Hazard Register',type:'video',duration:'22 min'},
      {title:'Risk Rating Matrix & Hierarchy of Controls',type:'video',duration:'18 min'},
      {title:'Activity: Site Walkthrough Checklist',type:'activity',duration:'40 min'},
      {title:'Module 2 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Required Documentation & Written Policies',isNew:false,lessons:[
      {title:'H&S Policy \u2014 Written Requirement, Content & Annual Review (s.25)',type:'video',duration:'18 min'},
      {title:'Safe Work Procedures (SWPs) \u2014 Writing & Maintaining Yours',type:'video',duration:'26 min'},
      {title:'Incident Investigation & Three-Tier Reporting Under O.Reg 420/21',type:'video',duration:'22 min'},
      {title:'WSIB Form 7 \u2014 Separate Obligation, 3-Business-Day Deadline',type:'video',duration:'14 min'},
      {title:'Record Retention \u2014 3-Year Minimum Under O.Reg 420/21 s.6',type:'video',duration:'10 min'},
      {title:'Activity: Draft Your H&S Policy & SWP',type:'activity',duration:'55 min'},
      {title:'Module 3 Benchmark',type:'benchmark',duration:'25 min'}
    ]},
    {title:'O. Reg. 297/13 \u2014 Mandatory Awareness Training',isNew:true,lessons:[
      {title:'What Is O.Reg 297/13, Who Must Comply & Self-Employed Exemption',type:'video',duration:'16 min'},
      {title:'Worker Awareness Training \u2014 Required Content & "As Soon As Practicable"',type:'video',duration:'18 min'},
      {title:'Supervisor Awareness Training \u2014 Required Content & 1-Week Deadline',type:'video',duration:'16 min'},
      {title:'Training Records \u2014 What to Keep, How Long, Proof of Exemption',type:'video',duration:'14 min'},
      {title:'Activity: Build Your O.Reg 297/13 Training Record System',type:'activity',duration:'30 min'},
      {title:'Module 4 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'JHSC, HSR & Worker Participation \u2014 Full Threshold Ladder',isNew:false,lessons:[
      {title:'1\u20135 Workers / 6\u201319 Workers (HSR) / 20\u201349 / 50+ / 300+ (Policy JHSC)',type:'video',duration:'20 min'},
      {title:'Health & Safety Representative (HSR) \u2014 Rights, Duties & Powers',type:'video',duration:'16 min'},
      {title:'JHSC Composition, Certified Members & Quarterly Inspections',type:'video',duration:'20 min'},
      {title:'JHSC Certification: Part 1, Part 2, 75% Pass, 3-Year Refresher',type:'video',duration:'18 min'},
      {title:'Construction Project JHSC Exemption \u2014 Under 3 Months',type:'video',duration:'12 min'},
      {title:'Virtual JHSC Meetings \u2014 Working for Workers Five Act 2024',type:'video',duration:'10 min'},
      {title:'Activity: JHSC Meeting Minutes & Inspection Record Template',type:'activity',duration:'30 min'},
      {title:'Module 5 Benchmark',type:'benchmark',duration:'25 min'}
    ]}
  ],
  benchmarks:[
    {name:'OHSA Sections & Duties',score:87,max:100},
    {name:'O.Reg 297/13 Compliance',score:null,max:100},
    {name:'Incident Reporting (O.Reg 420/21)',score:null,max:100},
    {name:'JHSC / HSR Thresholds',score:null,max:100},
    {name:'Documentation',score:72,max:100}
  ],
  resources:[
    {name:'OHSA \u2014 Full Act (ontario.ca)',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/statute/90o01'},
    {name:'O.Reg 297/13 \u2014 Awareness Training',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/130297'},
    {name:'O.Reg 420/21 \u2014 Incident Reporting',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/210420'},
    {name:'WSIB Form 7 \u2014 Employer Report of Injury',type:'doc',size:'WSIB',url:'https://www.wsib.ca/en/form7'},
    {name:'JHSC Guide \u2014 ontario.ca',type:'pdf',size:'Gov',url:'https://www.ontario.ca/document/guide-occupational-health-and-safety-act/part-ii-joint-health-and-safety-committees-and-representatives'},
    {name:'WSPS \u2014 H&S Training Resources',type:'doc',size:'WSPS',url:'https://www.wsps.ca/resource-hub/health-and-safety-tips-videos'}
  ]
},
{
  id:'elec1',emoji:'\u26A1',color:'#F59E0B',banner:'linear-gradient(135deg,#141000,#0a0800)',
  title:'Electrical Safety for Ontario Contractors',
  desc:'OESC, ESA permit requirements, LOTO under OHSA s.25 and O.Reg 851, arc flash protection (CSA Z462), and contractor responsibilities near energized equipment.',
  level:'intermediate',hours:'18h',lessons:20,cert:true,progress:10,auditUpdated:false,
  tags:['OESC','ESA','LOTO','O.Reg 851','Arc Flash','CSA Z462'],
  modules:[
    {title:'Ontario Electrical Safety Code & ESA',isNew:false,lessons:[
      {title:'The OESC \u2014 What Contractors Must Know',type:'video',duration:'20 min'},
      {title:'ESA Permit Requirements & Notification Obligations',type:'video',duration:'18 min'},
      {title:'Activity: ESA Permit Scenario Walkthrough',type:'activity',duration:'38 min'},
      {title:'Module 1 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'LOTO \u2014 O.Reg 851 s.75\u201376 & OHSA s.25',isNew:false,lessons:[
      {title:'LOTO Legislation: OHSA s.25(2)(h) & O.Reg 851 s.75\u201376',type:'video',duration:'18 min'},
      {title:'Writing an Effective LOTO Procedure',type:'video',duration:'24 min'},
      {title:'The 3-Step Verification Test for Zero Energy State',type:'video',duration:'14 min'},
      {title:'Activity: LOTO Procedure for 3 Scenarios',type:'activity',duration:'45 min'},
      {title:'Module 2 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Arc Flash & PPE Selection \u2014 CSA Z462',isNew:false,lessons:[
      {title:'Understanding Arc Flash Hazards & Incident Energy',type:'video',duration:'22 min'},
      {title:'Arc Flash Boundary & PPE Selection per CSA Z462',type:'video',duration:'20 min'},
      {title:'Activity: PPE Selector for Common Contractor Tasks',type:'activity',duration:'30 min'},
      {title:'Module 3 Benchmark',type:'benchmark',duration:'20 min'}
    ]}
  ],
  benchmarks:[{name:'OESC & ESA',score:91,max:100},{name:'LOTO Compliance',score:null,max:100},{name:'Arc Flash PPE',score:null,max:100}],
  resources:[
    {name:'O.Reg 851 \u2014 Industrial Establishments',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/900851'},
    {name:'ESA \u2014 Electrical Safety Authority',type:'doc',size:'ESA',url:'https://esasafe.com/'},
    {name:'CSA Z462 \u2014 Arc Flash Standard Overview',type:'pdf',size:'CSA',url:'https://www.csagroup.org/store/product/CSA%20Z462:24/'},
    {name:'ESFI \u2014 Lockout/Tagout Resources',type:'pdf',size:'ESFI',url:'https://www.esfi.org/lockout-tagout-video-short/'}
  ]
},
{
  id:'whmis',emoji:'\u2623\uFE0F',color:'#a855f7',banner:'linear-gradient(135deg,#0e001a,#080010)',
  title:'WHMIS \u2014 Ontario Reg. 860 & Dec 2025 HPR Update',
  desc:'WHMIS under Ontario Reg. 860, GHS alignment, all 16 SDS sections, and the December 2025 Hazardous Products Regulations (HPR) amendments.',
  level:'beginner',hours:'15h',lessons:17,cert:true,progress:100,auditUpdated:true,
  tags:['Reg.860','GHS 7th Ed','HPR 2025','SDS','Hazardous Materials'],
  modules:[
    {title:'WHMIS Fundamentals \u2014 Reg. 860 & GHS',isNew:false,lessons:[
      {title:'WHMIS Under Ontario Reg. 860 \u2014 Employer Obligations',type:'video',duration:'16 min'},
      {title:'GHS Hazard Classes \u2014 Including Dec 2025 HPR Amendments',type:'video',duration:'24 min'},
      {title:'New for 2025: Chemicals Under Pressure & Flammable Gases 1A/1B',type:'video',duration:'16 min'},
      {title:'Activity: Classify These 10 Products Under Updated HPR',type:'activity',duration:'30 min'},
      {title:'Module 1 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Safety Data Sheets \u2014 All 16 Sections (Updated 2025)',isNew:false,lessons:[
      {title:'Reading an SDS: All 16 Sections & Updated Content Requirements',type:'video',duration:'30 min'},
      {title:'SDS Management, Accessibility & MLITSD Inspection Requirements',type:'video',duration:'16 min'},
      {title:'Activity: Analyze an Updated 2025-Compliant SDS',type:'activity',duration:'42 min'},
      {title:'Worker Retraining Requirements After HPR Amendment',type:'video',duration:'14 min'},
      {title:'Module 2 Benchmark',type:'benchmark',duration:'20 min'}
    ]}
  ],
  benchmarks:[{name:'GHS & HPR 2025 Classification',score:95,max:100},{name:'SDS Interpretation',score:88,max:100},{name:'Label Requirements',score:92,max:100}],
  resources:[
    {name:'Ontario Reg. 860 \u2014 WHMIS',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/900860'},
    {name:'CCOHS \u2014 WHMIS Training Guide',type:'doc',size:'CCOHS',url:'https://www.ccohs.ca/oshanswers/chemicals/whmis_ghs/general.html'},
    {name:'WSPS \u2014 How to Read an SDS',type:'pdf',size:'WSPS',url:'https://www.wsps.ca/resource-hub/guides/how-to-read-a-whmis-safety-data-sheet'},
    {name:'Health Canada \u2014 HPR Amendments',type:'pdf',size:'Gov',url:'https://www.canada.ca/en/health-canada/services/chemical-substances/hazardous-products-act-regulations.html'}
  ]
},
{
  id:'wah',emoji:'\u{1FA9C}',color:'#ef4444',banner:'linear-gradient(135deg,#180000,#0a0000)',
  title:'Working at Heights \u2014 O.Reg 213/91 & O.Reg 297/13',
  desc:'The 3-metre trigger, CPO-approved program requirements (theory \u22653h + practical \u22653.5h + 75% pass), site-specific supplement, 3-year validity with no grace period, and the April 2024 program standard update.',
  level:'intermediate',hours:'16h',lessons:18,cert:true,progress:0,auditUpdated:true,
  tags:['O.Reg 213/91','O.Reg 297/13','3m Trigger','CPO Approved','Fall Protection'],
  modules:[
    {title:'WAH Law, Triggers, Scope & 2024 Standard Update',isNew:true,lessons:[
      {title:'The 3-Metre Trigger \u2014 When Fall Protection Becomes Mandatory',type:'video',duration:'16 min'},
      {title:'O.Reg 213/91 s.26.1\u201326.9 \u2014 Fall Protection Requirements Hierarchy',type:'video',duration:'20 min'},
      {title:'O.Reg 297/13 \u2014 WAH Training Requirements & CPO Approval',type:'video',duration:'16 min'},
      {title:'WAH Applies to Construction Only \u2014 Industrial Workers Use Reg.851',type:'video',duration:'12 min'},
      {title:'April 2024 Program Standard \u2014 Ladders, Skylights, Damaged Equipment',type:'video',duration:'14 min'},
      {title:'Activity: Identify WAH Trigger Scenarios on a Jobsite',type:'activity',duration:'30 min'},
      {title:'Module 1 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'CPO-Approved Program \u2014 What It Must Include',isNew:true,lessons:[
      {title:'Theory Module \u2014 Minimum 3 Hours, Content Requirements',type:'video',duration:'18 min'},
      {title:'Practical Module \u2014 Minimum 3.5 Hours, Hands-On Evaluation Required',type:'video',duration:'16 min'},
      {title:'75% Written Test Pass + Satisfactory Hands-On Demonstration',type:'video',duration:'12 min'},
      {title:'3-Year Validity \u2014 No Grace Period After Expiry',type:'video',duration:'10 min'},
      {title:'Site-Specific Training Supplement \u2014 Employer Obligation Beyond CPO Training',type:'video',duration:'14 min'},
      {title:'Verifying Worker Certification via MLITSD SkillsPass System',type:'video',duration:'10 min'},
      {title:'Module 2 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Fall Protection Plans, PFAS & Equipment \u2014 2024 Standard',isNew:false,lessons:[
      {title:'Fall Protection Plan \u2014 Required Contents (O.Reg 213/91)',type:'video',duration:'22 min'},
      {title:'Harness Inspection & Donning \u2014 Damaged Equipment Protocol (2024)',type:'video',duration:'24 min'},
      {title:'Anchor Points \u2014 Selection, Load Calculations & Types',type:'video',duration:'20 min'},
      {title:'Ladders & Skylight Hazards \u2014 2024 Updated Content',type:'video',duration:'18 min'},
      {title:'Activity: Write a Fall Protection Plan + Pre-Use Inspection',type:'activity',duration:'55 min'},
      {title:'Module 3 Benchmark',type:'benchmark',duration:'20 min'}
    ]}
  ],
  benchmarks:[{name:'WAH Legislation & Triggers',score:null,max:100},{name:'CPO Program Requirements',score:null,max:100},{name:'Equipment & 2024 Standard',score:null,max:100}],
  resources:[
    {name:'O.Reg 213/91 \u2014 Construction Projects',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/910213'},
    {name:'ontario.ca \u2014 Working at Heights Training',type:'doc',size:'Gov',url:'https://www.ontario.ca/page/training-working-heights'},
    {name:'IHSA \u2014 Fall Prevention Resources',type:'pdf',size:'IHSA',url:'https://www.ihsa.ca/Topics-Hazards/Fall-Prevention-Working-at-Heights.aspx'},
    {name:'WSPS \u2014 Preventing Falls Video',type:'pdf',size:'WSPS',url:'https://www.wsps.ca/resource-hub/health-and-safety-tips-videos'}
  ]
},
{
  id:'newhire',emoji:'\u{1F9D1}\u200D\u{1F527}',color:'#00FF41',banner:'linear-gradient(135deg,#001806,#000e04)',
  title:'New Hire Compliance Onboarding System',
  desc:'Day 1 rights under OHSA, mandatory O.Reg 297/13 worker awareness training (as soon as practicable), emergency procedures, PPE, incident reporting awareness, and WSIB Form 7 obligations.',
  level:'beginner',hours:'10h',lessons:14,cert:false,progress:80,auditUpdated:false,
  tags:['O.Reg 297/13','New Hire','OHSA','Emergency','PPE'],
  modules:[
    {title:'Day 1 \u2014 Rights, Awareness Training & Emergency',isNew:false,lessons:[
      {title:'Your Rights Under OHSA \u2014 What Every Worker Must Know',type:'video',duration:'14 min'},
      {title:'O.Reg 297/13 Worker Awareness Training \u2014 Day 1 Mandatory',type:'video',duration:'18 min'},
      {title:'Emergency Procedures, Muster Points & Right to Refuse',type:'video',duration:'10 min'},
      {title:'PPE Selection, Care & Your Responsibility Under s.28',type:'video',duration:'14 min'}
    ]},
    {title:'Site Rules, Reporting & Documentation',isNew:false,lessons:[
      {title:'Site-Specific Safety Rules & Supervisor Obligations',type:'video',duration:'12 min'},
      {title:'Incident Reporting \u2014 Timelines, Who to Tell & WSIB Form 7',type:'video',duration:'16 min'},
      {title:'Activity: Scenario \u2014 What Would You Do?',type:'activity',duration:'20 min'},
      {title:'Onboarding Completion Benchmark',type:'benchmark',duration:'25 min'}
    ]}
  ],
  benchmarks:[{name:'Rights & s.28 Duties',score:100,max:100},{name:'O.Reg 297/13 Awareness',score:96,max:100},{name:'Reporting & Documentation',score:null,max:100}],
  resources:[
    {name:'ontario.ca \u2014 Workplace Health and Safety',type:'pdf',size:'Gov',url:'https://www.ontario.ca/page/workplace-health-and-safety'},
    {name:'O.Reg 297/13 \u2014 Worker/Supervisor Awareness',type:'doc',size:'Gov',url:'https://www.ontario.ca/laws/regulation/130297'},
    {name:'CCOHS \u2014 Three Rights of Workers',type:'pdf',size:'CCOHS',url:'https://www.ccohs.ca/oshanswers/legisl/legislation/three_rights.html'},
    {name:'WSPS \u2014 New Worker Safety Tips',type:'pdf',size:'WSPS',url:'https://www.wsps.ca/resource-hub/vulnerable-workers'}
  ]
},
{
  id:'fleet',emoji:'\u{1F69B}',color:'#F59E0B',banner:'linear-gradient(135deg,#181000,#0c0800)',
  title:'Fleet Safety & Compliance \u2014 Ontario HTA',
  desc:'Highway Traffic Act, CVOR management, pre-trip inspections under O.Reg 199/07, driver abstract reviews, and Hours of Service under O.Reg 555/06.',
  level:'advanced',hours:'20h',lessons:22,cert:true,progress:0,auditUpdated:false,
  tags:['HTA','CVOR','O.Reg 199/07','O.Reg 555/06','Fleet'],
  modules:[
    {title:'Ontario Fleet Law & CVOR',isNew:false,lessons:[
      {title:'Highway Traffic Act \u2014 Fleet Obligations for Contractors',type:'video',duration:'22 min'},
      {title:'CVOR: Score Thresholds, Risk Ratings & MTO Consequences',type:'video',duration:'18 min'},
      {title:'Activity: Interpret a CVOR Abstract',type:'activity',duration:'38 min'},
      {title:'Module 1 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Pre-Trip Inspections \u2014 O.Reg 199/07',isNew:false,lessons:[
      {title:'O.Reg 199/07 \u2014 Daily Inspection Requirements',type:'video',duration:'20 min'},
      {title:'Writing a Compliant Inspection Schedule',type:'video',duration:'16 min'},
      {title:'Activity: Complete a Pre-Trip Inspection Form',type:'activity',duration:'30 min'},
      {title:'Module 2 Benchmark',type:'benchmark',duration:'20 min'}
    ]},
    {title:'Hours of Service \u2014 O.Reg 555/06',isNew:false,lessons:[
      {title:'HOS Rules for Ontario Contractors',type:'video',duration:'22 min'},
      {title:'ELD Requirements & Exemptions',type:'video',duration:'18 min'},
      {title:'Activity: HOS Violation Scenarios',type:'activity',duration:'35 min'},
      {title:'Module 3 Benchmark',type:'benchmark',duration:'20 min'}
    ]}
  ],
  benchmarks:[{name:'HTA & CVOR',score:null,max:100},{name:'Pre-Trip Inspections',score:null,max:100},{name:'Hours of Service',score:null,max:100}],
  resources:[
    {name:'ontario.ca \u2014 CVOR Program',type:'pdf',size:'Gov',url:'https://www.ontario.ca/page/commercial-vehicle-operators-registration-cvor'},
    {name:'ontario.ca \u2014 Commercial Vehicle Safety Videos',type:'doc',size:'Gov',url:'https://www.ontario.ca/document/commercial-vehicle-safety-interactive-videos'},
    {name:'O.Reg 199/07 \u2014 Daily Inspections',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/070199'},
    {name:'O.Reg 555/06 \u2014 Hours of Service',type:'pdf',size:'Gov',url:'https://www.ontario.ca/laws/regulation/060555'}
  ]
}
];

const PLANS = [
  {name:'FREE',tagline:'Try before you commit',monthly:0,annual:0,featured:false,cta:'cta-gray',ctaText:'Current Plan',features:['1 free course (New Hire Onboarding)','Basic quizzes','No certificate','Community forum access'],checks:'green,green,gray,green'},
  {name:'STARTER',tagline:'Solo contractor essentials',monthly:29,annual:249,featured:false,cta:'cta-outline',ctaText:'Start Free Trial',features:['2 courses','All quizzes & benchmarks','1 certificate','Email support'],checks:'green,green,green,green'},
  {name:'PROFESSIONAL',tagline:'Full compliance coverage',monthly:59,annual:499,featured:true,cta:'cta-green',ctaText:'Start Free Trial',features:['All 6 courses','All quizzes & benchmarks','All certificates','Priority support','Downloadable resources'],checks:'green,green,green,green,green'},
  {name:'TEAM',tagline:'Up to 10 seats',monthly:149,annual:1249,featured:false,cta:'cta-amber',ctaText:'Contact Sales',features:['Everything in Professional','10 team seats','Admin dashboard','Progress tracking','Bulk certificates'],checks:'green,green,green,green,green'},
  {name:'ENTERPRISE',tagline:'Unlimited seats + custom',monthly:null,annual:null,featured:false,cta:'cta-gray',ctaText:'Contact Sales',features:['Unlimited seats','Custom branding','API access','Dedicated support','Custom content'],checks:'green,green,green,green,green'}
];

const ADDONS = [
  {icon:'\u{1F4CB}',name:'AUDIT PREP KIT',desc:'Complete MLITSD inspection preparation package with checklists, mock audit, and remediation templates.',price:'$97'},
  {icon:'\u{1F393}',name:'JHSC CERTIFICATION PREP',desc:'Part 1 & Part 2 certification preparation with practice exams and study guides.',price:'$149'},
  {icon:'\u{1F4C4}',name:'POLICY TEMPLATE BUNDLE',desc:'20+ ready-to-use H&S policy templates customized for Ontario contractors.',price:'$79'}
];

const COMPARE = [
  ['Courses available','1','2','All 6','All 6','All 6 + Custom'],
  ['Quizzes & Activities','Basic','All','All','All','All + Custom'],
  ['Benchmark Assessments','\u2014','\u2713','\u2713','\u2713','\u2713'],
  ['Certificates','\u2014','1','All','All','All + Branded'],
  ['Downloadable Resources','\u2014','Limited','All','All','All + Custom'],
  ['Team Management','\u2014','\u2014','\u2014','\u2713','\u2713'],
  ['Progress Analytics','\u2014','Basic','Full','Full','Full + API'],
  ['Support','Forum','Email','Priority','Dedicated','Dedicated + SLA'],
  ['MLITSD Audit Support','\u2014','\u2014','Guide','Guide','Full Service']
];

let isAnnual = false;
let currentCourse = null;

// \u2550\u2550\u2550 VIDEO MAP \u2014 Verified YouTube IDs from WSPS, IHSA, WorkSafeBC, CCOHS \u2550\u2550\u2550
// Each key is matched against lesson titles (lowercase) to find the best video
const VIDEO_MAP = [
  // OHSA & Workplace Law
  {keys:['ohsa','parties','duties','scope','introduction to the ohsa'],vid:'ywaxE2FVvtQ',src:'WSPS',vtitle:'Who is covered by the OHSA in Ontario?'},
  {keys:['rights','responsibilities','employer','s.25','s.27','s.28','supervisor'],vid:'nUwKutbxYOM',src:'WSPS',vtitle:'Responsibilities of a Supervisor under the OHSA'},
  {keys:['mlitsd','inspector','stop-work','penalties'],vid:'X3zrqivRe3c',src:'WSPS',vtitle:'Competent Supervisors Training, Hazard Identification & Safety Policies'},
  {keys:['working for workers','amendments','2024'],vid:'8nxW7uDU3NQ',src:'WSPS',vtitle:'Refusing Unsafe Work? Know Your Rights!'},
  // Hazard ID & Control
  {keys:['hazard recognition','anticipate','identify','evaluate'],vid:'X3zrqivRe3c',src:'WSPS',vtitle:'Hazard Identification & Safety Policies'},
  {keys:['hazard register'],vid:'QWTCdnzbGh4',src:'WSPS',vtitle:'Learn to Spot & Stop Hazards'},
  {keys:['hierarchy of controls','risk rating'],vid:'X3zrqivRe3c',src:'WSPS',vtitle:'Competent Supervisors Training & Hazard Identification'},
  // Documentation & Policies
  {keys:['h&s policy','written requirement','annual review'],vid:'X3zrqivRe3c',src:'WSPS',vtitle:'Safety Policies for Ontario Workplaces'},
  {keys:['safe work procedures','swp'],vid:'ZrqhHANKb_I',src:'WSPS',vtitle:'What should a worker do if they have H&S concerns?'},
  {keys:['incident','three-tier','reporting','o.reg 420'],vid:'ZrqhHANKb_I',src:'WSPS',vtitle:'Worker H&S Concerns & Reporting'},
  {keys:['wsib form 7','3-business-day'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Loading & Unloading Safety'},
  {keys:['record retention','3-year'],vid:'X3zrqivRe3c',src:'WSPS',vtitle:'Competent Supervisors & Documentation'},
  // O.Reg 297/13
  {keys:['o.reg 297/13','who must comply','self-employed'],vid:'ywaxE2FVvtQ',src:'WSPS',vtitle:'Who is covered by the OHSA?'},
  {keys:['worker awareness','as soon as practicable'],vid:'8nxW7uDU3NQ',src:'WSPS',vtitle:'Know Your Rights!'},
  {keys:['supervisor awareness','1-week deadline'],vid:'nUwKutbxYOM',src:'WSPS',vtitle:'Supervisor Responsibilities under OHSA'},
  {keys:['training records','what to keep','proof of exemption'],vid:'X3zrqivRe3c',src:'WSPS',vtitle:'Competent Supervisors Training'},
  // JHSC / HSR
  {keys:['jhsc','hsr','1-5 workers','6-19','20-49','50+','300+','threshold'],vid:'tmGJOpjoQIQ',src:'WSPS',vtitle:'Who needs a JHSC in Ontario?'},
  {keys:['health & safety representative','hsr','rights','duties','powers'],vid:'tmGJOpjoQIQ',src:'WSPS',vtitle:'JHSC Requirements in Ontario'},
  {keys:['jhsc composition','certified members','quarterly'],vid:'G_XNhH7YabU',src:'WSPS',vtitle:'JHSC Certification Part One eLearning'},
  {keys:['jhsc certification','part 1','part 2','3-year refresher'],vid:'G_XNhH7YabU',src:'WSPS',vtitle:'JHSC Certification Part One eLearning'},
  {keys:['construction project jhsc','under 3 months'],vid:'tmGJOpjoQIQ',src:'WSPS',vtitle:'JHSC Requirements'},
  {keys:['virtual jhsc'],vid:'tmGJOpjoQIQ',src:'WSPS',vtitle:'JHSC Requirements in Ontario'},
  // Electrical Safety
  {keys:['oesc','electrical safety code','contractors must know'],vid:'U6ntt6X60T0',src:'WSPS',vtitle:'Overhead Power Line Hazards & Electrical Safety'},
  {keys:['esa permit','notification obligations'],vid:'U6ntt6X60T0',src:'WSPS',vtitle:'Electrical Safety for Contractors'},
  {keys:['loto','lockout','o.reg 851','s.75'],vid:'U6ntt6X60T0',src:'WSPS',vtitle:'Electrical Safety & Lockout'},
  {keys:['loto procedure','effective loto'],vid:'U6ntt6X60T0',src:'WSPS',vtitle:'Electrical Safety Procedures'},
  {keys:['zero energy','verification test'],vid:'U6ntt6X60T0',src:'WSPS',vtitle:'Electrical Safety'},
  {keys:['arc flash','incident energy'],vid:'cCaQZD8uUwU',src:'WSPS',vtitle:'Electrical Safety Requirements'},
  {keys:['arc flash boundary','ppe selection','csa z462'],vid:'cCaQZD8uUwU',src:'WSPS',vtitle:'Safety Requirements for Electrical Work'},
  // WHMIS
  {keys:['whmis','reg. 860','employer obligations'],vid:'Ia42PWjjSxc',src:'WSPS',vtitle:'WHMIS Basics'},
  {keys:['ghs hazard classes','hpr amendments'],vid:'Ia42PWjjSxc',src:'WSPS',vtitle:'WHMIS Basics for Workplaces'},
  {keys:['chemicals under pressure','flammable gases'],vid:'Ia42PWjjSxc',src:'WSPS',vtitle:'WHMIS Basics'},
  {keys:['sds','safety data sheet','16 sections'],vid:'Ia42PWjjSxc',src:'WSPS',vtitle:'WHMIS & Safety Data Sheets'},
  {keys:['sds management','accessibility'],vid:'Ia42PWjjSxc',src:'WSPS',vtitle:'WHMIS Basics'},
  {keys:['retraining','hpr amendment'],vid:'Ia42PWjjSxc',src:'WSPS',vtitle:'WHMIS Training Requirements'},
  // Working at Heights
  {keys:['3-metre trigger','fall protection becomes mandatory'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Preventing Falls'},
  {keys:['o.reg 213/91','fall protection requirements','hierarchy'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Preventing Falls in Construction'},
  {keys:['wah training requirements','cpo approval'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention & Protection'},
  {keys:['wah applies to construction','industrial workers','reg.851'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Preventing Falls'},
  {keys:['april 2024 program standard','ladders','skylights'],vid:'Iz504SK-o3s',src:'WSN',vtitle:'Slips, Trips & Falls Safety'},
  {keys:['theory module','minimum 3 hours'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention'},
  {keys:['practical module','3.5 hours','hands-on'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention Training'},
  {keys:['75% written test','hands-on demonstration'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention'},
  {keys:['3-year validity','no grace period'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention'},
  {keys:['site-specific training','employer obligation beyond cpo'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention'},
  {keys:['skillspass','verifying worker certification'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Prevention'},
  {keys:['fall protection plan','required contents'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Protection Plans'},
  {keys:['harness inspection','donning','damaged equipment'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Protection Equipment'},
  {keys:['anchor points','load calculations'],vid:'3PfdEPNKkoQ',src:'WSPS',vtitle:'Fall Protection'},
  // New Hire
  {keys:['your rights','every worker must know'],vid:'8nxW7uDU3NQ',src:'WSPS',vtitle:'Know Your Rights!'},
  {keys:['day 1','worker awareness training'],vid:'ywaxE2FVvtQ',src:'WSPS',vtitle:'Who is covered by the OHSA?'},
  {keys:['emergency procedures','muster','right to refuse'],vid:'8nxW7uDU3NQ',src:'WSPS',vtitle:'Refusing Unsafe Work? Know Your Rights!'},
  {keys:['ppe selection','care','responsibility','s.28'],vid:'GNGTwC4Zc5Y',src:'WSPS',vtitle:'Staying Safe: Working On or Around Equipment'},
  {keys:['site-specific safety rules','supervisor obligations'],vid:'nUwKutbxYOM',src:'WSPS',vtitle:'Supervisor Responsibilities'},
  {keys:['incident reporting','timelines','who to tell'],vid:'ZrqhHANKb_I',src:'WSPS',vtitle:'Worker H&S Concerns'},
  // Fleet
  {keys:['highway traffic act','fleet obligations'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Loading & Unloading Safety'},
  {keys:['cvor','score thresholds','risk ratings'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Vehicle Safety'},
  {keys:['o.reg 199/07','daily inspection'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Vehicle Inspection Safety'},
  {keys:['inspection schedule','compliant'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Vehicle Safety'},
  {keys:['hos rules','hours of service'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Vehicle Safety'},
  {keys:['eld requirements','exemptions'],vid:'wuVsoOG5_sc',src:'WSPS',vtitle:'Vehicle Safety'}
];

function findVideo(lessonTitle) {
  const t = lessonTitle.toLowerCase();
  let best = null, bestScore = 0;
  for (const v of VIDEO_MAP) {
    let score = 0;
    for (const k of v.keys) {
      if (t.includes(k.toLowerCase())) score += k.length;
    }
    if (score > bestScore) { bestScore = score; best = v; }
  }
  return best;
}

// \u2550\u2550\u2550 LESSON CONTENT \u2014 Topic-specific key takeaways \u2550\u2550\u2550
const LESSON_CONTENT = {
  'ocos1': {
    0: [ // Module 0
      {takeaways:'<p>The <strong>Occupational Health and Safety Act (OHSA)</strong> is Ontario\\'s cornerstone workplace safety legislation. It defines the duties of every workplace party \u2014 employers, supervisors, workers, and constructors.</p><ul><li><strong>Purpose:</strong> Protect workers from health and safety hazards on the job</li><li><strong>Scope:</strong> Applies to almost every workplace in Ontario</li><li><strong>Key parties:</strong> Employers (s.25), Supervisors (s.27), Workers (s.28), Constructors (s.23)</li><li><strong>Enforcement:</strong> MLITSD inspectors have the power to enter any workplace, issue orders, and lay charges</li></ul>'},
      {takeaways:'<p>Every workplace party has <strong>specific legal duties</strong> under the OHSA. Understanding these is critical for compliance.</p><ul><li><strong>Employers (s.25):</strong> Provide information, instruction, and supervision; maintain equipment; prepare written H&S policy (6+ workers)</li><li><strong>Supervisors (s.27):</strong> Ensure workers comply; advise workers of hazards; must be "competent" (qualified by knowledge, training, experience)</li><li><strong>Workers (s.28):</strong> Work in compliance with the Act; use protective equipment; report hazards and contraventions to supervisor</li></ul>'},
      {takeaways:'<p>The <strong>Ministry of Labour, Immigration, Training and Skills Development (MLITSD)</strong> enforces the OHSA across Ontario.</p><ul><li><strong>Inspector powers:</strong> Enter any workplace without warrant; order compliance; issue stop-work orders</li><li><strong>Penalties:</strong> Individual fines up to $100,000 and/or 12 months imprisonment; corporate fines up to $1,500,000</li><li><strong>Proactive inspections:</strong> MLITSD conducts targeted enforcement "blitzes" focusing on specific hazards or sectors</li></ul>'},
      {takeaways:'<p>The <strong>Working for Workers Acts</strong> (2024) introduced key amendments to the OHSA and related legislation.</p><ul><li><strong>Virtual JHSC meetings:</strong> Now explicitly permitted under Act Five</li><li><strong>Naloxone kits:</strong> Required in certain workplaces at risk of opioid overdose</li><li><strong>Digital platform workers:</strong> Extended protections to gig economy workers</li><li><strong>Right to disconnect:</strong> Employers with 25+ employees must have a written policy</li></ul>'}
    ],
    1: [ // Module 1 - Hazard ID
      {takeaways:'<p>Effective hazard management follows a <strong>four-step framework: Anticipate, Identify, Evaluate, Control.</strong></p><ul><li><strong>Anticipate:</strong> Think ahead \u2014 what could go wrong before work begins?</li><li><strong>Identify:</strong> Walk the site, review tasks, talk to workers \u2014 find every hazard</li><li><strong>Evaluate:</strong> Rate each hazard by severity and likelihood using a risk matrix</li><li><strong>Control:</strong> Apply the hierarchy of controls (elimination \u2192 substitution \u2192 engineering \u2192 administrative \u2192 PPE)</li></ul>'},
      {takeaways:'<p>A <strong>Hazard Register</strong> is your living document that tracks every identified hazard and its control measures.</p><ul><li>List each hazard with its location, affected workers, and risk rating</li><li>Document the control measures in place and their effectiveness</li><li>Review and update regularly \u2014 especially after incidents or changes to work processes</li><li>Keep accessible to all workers and JHSC/HSR members</li></ul>'},
      {takeaways:'<p>The <strong>Hierarchy of Controls</strong> is the gold standard for managing workplace hazards, ranked from most to least effective.</p><ul><li><strong>Elimination:</strong> Remove the hazard entirely (most effective)</li><li><strong>Substitution:</strong> Replace with something less hazardous</li><li><strong>Engineering controls:</strong> Isolate workers from the hazard (guards, ventilation)</li><li><strong>Administrative controls:</strong> Change work procedures, training, signage</li><li><strong>PPE:</strong> Last resort \u2014 protects only the individual wearing it</li></ul>'}
    ],
    2: [ // Module 2 - Documentation
      {takeaways:'<p>Ontario employers with <strong>6 or more workers</strong> must have a written H&S policy. It must be reviewed <strong>at least annually</strong>.</p><ul><li>Must state the employer\\'s commitment to worker health and safety</li><li>Must be posted in a conspicuous location in the workplace</li><li>Annual review requirement \u2014 date and sign each review</li><li>MLITSD inspectors will ask to see it and verify the review date</li></ul>'},
      {takeaways:'<p><strong>Safe Work Procedures (SWPs)</strong> are step-by-step instructions for performing tasks safely. They\\'re essential for MLITSD compliance.</p><ul><li>Write SWPs for every high-risk task in your operation</li><li>Include: PPE required, step-by-step process, emergency procedures</li><li>Train every worker on relevant SWPs before they begin the task</li><li>Review and update after any incident, near miss, or process change</li></ul>'},
      {takeaways:'<p><strong>O.Reg 420/21</strong> establishes a three-tier incident reporting system with specific timelines.</p><ul><li><strong>Immediate notice:</strong> Fatality, critical injury \u2014 call MLITSD immediately, preserve scene</li><li><strong>Within 48 hours:</strong> Written report to MLITSD for critical injuries</li><li><strong>Within 4 days:</strong> Written notice for non-critical injuries requiring medical attention, occupational illness, or certain incidents (e.g., structural collapse, equipment failure)</li><li><strong>Records must be kept for a minimum of 3 years</strong> under O.Reg 420/21 s.6</li></ul>'},
      {takeaways:'<p><strong>WSIB Form 7</strong> is a <strong>separate obligation</strong> from MLITSD reporting. Employers must file within <strong>3 business days</strong> of learning of an injury/illness.</p><ul><li>Required whenever a worker needs health care or is absent from work due to a workplace injury</li><li>Failure to file can result in WSIB penalties and fines</li><li>The Form 7 goes to WSIB \u2014 the O.Reg 420/21 report goes to MLITSD (different systems)</li></ul>'},
      {takeaways:'<p>Under <strong>O.Reg 420/21 s.6</strong>, employers must retain incident records for a <strong>minimum of 3 years</strong>.</p><ul><li>Keep copies of all notices and reports sent to MLITSD</li><li>Maintain investigation records, witness statements, and corrective actions</li><li>Records must be available for MLITSD inspection at any time</li></ul>'}
    ],
    3: [ // Module 3 - O.Reg 297/13
      {takeaways:'<p><strong>O.Reg 297/13</strong> makes basic occupational health and safety awareness training <strong>mandatory</strong> for all workers and supervisors in Ontario.</p><ul><li>Applies to every employer covered by the OHSA \u2014 no industry exemptions</li><li><strong>Self-employed persons are exempt</strong> if they have no employees</li><li>Training must cover the OHSA, worker/supervisor rights and duties, roles of the JHSC/HSR, and common hazards</li></ul>'},
      {takeaways:'<p>Worker awareness training must be completed <strong>"as soon as practicable"</strong> \u2014 effectively Day 1.</p><ul><li>Must cover: OHSA duties of workers, rights (refuse, participate, know), how to report hazards</li><li>No specific hour requirement, but content must be covered thoroughly</li><li>Employer must keep a record of completion for each worker</li></ul>'},
      {takeaways:'<p>Supervisor awareness training must be completed within <strong>1 week of starting</strong> as a supervisor.</p><ul><li>Must cover: supervisor duties under s.27, how to handle worker safety concerns, reporting obligations</li><li>A supervisor must be "competent" \u2014 qualified by knowledge, training, and experience</li><li>Applies to anyone who has charge of a workplace or authority over a worker</li></ul>'},
      {takeaways:'<p>Employers must maintain <strong>training records</strong> proving compliance with O.Reg 297/13.</p><ul><li>Record: worker name, date training completed, content covered, trainer name</li><li>No prescribed form \u2014 but must be available for MLITSD inspection</li><li>Self-employed persons claiming exemption should keep proof (e.g., business registration showing no employees)</li></ul>'}
    ],
    4: [ // Module 4 - JHSC/HSR
      {takeaways:'<p>Ontario uses a <strong>threshold ladder</strong> to determine worker representation requirements based on workplace size.</p><ul><li><strong>1\u20135 workers:</strong> No JHSC or HSR required (but workers still have rights)</li><li><strong>6\u201319 workers:</strong> Must select a <strong>Health & Safety Representative (HSR)</strong></li><li><strong>20\u201349 workers:</strong> Must establish a <strong>JHSC</strong> (at least 2 members)</li><li><strong>50+ workers:</strong> JHSC with at least 4 members, at least 2 certified</li><li><strong>300+ workers:</strong> Must also have a <strong>policy JHSC</strong> dealing with broad H&S policy matters</li></ul>'},
      {takeaways:'<p>A <strong>Health & Safety Representative (HSR)</strong> is required in workplaces with 6\u201319 workers.</p><ul><li>Selected by workers (not appointed by employer)</li><li>Has the right to inspect the workplace, investigate complaints, and make recommendations</li><li>Entitled to paid time to perform HSR duties</li><li>Must be consulted on proposed changes affecting worker health and safety</li></ul>'},
      {takeaways:'<p>A <strong>Joint Health and Safety Committee (JHSC)</strong> must include both worker and management members, meeting at least quarterly.</p><ul><li>At least half the members must be worker representatives, selected by workers</li><li>Must conduct regular workplace inspections (at least monthly, rotating members)</li><li>Minutes must be kept and posted in the workplace</li><li>Employer must respond in writing to JHSC recommendations within 21 days</li></ul>'},
      {takeaways:'<p><strong>JHSC Certification</strong> has two parts, each requiring a 75% pass mark, with a 3-year refresher cycle.</p><ul><li><strong>Part 1:</strong> Common core training (basic H&S law, hazard recognition, JHSC functions)</li><li><strong>Part 2:</strong> Hazard-specific training (must match the workplace hazard profile)</li><li>At least 2 JHSC members must be certified (1 worker rep, 1 management rep)</li><li>Certification is valid for 3 years \u2014 refresher training required to maintain</li></ul>'},
      {takeaways:'<p>Construction projects lasting <strong>less than 3 months</strong> are exempt from the JHSC requirement, even if 20+ workers are present.</p><ul><li>This exemption applies only to construction projects under O.Reg 213/91</li><li>Other OHSA requirements (training, reporting, etc.) still apply</li><li>If the project extends beyond 3 months, a JHSC must be formed</li></ul>'},
      {takeaways:'<p>The <strong>Working for Workers Five Act (2024)</strong> now explicitly permits virtual JHSC meetings.</p><ul><li>Members can attend meetings by video or teleconference</li><li>This was common practice during COVID but is now codified in law</li><li>Physical workplace inspections still must be done in person</li></ul>'}
    ]
  }
};

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  document.querySelectorAll('.sidebar .nav-item').forEach(n => n.classList.remove('active'));
  event.currentTarget && event.currentTarget.classList.add('active');
}

function toggleBilling() {
  isAnnual = !isAnnual;
  const track = document.getElementById('billingToggle');
  const ml = document.getElementById('toggleMonthly');
  const al = document.getElementById('toggleAnnual');
  const sb = document.getElementById('saveBadge');
  track.classList.toggle('on', isAnnual);
  ml.classList.toggle('active', !isAnnual);
  al.classList.toggle('active', isAnnual);
  sb.style.display = isAnnual ? 'inline' : 'none';
  renderPlans();
}

function renderSidebar() {
  const el = document.getElementById('sidebarCourses');
  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100);
  el.innerHTML = inProgress.map(c => {
    const circ = 2 * Math.PI * 11;
    const offset = circ - (c.progress / 100) * circ;
    return '<div class="nav-item" onclick="openCourse(\\'' + c.id + '\\')">' +
      '<div class="nav-icon" style="background:' + c.color + '22">' + c.emoji + '</div>' +
      '<div class="nav-info"><div class="nav-name">' + c.title + '</div>' +
      '<div class="nav-meta">' + c.progress + '% complete</div></div>' +
      '<div class="prog-ring"><svg width="28" height="28"><circle cx="14" cy="14" r="11" fill="none" stroke="#252525" stroke-width="2"/>' +
      '<circle cx="14" cy="14" r="11" fill="none" stroke="' + c.color + '" stroke-width="2" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '" stroke-linecap="round"/></svg>' +
      '<div class="prog-pct">' + c.progress + '%</div></div></div>';
  }).join('');
}

function renderCatalog() {
  const el = document.getElementById('catalogGrid');
  el.innerHTML = COURSES.map(c => {
    const levelClass = 'level-' + c.level;
    const btnHtml = c.progress === 100
      ? '<span style="font-family:var(--mono);font-size:10px;color:var(--green)">\u2713 COMPLETE</span>'
      : c.progress > 0
        ? '<button class="btn-continue" onclick="event.stopPropagation();openCourse(\\'' + c.id + '\\')">Continue \u2192</button>'
        : '<button class="btn-start" onclick="event.stopPropagation();openCourse(\\'' + c.id + '\\')">Start Course</button>';
    return '<div class="course-card" onclick="openCourse(\\'' + c.id + '\\')">' +
      '<div class="card-banner" style="background:' + c.banner + '">' +
      '<span style="font-size:42px;z-index:1;position:relative">' + c.emoji + '</span>' +
      '<div class="card-level ' + levelClass + '">' + c.level + '</div>' +
      (c.auditUpdated ? '<div class="audit-flag">V3 UPDATED</div>' : '') +
      '</div><div class="card-body">' +
      '<div class="card-title">' + c.title + '</div>' +
      '<div class="card-desc">' + c.desc + '</div>' +
      '<div class="card-meta">' +
      '<div class="card-meta-item">\u23F1 ' + c.hours + '</div>' +
      '<div class="card-meta-item">\u{1F4CB} ' + c.lessons + ' lessons</div>' +
      '<div class="card-meta-item">' + c.modules.length + ' modules</div>' +
      (c.cert ? '<div class="card-meta-item">\u{1F3C5} Certificate</div>' : '') +
      '</div>' +
      '<div class="card-progress-bar"><div class="card-progress-fill" style="width:' + c.progress + '%"></div></div>' +
      '<div class="card-tags">' + c.tags.map(t => '<span class="card-tag">' + t + '</span>').join('') + '</div>' +
      '<div class="card-footer"><span style="font-family:var(--mono);font-size:9px;color:var(--text-muted)">' + c.progress + '% complete</span>' + btnHtml + '</div>' +
      '</div></div>';
  }).join('');
}

function openCourse(id) {
  currentCourse = COURSES.find(c => c.id === id);
  if (!currentCourse) return;
  const c = currentCourse;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-course').classList.add('active');

  const totalLessons = c.modules.reduce((s, m) => s + m.lessons.length, 0);

  let modulesHtml = c.modules.map((m, mi) => {
    const lessonsHtml = m.lessons.map((l, li) => {
      const typeClass = 'type-' + l.type;
      const complete = c.progress > 0 && li < Math.floor(m.lessons.length * c.progress / 100) ? ' complete' : '';
      return '<div class="lesson-row' + complete + '" onclick="openLesson(\\'' + c.id + '\\',' + mi + ',' + li + ')">' +
        '<div class="lesson-num">' + (complete ? '\u2713' : (li + 1)) + '</div>' +
        '<div class="lesson-info"><div class="lesson-title">' + l.title + '</div>' +
        '<div class="lesson-type-row"><span class="lesson-type ' + typeClass + '">' + l.type + '</span>' +
        '<span class="lesson-duration">' + l.duration + '</span></div></div></div>';
    }).join('');

    return '<div class="module-card">' +
      '<div class="module-header" onclick="toggleModule(this)">' +
      '<div class="module-num">' + String(mi + 1).padStart(2, '0') + '</div>' +
      '<div class="module-info"><div class="module-title">' + m.title + (m.isNew ? '<span class="module-new">NEW</span>' : '') + '</div>' +
      '<div class="module-meta">' + m.lessons.length + ' lessons</div></div>' +
      '<div class="module-toggle">\u25BC</div></div>' +
      '<div class="module-lessons">' + lessonsHtml + '</div></div>';
  }).join('');

  const benchmarksHtml = c.benchmarks.map(b => {
    const scoreClass = b.score === null ? 'score-none' : b.score >= 80 ? 'score-green' : 'score-amber';
    return '<div class="benchmark-item"><div class="benchmark-info">' +
      '<div class="benchmark-name">' + b.name + '</div>' +
      '<div class="benchmark-sub">Target: ' + b.max + '%</div></div>' +
      '<div class="benchmark-score ' + scoreClass + '">' + (b.score !== null ? b.score + '%' : '\u2014') + '</div></div>';
  }).join('');

  const resourcesHtml = c.resources.map(r => {
    const iconClass = r.type === 'pdf' ? 'res-pdf' : 'res-doc';
    const icon = r.type === 'pdf' ? '\u{1F4C4}' : '\u{1F4C4}';
    const linkOpen = r.url ? '<a href="' + r.url + '" target="_blank" style="text-decoration:none;color:inherit;display:flex;align-items:center;gap:9px;flex:1">' : '<div style="display:flex;align-items:center;gap:9px;flex:1">';
    const linkClose = r.url ? '</a>' : '</div>';
    return '<div class="resource-item">' + linkOpen + '<div class="resource-icon ' + iconClass + '">' + icon + '</div>' +
      '<div><div class="resource-name" style="' + (r.url ? 'color:var(--green)' : '') + '">' + r.name + (r.url ? ' \u2197' : '') + '</div>' +
      '<div class="resource-size">' + r.size + '</div></div>' + linkClose + '</div>';
  }).join('');

  document.getElementById('courseDetailContent').innerHTML =
    '<div class="back-btn" onclick="showView(\\'catalog\\')">\u2190 Back to Catalog</div>' +
    '<div class="course-hero"><div class="hero-emoji">' + c.emoji + '</div><div class="hero-info">' +
    '<div class="hero-title">' + c.title + '</div>' +
    '<div class="hero-desc">' + c.desc + '</div>' +
    '<div class="hero-stats">' +
    '<div class="hero-stat">\u23F1 <strong>' + c.hours + '</strong></div>' +
    '<div class="hero-stat">\u{1F4CB} <strong>' + totalLessons + '</strong> lessons</div>' +
    '<div class="hero-stat">\u{1F4CB} <strong>' + c.modules.length + '</strong> modules</div>' +
    (c.cert ? '<div class="hero-stat">\u{1F3C5} <strong>Certificate</strong></div>' : '') +
    '</div>' +
    '<div class="progress-section"><div class="progress-label"><span>Progress</span><span>' + c.progress + '%</span></div>' +
    '<div class="progress-bar-full"><div class="progress-bar-fill" style="width:' + c.progress + '%"></div></div></div>' +
    '</div></div>' +
    '<div class="detail-grid"><div class="modules-list">' + modulesHtml + '</div>' +
    '<div><div class="panel"><div class="panel-header">\u{1F3AF} Benchmarks</div>' +
    '<div class="panel-body">' + benchmarksHtml + '</div></div>' +
    '<div class="panel"><div class="panel-header">\u{1F4C1} Resources</div>' +
    '<div class="panel-body">' + resourcesHtml + '</div></div></div></div>';
}

function toggleModule(el) {
  const lessons = el.nextElementSibling;
  const toggle = el.querySelector('.module-toggle');
  lessons.classList.toggle('open');
  toggle.classList.toggle('open');
}

function openLesson(courseId, moduleIdx, lessonIdx) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return;
  const mod = course.modules[moduleIdx];
  const lesson = mod.lessons[lessonIdx];

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-lesson').classList.add('active');

  const nextLesson = lessonIdx < mod.lessons.length - 1 ? mod.lessons[lessonIdx + 1] : null;

  // Find matching video
  const videoMatch = findVideo(lesson.title);

  // Find topic-specific content
  let takeawaysHtml = '';
  const courseContent = LESSON_CONTENT[courseId];
  if (courseContent && courseContent[moduleIdx]) {
    const videoLessons = mod.lessons.filter(l => l.type === 'video');
    const videoIdx = videoLessons.indexOf(lesson);
    if (videoIdx >= 0 && courseContent[moduleIdx][videoIdx]) {
      takeawaysHtml = courseContent[moduleIdx][videoIdx].takeaways;
    }
  }
  if (!takeawaysHtml) {
    // Generate contextual fallback from lesson title
    takeawaysHtml = '<p>This lesson covers <strong>' + lesson.title + '</strong> as required under Ontario legislation.</p>' +
      '<ul><li>Understand the specific regulatory requirements and how they apply to your workplace</li>' +
      '<li>Know the compliance deadlines and documentation obligations</li>' +
      '<li>Be prepared to demonstrate knowledge during MLITSD inspections</li>' +
      '<li>Reference: ' + course.tags.join(', ') + '</li></ul>';
  }

  let mainContent = '';
  if (lesson.type === 'video') {
    const videoEmbed = videoMatch
      ? '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoMatch.vid + '?rel=0&modestbranding=1" title="' + videoMatch.vtitle + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0"></iframe>'
      : '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;flex-direction:column;gap:12px"><span style="font-size:48px">\u{1F3AC}</span><span style="font-family:var(--mono);font-size:11px;color:var(--text-muted)">Video content loading...</span></div>';
    const sourceTag = videoMatch
      ? '<div style="display:flex;align-items:center;gap:6px;margin-top:6px"><span class="mlitsd-chip">Source: ' + videoMatch.src + '</span><span style="font-family:var(--mono);font-size:9px;color:var(--text-muted)">' + videoMatch.vtitle + '</span></div>'
      : '';
    mainContent = '<div class="video-container"><div class="video-player" style="position:relative">' + videoEmbed + '</div>' +
      '<div class="video-title-bar"><div><div class="video-title">' + lesson.title + '</div>' + sourceTag + '</div>' +
      '<div class="video-meta">' + lesson.duration + '</div></div></div>' +
      '<div class="content-card"><div class="content-card-title">\u{1F4DD} Key Takeaways</div>' +
      '<div class="content-body">' + takeawaysHtml + '</div></div>';
  } else if (lesson.type === 'activity') {
    mainContent = '<div class="activity-card"><div class="activity-header">' +
      '<div class="activity-title">' + lesson.title + '</div>' +
      '<span class="activity-type-tag">HANDS-ON ACTIVITY</span>' +
      '<span class="activity-type-tag" style="background:rgba(0,255,65,0.09);color:var(--green);border-color:rgba(0,255,65,0.18)">\u23F1 ' + lesson.duration + '</span></div>' +
      '<div class="activity-steps"><p style="margin-bottom:8px">Complete this practical exercise to apply what you learned in the preceding lessons.</p><ol>' +
      '<li>Review the regulatory requirements and key takeaways from this module\\'s video lessons</li>' +
      '<li>Download the activity template from the Resources panel in the course detail view</li>' +
      '<li>Apply the framework to <strong>your specific workplace</strong> \u2014 use real scenarios from your operation</li>' +
      '<li>Complete all sections of the template with references to the applicable regulations (' + course.tags.slice(0,3).join(', ') + ')</li>' +
      '<li>Save your completed document \u2014 it becomes part of your compliance portfolio</li></ol></div>' +
      '<div class="deliverable-box"><div class="deliverable-label">Deliverable</div>' +
      '<div class="deliverable-text">Completed activity document with regulation references. This document is MLITSD-inspection ready and forms part of your due diligence record.</div></div></div>' +
      '<div class="content-card" style="margin-top:12px"><div class="content-card-title">\u{1F4CB} Regulations Referenced in This Activity</div>' +
      '<div class="content-body"><p>This activity requires you to reference and apply the following Ontario legislation:</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px">' + course.tags.map(t => '<span class="reg-chip">' + t + '</span>').join('') + '</div></div></div>';
  } else if (lesson.type === 'benchmark') {
    const modBenchmarks = course.benchmarks.filter(b => b.name.toLowerCase().includes(mod.title.toLowerCase().split(' ')[0]) || true);
    const relBench = modBenchmarks[moduleIdx] || course.benchmarks[0];
    const prevScore = relBench && relBench.score !== null ? relBench.score : null;
    mainContent = '<div class="content-card"><div class="content-card-title">\u{1F4CB} ' + lesson.title + '</div>' +
      '<div class="content-body"><p>This benchmark assessment tests your knowledge of <strong>' + mod.title + '</strong>. You must score <strong>75% or higher</strong> to pass and unlock the next module.</p>' +
      '<ul><li><strong>Format:</strong> Multiple choice and scenario-based questions drawn from Ontario legislation</li>' +
      '<li><strong>Time limit:</strong> ' + lesson.duration + ' (timed)</li>' +
      '<li><strong>Passing score:</strong> 75% \u2014 matches JHSC certification standard</li>' +
      '<li><strong>Retakes:</strong> Unlimited \u2014 review the video lessons and try again</li>' +
      '<li><strong>Regulations tested:</strong> ' + course.tags.slice(0,4).join(', ') + '</li></ul>' +
      (prevScore !== null ? '<div class="alert alert-green" style="margin-top:10px"><strong>Previous score: ' + prevScore + '%</strong> \u2014 ' + (prevScore >= 75 ? 'Passed! You can retake to improve your score.' : 'Below 75%. Review the module content and try again.') + '</div>' : '') +
      '</div></div>' +
      '<button class="btn-primary" style="margin-top:12px;padding:12px 24px;font-size:15px">Begin Benchmark Assessment \u2192</button>' +
      '<p style="font-family:var(--mono);font-size:9px;color:var(--text-muted);margin-top:8px">Your answers are auto-saved. You can pause and resume.</p>';
  }

  document.getElementById('lessonContent').innerHTML =
    '<div class="lesson-nav">' +
    '<span class="crumb" onclick="showView(\\'catalog\\')">Catalog</span><span class="crumb-sep">/</span>' +
    '<span class="crumb" onclick="openCourse(\\'' + courseId + '\\')">' + course.title + '</span><span class="crumb-sep">/</span>' +
    '<span class="crumb">Module ' + (moduleIdx + 1) + '</span><span class="crumb-sep">/</span>' +
    '<span style="font-family:var(--mono);font-size:10px;color:var(--green)">' + lesson.title + '</span></div>' +
    '<div class="lesson-grid"><div class="lesson-main">' + mainContent + '</div>' +
    '<div class="lesson-sidebar">' +
    (nextLesson ? '<div class="next-box"><div class="next-label">Up Next</div>' +
      '<div class="next-title">' + nextLesson.title + '</div>' +
      '<button class="btn-primary" onclick="openLesson(\\'' + courseId + '\\',' + moduleIdx + ',' + (lessonIdx + 1) + ')">Next Lesson \u2192</button></div>' : '') +
    '<div class="panel"><div class="panel-header">\u{1F4CB} Notes</div>' +
    '<div class="panel-body"><textarea class="note-area" placeholder="Take notes for this lesson..."></textarea></div></div>' +
    '<div class="panel"><div class="panel-header">\u{1F4CB} Regulations Referenced</div>' +
    '<div class="panel-body">' + course.tags.map(t => '<span class="reg-chip">' + t + '</span>').join('') + '</div></div>' +
    '</div></div>';
}

function renderCerts() {
  const el = document.getElementById('certGrid');
  el.innerHTML = COURSES.filter(c => c.cert).map(c => {
    const earned = c.progress === 100;
    return '<div class="cert-card ' + (earned ? 'earned' : 'locked') + '">' +
      (earned ? '<div class="cert-ribbon">EARNED</div>' : '') +
      '<div class="cert-emoji">' + c.emoji + '</div>' +
      '<div class="cert-title">' + c.title + '</div>' +
      (earned ? '<div class="cert-date">Earned: March 2026</div>' : '') +
      '<div class="cert-reg">' + c.tags.slice(0, 3).join(' \xB7 ') + '</div>' +
      '<div class="cert-status">' + (earned ? 'Valid \u2014 MLITSD Defensible' : c.progress + '% complete') + '</div>' +
      (earned ? '<button class="cert-dl-btn">Download Certificate</button>' : '') +
      '</div>';
  }).join('');
}

function renderPlans() {
  const el = document.getElementById('plansGrid');
  el.innerHTML = PLANS.map(p => {
    const price = isAnnual ? p.annual : p.monthly;
    const per = isAnnual ? '/year' : '/month';
    const amountClass = p.name === 'TEAM' ? 'amber' : (p.name === 'ENTERPRISE' ? 'gray' : '');
    const priceDisplay = price === null ? 'CUSTOM' : (price === 0 ? 'FREE' : '$' + price);
    const checks = p.checks.split(',');
    return '<div class="plan-card' + (p.featured ? ' featured' : '') + '">' +
      '<div class="plan-name">' + p.name + '</div>' +
      '<div class="plan-tagline">' + p.tagline + '</div>' +
      '<div class="plan-price"><div class="plan-amount ' + amountClass + '">' + priceDisplay + '</div>' +
      (price !== null && price > 0 ? '<div class="plan-per">' + per + '</div>' : '') +
      (isAnnual && p.monthly ? '<div class="plan-annual ' + (p.name === 'TEAM' ? 'amber' : '') + '">Save $' + (p.monthly * 12 - p.annual) + '/yr</div>' : '') +
      '</div><div class="plan-divider"></div><div class="plan-features">' +
      p.features.map((f, i) => '<div class="plan-feature"><span class="feat-check ' + (checks[i] || 'green') + '">\u2713</span>' + f + '</div>').join('') +
      '</div><button class="plan-cta ' + p.cta + '">' + p.ctaText + '</button></div>';
  }).join('');
}

function renderAddOns() {
  document.getElementById('addOnsGrid').innerHTML = ADDONS.map(a =>
    '<div class="addon-card"><div class="addon-icon">' + a.icon + '</div>' +
    '<div class="addon-info"><div class="addon-name">' + a.name + '</div>' +
    '<div class="addon-desc">' + a.desc + '</div>' +
    '<div class="addon-price">' + a.price + '</div></div></div>'
  ).join('');
}

function renderCompare() {
  const headers = ['Feature','Free','Starter','Professional','Team','Enterprise'];
  document.getElementById('compareTable').innerHTML =
    '<thead><tr>' + headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>' +
    '<tbody>' + COMPARE.map(row =>
      '<tr>' + row.map((cell, i) => {
        if (i === 0) return '<td>' + cell + '</td>';
        if (cell === '\u2713') return '<td><span class="check-yes">\u2713</span></td>';
        if (cell === '\u2014') return '<td><span class="check-no">\u2014</span></td>';
        return '<td>' + cell + '</td>';
      }).join('') + '</tr>'
    ).join('') + '</tbody>';
}

// Initialize
renderSidebar();
renderCatalog();
renderCerts();
renderPlans();
renderAddOns();
renderCompare();
<\/script>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}
__name(handleLearningDashboard, "handleLearningDashboard");
__name2(handleLearningDashboard, "handleLearningDashboard");
var ALLOWED_ORIGINS = [
  "https://app.naturalalternatives.ca",
  "https://admin.naturalalternatives.ca",
  "https://naturalalternatives.ca",
  "https://www.naturalalternatives.ca"
];
function corsHeaders(env, request) {
  const configuredOrigin = env.FRONTEND_URL || "https://app.naturalalternatives.ca";
  const allAllowed = [.../* @__PURE__ */ new Set([...ALLOWED_ORIGINS, configuredOrigin])];
  const origin = request?.headers?.get("Origin") || "";
  const allowOrigin = allAllowed.includes(origin) ? origin : configuredOrigin;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Access-Control-Max-Age": "86400"
  };
}
__name(corsHeaders, "corsHeaders");
__name2(corsHeaders, "corsHeaders");
async function getAllLicenses(db) {
  const { results } = await db.prepare("SELECT * FROM licenses ORDER BY created_at DESC").all();
  return results;
}
__name(getAllLicenses, "getAllLicenses");
__name2(getAllLicenses, "getAllLicenses");
async function getLicenseByKey(db, key) {
  return await db.prepare("SELECT * FROM licenses WHERE key = ?").bind(key).first();
}
__name(getLicenseByKey, "getLicenseByKey");
__name2(getLicenseByKey, "getLicenseByKey");
async function createLicense(db, { key, tier, email, customer_name, source, stripe_payment_id }) {
  const result = await db.prepare(
    `INSERT INTO licenses (key, tier, email, customer_name, source, stripe_payment_id) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(key, tier, email || "", customer_name || "", source || "manual", stripe_payment_id || null).run();
  return await db.prepare("SELECT * FROM licenses WHERE id = ?").bind(result.meta.last_row_id).first();
}
__name(createLicense, "createLicense");
__name2(createLicense, "createLicense");
async function deactivateLicense(db, id) {
  await db.prepare(`UPDATE licenses SET is_active = 0, deactivated_at = datetime('now') WHERE id = ?`).bind(id).run();
}
__name(deactivateLicense, "deactivateLicense");
__name2(deactivateLicense, "deactivateLicense");
async function activateLicense(db, id) {
  await db.prepare(`UPDATE licenses SET is_active = 1, deactivated_at = NULL WHERE id = ?`).bind(id).run();
}
__name(activateLicense, "activateLicense");
__name2(activateLicense, "activateLicense");
async function deleteLicense(db, id) {
  await db.prepare("DELETE FROM licenses WHERE id = ?").bind(id).run();
}
__name(deleteLicense, "deleteLicense");
__name2(deleteLicense, "deleteLicense");
async function touchLicense(db, id) {
  await db.prepare(`UPDATE licenses SET last_used_at = datetime('now') WHERE id = ?`).bind(id).run();
}
__name(touchLicense, "touchLicense");
__name2(touchLicense, "touchLicense");
async function getStats(db) {
  const total = (await db.prepare("SELECT COUNT(*) as count FROM licenses").first()).count;
  const active = (await db.prepare("SELECT COUNT(*) as count FROM licenses WHERE is_active = 1").first()).count;
  const stripe = (await db.prepare("SELECT COUNT(*) as count FROM licenses WHERE source = 'stripe'").first()).count;
  const manual = (await db.prepare("SELECT COUNT(*) as count FROM licenses WHERE source = 'manual'").first()).count;
  const pending = (await db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'").first()).count;
  const { results: byTier } = await db.prepare("SELECT tier, COUNT(*) as count FROM licenses GROUP BY tier").all();
  return { total, active, inactive: total - active, stripe, manual, pending_orders: pending, byTier };
}
__name(getStats, "getStats");
__name2(getStats, "getStats");
async function createOrder(db, { email, customer_name, tier, amount, currency, stripe_payment_id, stripe_session_id }) {
  const result = await db.prepare(
    `INSERT INTO orders (email, customer_name, tier, amount, currency, stripe_payment_id, stripe_session_id) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(email, customer_name || "", tier, amount || 0, currency || "cad", stripe_payment_id || null, stripe_session_id || null).run();
  return await db.prepare("SELECT * FROM orders WHERE id = ?").bind(result.meta.last_row_id).first();
}
__name(createOrder, "createOrder");
__name2(createOrder, "createOrder");
async function getOrders(db, status = null) {
  if (status) {
    const { results: results2 } = await db.prepare("SELECT * FROM orders WHERE order_status = ? ORDER BY created_at DESC").bind(status).all();
    return results2;
  }
  const { results } = await db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  return results;
}
__name(getOrders, "getOrders");
__name2(getOrders, "getOrders");
async function getOrderById(db, id) {
  return await db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
}
__name(getOrderById, "getOrderById");
__name2(getOrderById, "getOrderById");
async function approveOrder(db, orderId, licenseKey, licenseId, reviewedBy, notes) {
  await db.prepare(
    `UPDATE orders SET order_status = 'approved', reviewed_by = ?, reviewed_at = datetime('now'), review_notes = ?, license_id = ?, license_key = ? WHERE id = ?`
  ).bind(reviewedBy || "admin", notes || "", licenseId, licenseKey, orderId).run();
}
__name(approveOrder, "approveOrder");
__name2(approveOrder, "approveOrder");
async function rejectOrder(db, orderId, reviewedBy, notes) {
  await db.prepare(
    `UPDATE orders SET order_status = 'rejected', reviewed_by = ?, reviewed_at = datetime('now'), review_notes = ? WHERE id = ?`
  ).bind(reviewedBy || "admin", notes || "", orderId).run();
}
__name(rejectOrder, "rejectOrder");
__name2(rejectOrder, "rejectOrder");
async function getSetting(db, key) {
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
  return row ? row.value : null;
}
__name(getSetting, "getSetting");
__name2(getSetting, "getSetting");
async function setSetting(db, key, value) {
  await db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind(key, value).run();
}
__name(setSetting, "setSetting");
__name2(setSetting, "setSetting");
var TIER_PREFIXES = {
  SOLO: { annual: false, defaultDays: 0 },
  ADDON: { annual: false, defaultDays: 0 },
  FLEET: { annual: true, defaultDays: 365 },
  OCOS1: { annual: false, defaultDays: 0 },
  OCOS2: { annual: false, defaultDays: 0 },
  OCOS3: { annual: false, defaultDays: 0 },
  OCOSB: { annual: false, defaultDays: 0 },
  PRACS: { annual: true, defaultDays: 365 },
  PRACG: { annual: true, defaultDays: 365 },
  PRACP: { annual: true, defaultDays: 365 },
  PRACA: { annual: true, defaultDays: 365 }
};
function generateLicenseKey(tier, durationDays) {
  const prefix = tier.toUpperCase();
  const tierDef = TIER_PREFIXES[prefix];
  if (!tierDef)
    throw new Error(`Unknown tier: ${tier}`);
  const days = durationDays !== void 0 ? durationDays : tierDef.defaultDays;
  const epoch = days === 0 ? 0 : Math.floor(Date.now() / 1e3) + days * 86400;
  const raw = prefix + String(epoch);
  let cs = 0;
  for (let i = 0; i < raw.length; i++)
    cs ^= raw.charCodeAt(i);
  const checksum = cs.toString(16).toUpperCase().padStart(4, "0");
  return `${prefix}-${epoch}-${checksum}`;
}
__name(generateLicenseKey, "generateLicenseKey");
__name2(generateLicenseKey, "generateLicenseKey");
async function sendEmail(env, { from, to, reply_to, subject, html, text }) {
  if (!env.RESEND_API_KEY) {
    console.warn("\u26A0\uFE0F  RESEND_API_KEY not set \u2014 email skipped");
    return { skipped: true };
  }
  const payload = { from, to: [to], subject, html, text };
  if (reply_to)
    payload.reply_to = reply_to;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(`Resend error: ${JSON.stringify(data)}`);
  console.log(`\u{1F4E7} Email \u2192 ${to} | ${data.id}`);
  return data;
}
__name(sendEmail, "sendEmail");
__name2(sendEmail, "sendEmail");
async function sendLicenseEmail(env, toEmail, licenseKey, tier, customerName) {
  const name = customerName?.split(" ")[0] || "there";
  const yr = (/* @__PURE__ */ new Date()).getFullYear();
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060807;font-family:-apple-system,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;padding-bottom:24px;border-bottom:1px solid rgba(79,210,140,.15);">
<div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#4fd28c;font-weight:700;">NATURAL ALTERNATIVES</div>
<div style="font-size:20px;font-weight:800;color:#edf5f0;">NAC OS Fleet Logbook\u2122</div></div>
<div style="padding:28px 0;color:rgba(237,245,240,.85);">
<p style="font-size:16px;margin-bottom:16px;">Hi ${name} \u{1F44B}</p>
<p style="font-size:14px;line-height:1.65;margin-bottom:24px;">Your <strong style="color:#4fd28c;">${tier}</strong> license is confirmed.</p>
<div style="background:#0d1210;border:1px solid rgba(79,210,140,.25);border-radius:14px;padding:22px;text-align:center;margin:24px 0;">
<div style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(237,245,240,.4);margin-bottom:8px;">YOUR LICENSE KEY</div>
<div style="font-family:'Courier New',monospace;font-size:20px;font-weight:700;color:#4fd28c;word-break:break-all;">${licenseKey}</div></div>
<p style="font-size:13px;color:rgba(237,245,240,.5);">Open the Fleet Logbook app \u2192 Settings \u2192 License \u2192 paste and activate.</p>
<p style="font-size:12px;color:rgba(237,245,240,.3);margin-top:20px;">Questions? <a href="mailto:support@naturalalternatives.ca" style="color:#4fd28c;">support@naturalalternatives.ca</a></p>
<p style="font-size:11px;color:rgba(237,245,240,.2);">\xA9 ${yr} Natural Alternatives</p></div></div></body></html>`;
  return sendEmail(env, { from: "Natural Alternatives Billing <billing@naturalalternatives.ca>", to: toEmail, subject: `Your NAC OS ${tier} license key \u2014 activate now`, html, text: `Hi ${name},

Your ${tier} key: ${licenseKey}

Activate: Fleet Logbook \u2192 Settings \u2192 License.

Questions? support@naturalalternatives.ca` });
}
__name(sendLicenseEmail, "sendLicenseEmail");
__name2(sendLicenseEmail, "sendLicenseEmail");
async function sendSaleNotification(env, { email, name, tier, amount, currency, orderId }) {
  const amt = `$${(amount / 100).toFixed(2)} ${(currency || "CAD").toUpperCase()}`;
  const time = (/* @__PURE__ */ new Date()).toLocaleString("en-CA", { timeZone: "America/Toronto" });
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#060807;font-family:-apple-system,sans-serif;color:#edf5f0;">
<div style="max-width:480px;margin:0 auto;background:#0d1210;border:1px solid rgba(79,210,140,.2);border-radius:14px;padding:24px;">
<div style="font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:#4fd28c;margin-bottom:6px;">\u{1F4B0} NEW SALE</div>
<div style="font-size:24px;font-weight:800;margin-bottom:18px;">${amt}</div>
<table style="width:100%;font-size:13px;border-collapse:collapse;">
<tr><td style="color:rgba(237,245,240,.5);padding:5px 0;width:100px;">Customer</td><td>${name || "\u2014"}</td></tr>
<tr><td style="color:rgba(237,245,240,.5);padding:5px 0;">Email</td><td>${email}</td></tr>
<tr><td style="color:rgba(237,245,240,.5);padding:5px 0;">Product</td><td style="color:#4fd28c;font-weight:700;">${tier}</td></tr>
<tr><td style="color:rgba(237,245,240,.5);padding:5px 0;">Order #</td><td>${orderId}</td></tr>
<tr><td style="color:rgba(237,245,240,.5);padding:5px 0;">Time</td><td>${time} ET</td></tr></table>
<a href="https://nacosapp.craig3113.workers.dev/dashboard" style="display:block;margin-top:18px;padding:12px;background:rgba(79,210,140,.15);border:1px solid rgba(79,210,140,.3);border-radius:10px;color:#4fd28c;text-decoration:none;text-align:center;font-weight:700;">View Dashboard \u2192</a>
</div></body></html>`;
  return sendEmail(env, { from: "NAC OS <noreply@naturalalternatives.ca>", to: "info@naturalalternatives.ca", subject: `\u{1F4B0} New sale \u2014 ${tier} (${amt})`, html, text: `NEW SALE: ${amt}
Customer: ${name}
Email: ${email}
Product: ${tier}
Order: ${orderId}
Time: ${time}` });
}
__name(sendSaleNotification, "sendSaleNotification");
__name2(sendSaleNotification, "sendSaleNotification");
async function sendLeadMagnetEmail(env, { name, email }) {
  const first = name?.split(" ")[0] || "there";
  const yr = (/* @__PURE__ */ new Date()).getFullYear();
  const pdf = "https://nacosapp.craig3113.workers.dev/api/download/playbook";
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060807;font-family:-apple-system,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;padding-bottom:24px;border-bottom:1px solid rgba(79,210,140,.15);">
<div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#4fd28c;font-weight:700;">NATURAL ALTERNATIVES</div>
<div style="font-size:18px;font-weight:800;color:#edf5f0;">Your free playbook is ready</div></div>
<div style="padding:28px 0;color:rgba(237,245,240,.85);">
<p style="font-size:16px;">Hi ${first} \u{1F44B}</p>
<p style="font-size:14px;line-height:1.65;margin:16px 0;">Here's your <strong style="color:#4fd28c;">Ontario Contractor Compliance Playbook</strong>.</p>
<div style="text-align:center;margin:24px 0;">
<a href="${pdf}" style="display:inline-block;padding:14px 28px;background:rgba(79,210,140,.2);border:1px solid rgba(79,210,140,.4);border-radius:12px;color:#4fd28c;text-decoration:none;font-weight:700;">\u{1F4C4} Download Playbook</a></div>
<p style="font-size:13px;color:rgba(237,245,240,.55);">Over the next few days I'll share practical tips on contractor compliance in Ontario.</p>
<p style="font-size:14px;margin-top:24px;color:rgba(237,245,240,.75);">\u2014 Craig<br><span style="font-size:12px;color:rgba(237,245,240,.4);">Natural Alternatives</span></p></div>
<p style="font-size:11px;color:rgba(237,245,240,.2);text-align:center;">You received this because you requested the Compliance Playbook.<br>
<a href="https://nacosapp.craig3113.workers.dev/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(79,210,140,.4);">Unsubscribe</a> \xB7 \xA9 ${yr} Natural Alternatives</p>
</div></body></html>`;
  return sendEmail(env, { from: "Natural Alternatives <info@naturalalternatives.ca>", to: email, subject: "Your Ontario Contractor Compliance Playbook \u2014 download inside", html, text: `Hi ${first},

Download your playbook: ${pdf}

More tips coming over the next few days.

\u2014 Craig
Natural Alternatives

Unsubscribe: https://nacosapp.craig3113.workers.dev/unsubscribe?email=${encodeURIComponent(email)}` });
}
__name(sendLeadMagnetEmail, "sendLeadMagnetEmail");
__name2(sendLeadMagnetEmail, "sendLeadMagnetEmail");
function nurtureDay1Html(first) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060807;font-family:-apple-system,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;color:rgba(237,245,240,.85);">
<div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#4fd28c;font-weight:700;margin-bottom:20px;">NATURAL ALTERNATIVES</div>
<p>Hi ${first},</p>
<p style="margin:16px 0;">I wanted to follow up on something the playbook covers but doesn't go deep on: the pre-shift inspection requirement under <strong style="color:#edf5f0;">O.Reg 213/91</strong>.</p>
<p>This is the single most common MOL order Ontario contractors receive. Not because of unsafe equipment \u2014 because documentation doesn't meet the standard.</p>
<p style="margin:16px 0;"><strong>What the regulation actually requires:</strong></p>
<ul style="padding-left:20px;color:rgba(237,245,240,.75);line-height:1.8;">
<li>Written record of each inspection before each shift</li>
<li>Specific deficiencies noted \u2014 not just "passed" or "OK"</li>
<li>Signature of the operator or supervisor</li>
<li>Records on-site and available for Ministry review</li></ul>
<p style="margin:16px 0;">The "passed" checkbox format most contractors use is <strong>not sufficient</strong> under s.93\u2013104.</p>
<p style="margin-top:24px;">\u2014 Craig<br><span style="font-size:12px;color:rgba(237,245,240,.4);">Natural Alternatives</span></p>
<p style="font-size:11px;color:rgba(237,245,240,.2);margin-top:24px;">Unsubscribe: <a href="https://nacosapp.craig3113.workers.dev/unsubscribe?email=${encodeURIComponent(first)}" style="color:rgba(79,210,140,.4);">click here</a></p>
</div></body></html>`;
}
__name(nurtureDay1Html, "nurtureDay1Html");
__name2(nurtureDay1Html, "nurtureDay1Html");
function nurtureDay3Html(first) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060807;font-family:-apple-system,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;color:rgba(237,245,240,.85);">
<div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#4fd28c;font-weight:700;margin-bottom:20px;">NATURAL ALTERNATIVES</div>
<p>Hi ${first},</p>
<p style="margin:16px 0;">Under Ontario's WSIA s.141, if a subcontractor you hire has an unpaid WSIB balance, <strong style="color:#edf5f0;">you can be held personally liable</strong> \u2014 even if you didn't know.</p>
<p>The fix: request a WSIB Clearance Certificate before paying any sub. It's free at wsib.ca, takes 2 minutes. Keep it on file per payment.</p>
<p style="margin:16px 0;">OCOS T1 includes a WSIB clearance tracking log built for exactly this workflow.</p>
<p>Worth a look: <a href="https://naturalalternatives.ca/pricing.html" style="color:#4fd28c;">naturalalternatives.ca/pricing.html</a></p>
<p style="margin-top:24px;">\u2014 Craig<br><span style="font-size:12px;color:rgba(237,245,240,.4);">Natural Alternatives</span></p>
</div></body></html>`;
}
__name(nurtureDay3Html, "nurtureDay3Html");
__name2(nurtureDay3Html, "nurtureDay3Html");
function nurtureDay7Html(first) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060807;font-family:-apple-system,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;color:rgba(237,245,240,.85);">
<div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#4fd28c;font-weight:700;margin-bottom:20px;">NATURAL ALTERNATIVES</div>
<p>Hi ${first},</p>
<p style="margin:16px 0;">Last email \u2014 something practical. What MOL inspectors check first:</p>
<ol style="padding-left:20px;color:rgba(237,245,240,.75);line-height:1.8;">
<li>Pre-shift inspection records \u2014 written, per shift, per machine</li>
<li>Worker training and competency records</li>
<li>WHMIS documentation and labels</li>
<li>Fall protection plan (O.Reg 213/91)</li>
<li>Emergency procedures and first aid</li></ol>
<p style="margin:16px 0;">Most stop-work orders come from #1 and #2. Documentation is the biggest gap.</p>
<div style="background:#0d1210;border:1px solid rgba(79,210,140,.2);border-radius:12px;padding:18px;margin:20px 0;text-align:center;">
<div style="font-size:22px;font-weight:800;margin-bottom:4px;">$397 one-time</div>
<div style="font-size:13px;color:rgba(237,245,240,.5);margin-bottom:14px;">Workspace ready within 1 business day \xB7 No annual fee</div>
<a href="https://naturalalternatives.ca/pricing.html" style="display:inline-block;padding:12px 24px;background:rgba(79,210,140,.2);border:1px solid rgba(79,210,140,.35);border-radius:10px;color:#4fd28c;text-decoration:none;font-weight:700;">See what's included \u2192</a></div>
<p style="font-size:13px;color:rgba(237,245,240,.5);">If timing isn't right \u2014 the playbook is yours to keep.</p>
<p style="margin-top:24px;">\u2014 Craig<br><span style="font-size:12px;color:rgba(237,245,240,.4);">Natural Alternatives</span></p>
</div></body></html>`;
}
__name(nurtureDay7Html, "nurtureDay7Html");
__name2(nurtureDay7Html, "nurtureDay7Html");
async function handleNurtureCron(env) {
  console.log("\u23F0 Nurture cron \u2014", (/* @__PURE__ */ new Date()).toISOString());
  let sent = 0;
  try {
    const { results: leads } = await env.DB.prepare(`
      SELECT id, name, email, created_at, day1_sent, day3_sent, day7_sent
      FROM leads WHERE casl_consent = 1 AND unsubscribed = 0
        AND (day1_sent = 0 OR day3_sent = 0 OR day7_sent = 0)
      ORDER BY created_at ASC LIMIT 200
    `).all();
    const now = Date.now();
    for (const lead of leads) {
      const first = lead.name?.split(" ")[0] || "there";
      const hoursOld = (now - (/* @__PURE__ */ new Date(lead.created_at + "Z")).getTime()) / 36e5;
      const purchased = await env.DB.prepare(`SELECT id FROM orders WHERE email = ? AND order_status = 'approved' LIMIT 1`).bind(lead.email.toLowerCase()).first();
      if (purchased)
        continue;
      if (!lead.day1_sent && hoursOld >= 24) {
        try {
          await sendEmail(env, { from: "Natural Alternatives <info@naturalalternatives.ca>", to: lead.email, subject: "The MOL inspection that costs Ontario contractors the most \u2014 and how to prepare for it", html: nurtureDay1Html(first), text: `Hi ${first},

O.Reg 213/91 pre-shift inspection \u2014 most common MOL order. Details in next message.

\u2014 Craig` });
          await env.DB.prepare(`UPDATE leads SET day1_sent = 1, day1_sent_at = datetime('now') WHERE id = ?`).bind(lead.id).run();
          sent++;
        } catch (e) {
          console.error("Day1 fail:", e.message);
        }
        continue;
      }
      if (lead.day1_sent && !lead.day3_sent && hoursOld >= 72) {
        try {
          await sendEmail(env, { from: "Natural Alternatives <info@naturalalternatives.ca>", to: lead.email, subject: "The WSIB clearance gap that exposes Ontario contractors to personal liability", html: nurtureDay3Html(first), text: `Hi ${first},

WSIB clearance + OCOS T1 info: https://naturalalternatives.ca/pricing.html

\u2014 Craig` });
          await env.DB.prepare(`UPDATE leads SET day3_sent = 1, day3_sent_at = datetime('now') WHERE id = ?`).bind(lead.id).run();
          sent++;
        } catch (e) {
          console.error("Day3 fail:", e.message);
        }
        continue;
      }
      if (lead.day3_sent && !lead.day7_sent && hoursOld >= 168) {
        try {
          await sendEmail(env, { from: "Natural Alternatives <info@naturalalternatives.ca>", to: lead.email, subject: "What an MOL compliance audit actually looks like \u2014 and what it checks first", html: nurtureDay7Html(first), text: `Hi ${first},

MOL audit checklist + OCOS T1 offer at $397: https://naturalalternatives.ca/pricing.html

\u2014 Craig` });
          await env.DB.prepare(`UPDATE leads SET day7_sent = 1, day7_sent_at = datetime('now') WHERE id = ?`).bind(lead.id).run();
          sent++;
        } catch (e) {
          console.error("Day7 fail:", e.message);
        }
      }
    }
    console.log(`\u2705 Nurture done \u2014 sent: ${sent}`);
  } catch (err) {
    console.error("Nurture cron error:", err);
  }
}
__name(handleNurtureCron, "handleNurtureCron");
__name2(handleNurtureCron, "handleNurtureCron");
async function handleUnsubscribe(request, env) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email)
    return new Response("Missing email", { status: 400 });
  await env.DB.prepare(`UPDATE leads SET unsubscribed = 1, unsubscribed_at = datetime('now') WHERE email = ?`).bind(email.toLowerCase()).run();
  return new Response(`<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#060807;color:#edf5f0;"><h2 style="color:#4fd28c;">Unsubscribed \u2713</h2><p style="color:rgba(237,245,240,.6);">You've been removed from this list.</p></body></html>`, { headers: { "Content-Type": "text/html" } });
}
__name(handleUnsubscribe, "handleUnsubscribe");
__name2(handleUnsubscribe, "handleUnsubscribe");
async function handleLeadSubmit(request, env) {
  if (request.method !== "POST")
    return Response.json({ error: "POST only" }, { status: 405 });
  try {
    let name, email, casl_consent;
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const b = await request.json();
      name = b.name;
      email = b.email;
      casl_consent = b.casl_consent ? 1 : 0;
    } else {
      const b = await request.formData();
      name = b.get("name");
      email = b.get("email");
      casl_consent = b.get("casl_consent") ? 1 : 0;
    }
    if (!email?.includes("@"))
      return Response.json({ error: "Valid email required" }, { status: 400 });
    if (!name?.trim())
      return Response.json({ error: "Name required" }, { status: 400 });
    if (!casl_consent)
      return Response.json({ error: "Consent required under CASL" }, { status: 400 });
    const ip = request.headers.get("CF-Connecting-IP") || null;
    const result = await env.DB.prepare(`INSERT INTO leads (name, email, casl_consent, source, ip_address) VALUES (?, ?, ?, ?, ?)`).bind(name.trim(), email.trim().toLowerCase(), casl_consent, "landing-page", ip).run();
    const leadId = result.meta.last_row_id;
    let emailSent = false;
    try {
      await sendLeadMagnetEmail(env, { name: name.trim(), email: email.trim() });
      await env.DB.prepare(`UPDATE leads SET email_sent = 1, email_sent_at = datetime('now') WHERE id = ?`).bind(leadId).run();
      emailSent = true;
    } catch (e) {
      console.error("Lead email fail:", e.message);
    }
    if (!ct.includes("application/json")) {
      return Response.redirect("https://naturalalternatives.ca/thank-you.html", 303);
    }
    return Response.json({ success: true, lead_id: leadId, email_sent: emailSent });
  } catch (err) {
    console.error("Lead submit error:", err);
    return Response.json({ error: "Submission failed" }, { status: 500 });
  }
}
__name(handleLeadSubmit, "handleLeadSubmit");
__name2(handleLeadSubmit, "handleLeadSubmit");
async function handleLeadsAdmin(request, env) {
  const { results } = await env.DB.prepare(`SELECT id, name, email, casl_consent, source, email_sent, created_at FROM leads ORDER BY created_at DESC LIMIT 500`).all();
  return Response.json({ leads: results });
}
__name(handleLeadsAdmin, "handleLeadsAdmin");
__name2(handleLeadsAdmin, "handleLeadsAdmin");
function getOcosProductMap(env) {
  const map = {};
  if (env.OCOS_T1_PRODUCT_ID)
    map[env.OCOS_T1_PRODUCT_ID] = "OCOS_T1";
  if (env.OCOS_T2_PRODUCT_ID)
    map[env.OCOS_T2_PRODUCT_ID] = "OCOS_T2";
  if (env.OCOS_T3_PRODUCT_ID)
    map[env.OCOS_T3_PRODUCT_ID] = "OCOS_T3";
  if (env.OCOS_BUNDLE_PRODUCT_ID)
    map[env.OCOS_BUNDLE_PRODUCT_ID] = "OCOS_BUNDLE";
  return map;
}
__name(getOcosProductMap, "getOcosProductMap");
__name2(getOcosProductMap, "getOcosProductMap");
async function getStripeLineItems(sessionId, env) {
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?limit=10`, {
    headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` }
  });
  if (!res.ok)
    throw new Error(`Stripe line_items fetch failed: ${await res.text()}`);
  const data = await res.json();
  return data.data || [];
}
__name(getStripeLineItems, "getStripeLineItems");
__name2(getStripeLineItems, "getStripeLineItems");
function matchOcosProduct(productId, env) {
  return getOcosProductMap(env)[productId] || null;
}
__name(matchOcosProduct, "matchOcosProduct");
__name2(matchOcosProduct, "matchOcosProduct");
function ocosT1EmailHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#333333;line-height:1.75;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dddddd;"><tr><td style="background:#1a1a1a;border-bottom:2px solid #2E7D32;padding:18px 32px;"><span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#2E7D32;">OCOS\u2122 \xB7 Natural Alternatives</span></td></tr><tr><td style="background:#1a1a1a;padding:40px 32px 32px;"><table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:rgba(46,125,50,0.15);border:1px solid rgba(46,125,50,0.4);padding:6px 16px;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#2E7D32;">\u2713 &nbsp;Purchase Confirmed</span></td></tr></table><div style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:12px;">You're in the system.</div><div style="font-size:14px;color:rgba(255,255,255,0.5);">Your access email is here. Here's exactly what to do next.</div></td></tr><tr><td style="padding:32px;"><p style="margin:0 0 16px;font-size:15px;color:#555555;">Thank you for your purchase. Your <strong style="color:#333333;">Ontario Compliance Operating System\u2122</strong> access is ready.</p><p style="margin:0 0 24px;font-size:15px;color:#555555;">Please read your Foundation Guide in full before using any generation tools. The system is sequential by design \u2014 <strong style="color:#333333;">orientation before generation</strong>.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:14px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Tier 1 \u2014 Foundation Guide</span><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/ocos-t1-hub.html" style="font-family:'Courier New',monospace;font-size:13px;color:#333333;text-decoration:none;">naturalalternatives.ca \u2014 T1 Document Hub</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:14px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Tier 1 \u2014 Notion Workspace</span><a href="https://www.notion.so/300af11add63802a99f2e54df827046a" style="font-family:'Courier New',monospace;font-size:13px;color:#333333;text-decoration:none;">notion.so \u2014 OCOS T1 Workspace</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;margin-bottom:24px;"><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">1</span></td><td style="padding:16px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Check your inbox</strong><br><span style="font-size:13px;color:#555555;">This email contains your workspace link above. If you don't see it within 5 minutes, check your spam folder.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">Within 5 minutes of purchase</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">2</span></td><td style="padding:16px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Read the Foundation Guide first</strong><br><span style="font-size:13px;color:#555555;">Open your Tier 1 document and read it in full before accessing your Notion workspace. The system is designed to be used in sequence.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">Before using any Notion workspace</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">3</span></td><td style="padding:16px 20px;"><strong style="font-size:14px;color:#333333;">Access your Notion workspace</strong><br><span style="font-size:13px;color:#555555;">Once orientation is complete, use the Notion link above. Start with the Company Master Prompt setup \u2014 everything else follows from there.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">After completing Tier 1 orientation</span></td></tr></table><p style="font-size:12px;color:#888888;line-height:1.7;border-top:1px solid #dddddd;padding-top:20px;margin:0 0 20px;">The Ontario Compliance Operating System\u2122 is an educational and organizational framework. It does not constitute legal advice. The employer retains full responsibility for compliance with all applicable Ontario legislation. All generated documents are drafts until reviewed, approved, and implemented by the employer.</p><p style="font-size:13px;color:#555555;margin:0;">Natural Alternatives \xB7 Ontario Compliance Division<br><a href="https://naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">naturalalternatives.ca</a> \xB7 <a href="mailto:info@naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">info@naturalalternatives.ca</a></p></td></tr><tr><td style="background:#1a1a1a;padding:16px 32px;text-align:center;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.25);"><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/privacy-policy.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Privacy Policy</a> &nbsp;\xB7&nbsp; <a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/terms-of-service.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Terms of Service</a> &nbsp;\xB7&nbsp; \xA9 Natural Alternatives</span></td></tr></table></td></tr></table></body></html>`;
}
__name(ocosT1EmailHtml, "ocosT1EmailHtml");
__name2(ocosT1EmailHtml, "ocosT1EmailHtml");
function ocosT2EmailHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#333333;line-height:1.75;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dddddd;"><tr><td style="background:#1a1a1a;border-bottom:2px solid #2E7D32;padding:18px 32px;"><span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#2E7D32;">OCOS\u2122 \xB7 Natural Alternatives</span></td></tr><tr><td style="background:#1a1a1a;padding:40px 32px 32px;"><table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:rgba(46,125,50,0.15);border:1px solid rgba(46,125,50,0.4);padding:6px 16px;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#2E7D32;">\u2713 &nbsp;Tier 2 Access Confirmed</span></td></tr></table><div style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:12px;">Your generation workspace is ready.</div><div style="font-size:14px;color:rgba(255,255,255,0.5);">Access your Tier 2 AI-Driven Compliance Generation Framework below.</div></td></tr><tr><td style="padding:32px;"><p style="margin:0 0 16px;font-size:15px;color:#555555;">Thank you for your purchase. Your <strong style="color:#333333;">OCOS Tier 2 \u2014 AI-Driven Compliance Generation Framework</strong> is ready to use.</p><p style="margin:0 0 24px;font-size:15px;color:#555555;">Read the Tier 2 guide before opening your Notion workspace. The RCCF framework and Company Master Prompt setup are covered there \u2014 they determine the quality of every document you generate.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:14px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Tier 2 \u2014 Generation Framework Guide</span><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/ocos-t2-hub.html" style="font-family:'Courier New',monospace;font-size:13px;color:#333333;text-decoration:none;">naturalalternatives.ca \u2014 T2 Access Hub</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:14px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Tier 2 \u2014 Notion Generation Workspace</span><a href="https://www.notion.so/2fdaf11add63808f8104ca347d88949c" style="font-family:'Courier New',monospace;font-size:13px;color:#333333;text-decoration:none;">notion.so \u2014 OCOS T2 Workspace</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;margin-bottom:24px;"><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">1</span></td><td style="padding:16px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Read the Tier 2 Guide first</strong><br><span style="font-size:13px;color:#555555;">Open your T2 Access Hub and read the guide. Sections 3 and 4 \u2014 the RCCF Framework and Company Master Prompt \u2014 are essential before you start generating.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">Before opening Notion</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">2</span></td><td style="padding:16px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Complete your Company Master Prompt</strong><br><span style="font-size:13px;color:#555555;">In Notion, fill in the Company Master Prompt template with your business details, equipment, hazard profile, and workforce size. Every generation session starts with this.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">First session \u2014 approximately 30 minutes</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">3</span></td><td style="padding:16px 20px;"><strong style="font-size:14px;color:#333333;">Generate, review, approve</strong><br><span style="font-size:13px;color:#555555;">Select a generator from the Compliance Library. One generator per session. Review every output against your actual workplace before approving. Approved documents move to Tier 3.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">Ongoing generation workflow</span></td></tr></table><p style="font-size:12px;color:#888888;line-height:1.7;border-top:1px solid #dddddd;padding-top:20px;margin:0 0 20px;">The Ontario Compliance Operating System\u2122 is an educational and organizational framework. It does not constitute legal advice. The employer retains full responsibility for compliance with all applicable Ontario legislation. All generated documents are drafts until reviewed, approved, and implemented by the employer.</p><p style="font-size:13px;color:#555555;margin:0;">Natural Alternatives \xB7 Ontario Compliance Division<br><a href="https://naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">naturalalternatives.ca</a> \xB7 <a href="mailto:info@naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">info@naturalalternatives.ca</a></p></td></tr><tr><td style="background:#1a1a1a;padding:16px 32px;text-align:center;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.25);"><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/privacy-policy.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Privacy Policy</a> &nbsp;\xB7&nbsp; <a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/terms-of-service.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Terms of Service</a> &nbsp;\xB7&nbsp; \xA9 Natural Alternatives</span></td></tr></table></td></tr></table></body></html>`;
}
__name(ocosT2EmailHtml, "ocosT2EmailHtml");
__name2(ocosT2EmailHtml, "ocosT2EmailHtml");
function ocosT3EmailHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#333333;line-height:1.75;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dddddd;"><tr><td style="background:#1a1a1a;border-bottom:2px solid #2E7D32;padding:18px 32px;"><span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#2E7D32;">OCOS\u2122 \xB7 Natural Alternatives</span></td></tr><tr><td style="background:#1a1a1a;padding:40px 32px 32px;"><table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:rgba(46,125,50,0.15);border:1px solid rgba(46,125,50,0.4);padding:6px 16px;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#2E7D32;">\u2713 &nbsp;Tier 3 Access Confirmed</span></td></tr></table><div style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:12px;">Your operations workspace is ready.</div><div style="font-size:14px;color:rgba(255,255,255,0.5);">Access your Tier 3 Compliance Operations System below.</div></td></tr><tr><td style="padding:32px;"><p style="margin:0 0 16px;font-size:15px;color:#555555;">Thank you for your purchase. Your <strong style="color:#333333;">OCOS Tier 3 \u2014 Compliance Operations System</strong> is ready to activate.</p><p style="margin:0 0 24px;font-size:15px;color:#555555;">Tier 3 is activated after Tier 1 orientation is complete and your first documents have been generated and approved through Tier 2. Read the Tier 3 guide before opening the workspace.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:14px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Tier 3 \u2014 Compliance Operations Guide</span><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/ocos-t3-hub.html" style="font-family:'Courier New',monospace;font-size:13px;color:#333333;text-decoration:none;">naturalalternatives.ca \u2014 T3 Access Hub</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:14px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Tier 3 \u2014 Notion Operations Workspace</span><a href="https://www.notion.so/2fdaf11add6380ce8e90e09db23ea7df" style="font-family:'Courier New',monospace;font-size:13px;color:#333333;text-decoration:none;">notion.so \u2014 OCOS T3 Workspace</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;margin-bottom:24px;"><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">1</span></td><td style="padding:16px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Confirm Tiers 1 and 2 are complete</strong><br><span style="font-size:13px;color:#555555;">Tier 3 is only activated when the Foundation Guide has been signed and at least one initial document suite has been generated and approved through Tier 2.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">Prerequisite check</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">2</span></td><td style="padding:16px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Read the Tier 3 Guide</strong><br><span style="font-size:13px;color:#555555;">Open the T3 Access Hub and read the Compliance Operations System guide. Pay attention to the Document Control Register setup and record retention requirements.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">Before opening Notion</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:16px;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#ffffff;">3</span></td><td style="padding:16px 20px;"><strong style="font-size:14px;color:#333333;">Activate the workspace and file your first documents</strong><br><span style="font-size:13px;color:#555555;">Open the Start Here guide in Notion. Set up your Document Control Register, populate the Compliance Calendar, and file your Tier 2-approved documents. This activates the system.</span><br><span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#2E7D32;margin-top:6px;display:block;">First 30 minutes in workspace</span></td></tr></table><p style="font-size:12px;color:#888888;line-height:1.7;border-top:1px solid #dddddd;padding-top:20px;margin:0 0 20px;">The Ontario Compliance Operating System\u2122 is an educational and organizational framework. It does not constitute legal advice. The employer retains full responsibility for compliance with all applicable Ontario legislation.</p><p style="font-size:13px;color:#555555;margin:0;">Natural Alternatives \xB7 Ontario Compliance Division<br><a href="https://naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">naturalalternatives.ca</a> \xB7 <a href="mailto:info@naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">info@naturalalternatives.ca</a></p></td></tr><tr><td style="background:#1a1a1a;padding:16px 32px;text-align:center;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.25);"><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/privacy-policy.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Privacy Policy</a> &nbsp;\xB7&nbsp; <a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/terms-of-service.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Terms of Service</a> &nbsp;\xB7&nbsp; \xA9 Natural Alternatives</span></td></tr></table></td></tr></table></body></html>`;
}
__name(ocosT3EmailHtml, "ocosT3EmailHtml");
__name2(ocosT3EmailHtml, "ocosT3EmailHtml");
function ocosBundleEmailHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#333333;line-height:1.75;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dddddd;"><tr><td style="background:#1a1a1a;border-bottom:2px solid #2E7D32;padding:18px 32px;"><span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#2E7D32;">OCOS\u2122 \xB7 Natural Alternatives</span></td></tr><tr><td style="background:#1a1a1a;padding:40px 32px 32px;"><table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:rgba(46,125,50,0.15);border:1px solid rgba(46,125,50,0.4);padding:6px 16px;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#2E7D32;">\u2713 &nbsp;Full Bundle Access Confirmed</span></td></tr></table><div style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:12px;">All three tiers are yours.</div><div style="font-size:14px;color:rgba(255,255,255,0.5);">Your complete Ontario Compliance Operating System\u2122 access is below \u2014 start with Tier 1.</div></td></tr><tr><td style="padding:32px;"><p style="margin:0 0 16px;font-size:15px;color:#555555;">Thank you for your purchase. You have full access to the complete <strong style="color:#333333;">Ontario Compliance Operating System\u2122</strong> \u2014 all three tiers.</p><p style="margin:0 0 24px;font-size:15px;color:#555555;">The system is sequential. <strong style="color:#333333;">Start with Tier 1.</strong> Do not access Tier 2 or Tier 3 until the Foundation Guide has been reviewed and signed. Each tier builds on the one before it.</p><p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#2E7D32;margin:0 0 8px;">Tier 1 \u2014 Compliance Foundation \xB7 Start Here</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:12px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:4px;">Document Hub</span><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/ocos-t1-hub.html" style="font-family:'Courier New',monospace;font-size:12px;color:#333333;text-decoration:none;">naturalalternatives.ca \u2014 T1 Document Hub</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:#f5f5f5;border-left:3px solid #2E7D32;padding:12px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#2E7D32;margin-bottom:4px;">Notion Workspace</span><a href="https://www.notion.so/300af11add63802a99f2e54df827046a" style="font-family:'Courier New',monospace;font-size:12px;color:#333333;text-decoration:none;">notion.so \u2014 OCOS T1 Workspace</a></td></tr></table><p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#888888;margin:0 0 8px;">Tier 2 \u2014 AI Generation Framework \xB7 After T1 is complete</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;"><tr><td style="background:#f5f5f5;border-left:3px solid #cccccc;padding:12px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888888;margin-bottom:4px;">Access Hub</span><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/ocos-t2-hub.html" style="font-family:'Courier New',monospace;font-size:12px;color:#333333;text-decoration:none;">naturalalternatives.ca \u2014 T2 Access Hub</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:#f5f5f5;border-left:3px solid #cccccc;padding:12px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888888;margin-bottom:4px;">Notion Workspace</span><a href="https://www.notion.so/2fdaf11add63808f8104ca347d88949c" style="font-family:'Courier New',monospace;font-size:12px;color:#333333;text-decoration:none;">notion.so \u2014 OCOS T2 Workspace</a></td></tr></table><p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#888888;margin:0 0 8px;">Tier 3 \u2014 Compliance Operations \xB7 After T2 documents are approved</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;"><tr><td style="background:#f5f5f5;border-left:3px solid #cccccc;padding:12px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888888;margin-bottom:4px;">Access Hub</span><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/ocos-t3-hub.html" style="font-family:'Courier New',monospace;font-size:12px;color:#333333;text-decoration:none;">naturalalternatives.ca \u2014 T3 Access Hub</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td style="background:#f5f5f5;border-left:3px solid #cccccc;padding:12px 18px;"><span style="display:block;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888888;margin-bottom:4px;">Notion Workspace</span><a href="https://www.notion.so/2fdaf11add6380ce8e90e09db23ea7df" style="font-family:'Courier New',monospace;font-size:12px;color:#333333;text-decoration:none;">notion.so \u2014 OCOS T3 Workspace</a></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;margin-bottom:24px;"><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:14px;"><span style="font-family:Georgia,serif;font-size:18px;font-weight:900;color:#ffffff;">1</span></td><td style="padding:14px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Start with Tier 1 \u2014 Foundation Guide</strong><br><span style="font-size:13px;color:#555555;">Open the T1 Document Hub. Read the Foundation Guide in full and complete the Employer Implementation Checklist before proceeding to Tier 2.</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:14px;"><span style="font-family:Georgia,serif;font-size:18px;font-weight:900;color:#ffffff;">2</span></td><td style="padding:14px 20px;border-bottom:1px solid #dddddd;"><strong style="font-size:14px;color:#333333;">Move to Tier 2 \u2014 Generate your documents</strong><br><span style="font-size:13px;color:#555555;">Once T1 is signed, open the T2 Hub. Complete your Company Master Prompt and begin generating your compliance document suite using the RCCF generator library.</span></td></tr><tr><td width="56" style="background:#1B5E20;text-align:center;vertical-align:middle;padding:14px;"><span style="font-family:Georgia,serif;font-size:18px;font-weight:900;color:#ffffff;">3</span></td><td style="padding:14px 20px;"><strong style="font-size:14px;color:#333333;">Activate Tier 3 \u2014 Run the system</strong><br><span style="font-size:13px;color:#555555;">After your first T2 documents are approved, activate the T3 Operations workspace. File your documents, set up your training records, and populate the compliance calendar.</span></td></tr></table><p style="font-size:12px;color:#888888;line-height:1.7;border-top:1px solid #dddddd;padding-top:20px;margin:0 0 20px;">The Ontario Compliance Operating System\u2122 is an educational and organizational framework. It does not constitute legal advice. The employer retains full responsibility for compliance with all applicable Ontario legislation. All generated documents are drafts until reviewed, approved, and implemented by the employer.</p><p style="font-size:13px;color:#555555;margin:0;">Natural Alternatives \xB7 Ontario Compliance Division<br><a href="https://naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">naturalalternatives.ca</a> \xB7 <a href="mailto:info@naturalalternatives.ca" style="color:#2E7D32;text-decoration:none;">info@naturalalternatives.ca</a></p></td></tr><tr><td style="background:#1a1a1a;padding:16px 32px;text-align:center;"><span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.25);"><a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/privacy-policy.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Privacy Policy</a> &nbsp;\xB7&nbsp; <a href="https://naturalalternatives.ca/ontario-compliance-operating-system-/terms-of-service.html" style="color:rgba(46,125,50,0.7);text-decoration:none;">Terms of Service</a> &nbsp;\xB7&nbsp; \xA9 Natural Alternatives</span></td></tr></table></td></tr></table></body></html>`;
}
__name(ocosBundleEmailHtml, "ocosBundleEmailHtml");
__name2(ocosBundleEmailHtml, "ocosBundleEmailHtml");
var OCOS_SUBJECTS = {
  OCOS_T1: "Your OCOS Tier 1 Access \u2014 Ontario Compliance Operating System\u2122",
  OCOS_T2: "Your OCOS Tier 2 Access \u2014 Ontario Compliance Operating System\u2122",
  OCOS_T3: "Your OCOS Tier 3 Access \u2014 Ontario Compliance Operating System\u2122",
  OCOS_BUNDLE: "Your OCOS Bundle Access \u2014 Ontario Compliance Operating System\u2122"
};
var OCOS_TEMPLATES = { OCOS_T1: ocosT1EmailHtml, OCOS_T2: ocosT2EmailHtml, OCOS_T3: ocosT3EmailHtml, OCOS_BUNDLE: ocosBundleEmailHtml };
async function sendOcosEmail(env, toEmail, ocosTier) {
  const templateFn = OCOS_TEMPLATES[ocosTier];
  if (!templateFn)
    throw new Error(`Unknown OCOS tier: ${ocosTier}`);
  return sendEmail(env, {
    from: "Natural Alternatives <info@naturalalternatives.ca>",
    to: toEmail,
    reply_to: "info@naturalalternatives.ca",
    subject: OCOS_SUBJECTS[ocosTier],
    html: templateFn(),
    text: "Your OCOS access is ready. Visit naturalalternatives.ca to access your workspace. Questions? info@naturalalternatives.ca"
  });
}
__name(sendOcosEmail, "sendOcosEmail");
__name2(sendOcosEmail, "sendOcosEmail");
async function verifyStripeSignature(payload, signature, secret) {
  const parts = {};
  signature.split(",").forEach((p) => {
    const [k, v] = p.split("=");
    parts[k] = v;
  });
  const timestamp = parts["t"];
  const expectedSig = parts["v1"];
  if (!timestamp || !expectedSig)
    throw new Error("Invalid signature format");
  if (Math.floor(Date.now() / 1e3) - parseInt(timestamp) > 300)
    throw new Error("Timestamp too old");
  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const computed = Array.from(new Uint8Array(sigBytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (computed !== expectedSig)
    throw new Error("Signature verification failed");
}
__name(verifyStripeSignature, "verifyStripeSignature");
__name2(verifyStripeSignature, "verifyStripeSignature");
async function handleStripeWebhook(request, env) {
  try {
    const payload = await request.text();
    if (env.STRIPE_WEBHOOK_SECRET) {
      const sig = request.headers.get("stripe-signature");
      if (!sig)
        return Response.json({ error: "Missing stripe-signature" }, { status: 400 });
      try {
        await verifyStripeSignature(payload, sig, env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    }
    const event = JSON.parse(payload);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.payment_status !== "paid") {
        console.log(`\u23F3 Session ${session.id} not yet paid (${session.payment_status}) \u2014 skipping`);
        return Response.json({ received: true, status: "awaiting_payment" });
      }
      const email = session.customer_details?.email || session.customer_email || "";
      const name = session.customer_details?.name || "";
      const tier = session.metadata?.product_tier || session.metadata?.tier || "SOLO";
      const amount = session.amount_total || 0;
      const currency = session.currency || "cad";
      let ocosTier = null;
      try {
        const lineItems = await getStripeLineItems(session.id, env);
        for (const item of lineItems) {
          const productId = item.price?.product;
          if (productId) {
            const match = matchOcosProduct(productId, env);
            if (match) {
              ocosTier = match;
              console.log(`\u{1F3AF} OCOS product: ${productId} \u2192 ${ocosTier}`);
              break;
            }
          }
        }
      } catch (e) {
        console.error("Line items fetch failed:", e.message);
      }
      if (ocosTier && email) {
        console.log(`\u{1F4E7} Sending OCOS ${ocosTier} email to ${email}`);
        try {
          await sendOcosEmail(env, email, ocosTier);
          console.log(`\u2705 OCOS ${ocosTier} email sent to ${email}`);
        } catch (e) {
          console.error(`OCOS email failed: ${e.message}`);
        }
        try {
          await sendSaleNotification(env, { email, name, tier: ocosTier, amount, currency, orderId: session.id });
        } catch (e) {
          console.error("Sale notification failed:", e.message);
        }
        return Response.json({ received: true, ocos: ocosTier });
      }
      if (!TIER_PREFIXES[tier.toUpperCase()])
        return Response.json({ received: true, warning: "Unknown tier" });
      const order = await createOrder(env.DB, { email, customer_name: name, tier: tier.toUpperCase(), amount, currency, stripe_payment_id: session.payment_intent || session.id, stripe_session_id: session.id });
      try {
        await sendSaleNotification(env, { email, name, tier: tier.toUpperCase(), amount, currency, orderId: order.id });
      } catch (e) {
        console.error("Notification fail:", e.message);
      }
      const autoApprove = await getSetting(env.DB, "auto_approve");
      if (autoApprove === "true") {
        const days = session.metadata?.duration_days ? parseInt(session.metadata.duration_days) : void 0;
        const key = generateLicenseKey(tier.toUpperCase(), days);
        const lic = await createLicense(env.DB, { key, tier: tier.toUpperCase(), email, customer_name: name, source: "stripe", stripe_payment_id: session.payment_intent || session.id });
        await approveOrder(env.DB, order.id, key, lic.id, "auto", "Auto-approved");
        // FC provision hook — fire-and-forget, non-blocking
        if (env.FC_WORKER_URL && env.FC_INTERNAL_SECRET && ["OCOS2","OCOS3"].includes(tier.toUpperCase())) {
          const fcTier = tier.toUpperCase() === "OCOS3" ? "T3" : "T2";
          fetch(env.FC_WORKER_URL + "/fc/provision", { method: "POST", headers: { "Content-Type": "application/json", "X-FC-Internal": env.FC_INTERNAL_SECRET }, body: JSON.stringify({ licenseId: key, tier: fcTier, clientName: name }) }).catch(e => console.error("FC provision failed:", e.message));
        }
        if (email) {
          try {
            await sendLicenseEmail(env, email, key, tier.toUpperCase(), name);
          } catch (e) {
            console.error("License email fail:", e.message);
          }
        }
      }
    }
    return Response.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
__name(handleStripeWebhook, "handleStripeWebhook");
__name2(handleStripeWebhook, "handleStripeWebhook");
async function handleLicenseValidation(request, env) {
  try {
    const { key } = await request.json();
    if (!key)
      return Response.json({ valid: false, error: "No key provided" }, { status: 400 });
    const license = await getLicenseByKey(env.DB, key.trim().toUpperCase());
    if (!license)
      return Response.json({ valid: false, reason: "not_found" });
    if (!license.is_active)
      return Response.json({ valid: false, reason: "deactivated" });
    await touchLicense(env.DB, license.id);
    return Response.json({ valid: true, tier: license.tier, key: license.key, created: license.created_at });
  } catch (err) {
    return Response.json({ valid: false, error: "Validation failed" }, { status: 500 });
  }
}
__name(handleLicenseValidation, "handleLicenseValidation");
__name2(handleLicenseValidation, "handleLicenseValidation");
var FAQ = [
  { keywords: ["invalid", "key invalid", "not working", "key not work"], answer: "Check the key is entered exactly as provided \u2014 format is [PREFIX]-[NUMBER]-[4 CHARACTERS]. Copy-paste directly from your purchase email. If still invalid, email info@naturalalternatives.ca with the key and your purchase email.", escalate: false },
  { keywords: ["lost", "lost key", "missing key", "resend key"], answer: 'Reply to your original purchase confirmation email to get your key resent. Or email info@naturalalternatives.ca with subject "License Key Request".', escalate: false },
  { keywords: ["expired", "renewal", "renew"], answer: "Fleet Fleet licenses renew annually. Your data stays intact on expiry. Renew at the pricing page or email info@naturalalternatives.ca \u2014 new key within one business day.", escalate: false },
  { keywords: ["activate", "enter key", "paste key"], answer: "Open the Fleet Logbook app \u2192 Settings \u2192 License \u2192 paste your key \u2192 click Activate.", escalate: false },
  { keywords: ["two devices", "multiple devices", "another device", "second device"], answer: "Fleet Solo = one device. Fleet Fleet = unlimited devices (each stores data independently, no sync). Upgrade to Fleet Fleet for multi-device.", escalate: false },
  { keywords: ["addon", "add-on", "extra machine", "stack"], answer: "Settings \u2192 License \u2192 enter your Add-on key alongside your existing Solo key. Each key adds one machine slot \u2014 multiple keys can be stacked.", escalate: false },
  { keywords: ["get started", "where to start", "first step", "set up", "beginning"], answer: "Fleet Assets \u2192 add your first machine \u2192 QR Code Generator \u2192 generate and print QR \u2192 scan with phone to start your first shift log.", escalate: false },
  { keywords: ["pm scheduling", "preventive maintenance", "service interval"], answer: "Fleet Assets \u2192 select machine \u2192 PM Schedule tab. Enter current hour reading as baseline. App tracks hours and alerts when service is due.", escalate: false },
  { keywords: ["qr", "qr code", "scan", "operator scanned"], answer: "QR codes are device-specific. Confirm the QR was generated from the app (not cached) and the operator is using the same device where the app is stored.", escalate: false },
  { keywords: ["export", "mol inspection", "inspection records", "report"], answer: "Fleet Reports \u2192 select date range \u2192 Export. For pre-shift records: Daily Logs \u2192 filter by machine and date \u2192 Print.", escalate: false },
  { keywords: ["deleted", "accidentally deleted", "recover"], answer: "Deleted entries cannot be recovered from within the app. Recommend weekly report exports as backup. Contact info@naturalalternatives.ca for further help.", escalate: false },
  { keywords: ["difference", "solo vs fleet", "which license", "which plan"], answer: "Fleet Solo ($597 one-time) = 1 machine, 1 device. Fleet Fleet ($1,497/yr) = unlimited machines, unlimited devices. More than 2 machines or multi-device = Fleet Fleet is more cost-effective.", escalate: false },
  { keywords: ["upgrade", "upgrade solo", "upgrade to fleet"], answer: "Yes \u2014 email info@naturalalternatives.ca for a pro-rated upgrade. Your existing data is preserved.", escalate: true },
  { keywords: ["fleet price", "fleet cost", "how much", "pricing"], answer: "Fleet Solo: $597 CAD one-time. Fleet Add-on: $247 CAD (+1 machine). Fleet Fleet: $1,497 CAD/year (unlimited). OCOS T1: $397. T2: $697. T3: $597. Bundle: $1,297.", escalate: false },
  { keywords: ["workspace", "haven't received", "no workspace", "ocos access"], answer: "OCOS workspaces are delivered within one business day. If more than one business day has passed, email info@naturalalternatives.ca with your order confirmation number.", escalate: true },
  { keywords: ["notion", "request access", "can't access"], answer: "Log into Notion with the same email used to purchase. Create a free Notion account at notion.so if needed. Contact info@naturalalternatives.ca if it persists.", escalate: false },
  { keywords: ["pre-shift", "inspection record", "o.reg 213", "mol"], answer: "O.Reg 213/91 requires documented inspection before operating mobile equipment. The T1 pre-shift log provides the 10-item MOL checklist.", escalate: false },
  { keywords: ["wsib", "clearance", "clearance certificate", "subcontractor"], answer: "Request a WSIB Clearance Certificate before paying any sub \u2014 free at wsib.ca, takes 2 min. Under WSIA s.141 you can be personally liable for a sub's unpaid balance.", escalate: false },
  { keywords: ["itc", "input tax credit", "hst credit"], answer: "An ITC recovers HST paid on business purchases over 50% for commercial use. Equipment, fuel, tools, subs all qualify. Personal-use portion is not claimable.", escalate: false },
  { keywords: ["cca", "depreciation", "class 38", "excavator"], answer: "Most construction equipment = CCA Class 38 (30% declining balance). Road vehicles = Class 10/10.1. Half-year rule applies in year of purchase.", escalate: false },
  { keywords: ["refund", "return", "money back"], answer: "All purchases are non-refundable per our Terms of Service. For billing disputes email info@naturalalternatives.ca.", escalate: true },
  { keywords: ["receipt", "invoice", "confirmation email"], answer: "Confirmations are sent by Stripe to your checkout email. Check spam. If 24+ hours with no confirmation, email info@naturalalternatives.ca with your purchase date and amount.", escalate: true },
  { keywords: ["ocos price", "t1 price", "t2 price", "t3 price", "bundle"], answer: "OCOS T1: $397. T2: $697. T3: $597. Bundle (T1+T2+T3): $1,297 (saves $394). All one-time, workspace within 1 business day.", escalate: false },
  { keywords: ["partner", "deploy client", "new client", "partner license"], answer: "Email info@naturalalternatives.ca with client name, client email, and tiers to deploy. Workspace set up within one business day.", escalate: true }
];
function findAnswer(question) {
  const q = question.toLowerCase().trim();
  let best = null, bestScore = 0;
  for (const entry of FAQ) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase()))
        score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  if (best && bestScore > 0)
    return { answer: best.answer, escalate: best.escalate, matched: true };
  return { answer: "I don't have a specific answer for that. Email info@naturalalternatives.ca and we'll get back to you within one business day.", escalate: true, matched: false };
}
__name(findAnswer, "findAnswer");
__name2(findAnswer, "findAnswer");
async function handleSupport(request, env) {
  if (request.method !== "POST")
    return Response.json({ error: "POST only" }, { status: 405 });
  try {
    const { question } = await request.json();
    if (!question?.trim())
      return Response.json({ error: "Question required" }, { status: 400 });
    const result = findAnswer(question);
    return Response.json({ answer: result.answer, escalate: result.escalate, support_email: "info@naturalalternatives.ca" });
  } catch (err) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
__name(handleSupport, "handleSupport");
__name2(handleSupport, "handleSupport");
function handleSupportWidget(request, env) {
  const origin = new URL(request.url).origin;
  const script = `(function(){
'use strict';
var API='${origin}/api/support';
var css=\`#nac-btn{position:fixed;bottom:24px;right:24px;z-index:9000;width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;background:#4fd28c;box-shadow:0 4px 20px rgba(79,210,140,.35);display:flex;align-items:center;justify-content:center;font-size:22px;transition:transform .2s}#nac-btn:hover{transform:scale(1.08)}#nac-panel{position:fixed;bottom:88px;right:24px;z-index:9000;width:340px;max-height:480px;background:#060807;border:1px solid rgba(79,210,140,.15);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.6);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,sans-serif}#nac-panel.open{display:flex}.nac-hdr{background:#0d1210;border-bottom:1px solid rgba(79,210,140,.1);padding:14px 16px;display:flex;align-items:center;justify-content:space-between}.nac-dot{width:8px;height:8px;border-radius:50%;background:#4fd28c;box-shadow:0 0 8px #4fd28c}.nac-title{font-size:13px;font-weight:700;color:#edf5f0;margin-left:10px}.nac-close{background:none;border:none;color:rgba(237,245,240,.4);cursor:pointer;font-size:18px}.nac-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}.nac-msg{max-width:88%;font-size:13px;line-height:1.5;padding:10px 13px;border-radius:12px}.nac-msg.bot{background:#0d1210;color:#edf5f0;border:1px solid rgba(79,210,140,.12);align-self:flex-start;border-bottom-left-radius:4px}.nac-msg.user{background:#4fd28c;color:#041109;align-self:flex-end;border-bottom-right-radius:4px;font-weight:500}.nac-msg a{color:#4fd28c}.nac-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.nac-chip{font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid rgba(79,210,140,.15);color:#4fd28c;background:rgba(79,210,140,.07);cursor:pointer}.nac-input-row{border-top:1px solid rgba(79,210,140,.1);padding:10px 12px;display:flex;gap:8px;align-items:center;background:#0d1210}.nac-input{flex:1;background:#060807;border:1px solid rgba(79,210,140,.12);color:#edf5f0;font-size:13px;padding:8px 12px;border-radius:8px;outline:none;font-family:inherit}.nac-send{background:#4fd28c;color:#041109;border:none;border-radius:8px;width:34px;height:34px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}\`;
var style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
var panel=document.createElement('div');panel.id='nac-panel';
panel.innerHTML='<div class="nac-hdr"><div style="display:flex;align-items:center"><div class="nac-dot"></div><span class="nac-title">NAC OS Support</span></div><button class="nac-close" id="nac-close">\u2715</button></div><div class="nac-msgs" id="nac-msgs"></div><div class="nac-input-row"><input class="nac-input" id="nac-input" type="text" placeholder="Ask a question..." maxlength="300"><button class="nac-send" id="nac-send">\u2192</button></div>';
var btn=document.createElement('button');btn.id='nac-btn';btn.innerHTML='\u{1F4AC}';
document.body.appendChild(panel);document.body.appendChild(btn);
var msgs=document.getElementById('nac-msgs'),inp=document.getElementById('nac-input'),snd=document.getElementById('nac-send');
function addMsg(text,type){var el=document.createElement('div');el.className='nac-msg '+type;el.innerHTML=text;msgs.appendChild(el);msgs.scrollTop=msgs.scrollHeight;return el;}
function addChips(qs){var w=document.createElement('div');w.className='nac-chips';qs.forEach(function(q){var c=document.createElement('button');c.className='nac-chip';c.textContent=q;c.addEventListener('click',function(){inp.value=q;send();});w.appendChild(c);});msgs.appendChild(w);msgs.scrollTop=msgs.scrollHeight;}
function welcome(){addMsg('Hi! I\\'m the NAC OS support assistant. Ask me anything about Fleet Logbook, OCOS, or your license.','bot');addChips(['License key not working','Haven\\'t received my workspace','Solo vs Fleet difference','PM scheduling setup','OCOS T1 pricing']);}
async function send(){var q=inp.value.trim();if(!q)return;inp.value='';snd.disabled=true;addMsg(q,'user');var typing=addMsg('<span>\xB7&nbsp;\xB7&nbsp;\xB7</span>','bot');try{var res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});var d=await res.json();typing.remove();addMsg(d.answer+(d.escalate?' \u2014 <a href="mailto:info@naturalalternatives.ca">info@naturalalternatives.ca</a>':''),'bot');}catch(e){typing.remove();addMsg('Something went wrong. Email <a href="mailto:info@naturalalternatives.ca">info@naturalalternatives.ca</a>','bot');}snd.disabled=false;inp.focus();}
btn.addEventListener('click',function(){panel.classList.toggle('open');if(panel.classList.contains('open')&&msgs.children.length===0)welcome();if(panel.classList.contains('open'))inp.focus();});
document.getElementById('nac-close').addEventListener('click',function(){panel.classList.remove('open');});
snd.addEventListener('click',send);
inp.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
})();`;
  return new Response(script, { headers: { "Content-Type": "application/javascript", "Cache-Control": "public, max-age=3600" } });
}
__name(handleSupportWidget, "handleSupportWidget");
__name2(handleSupportWidget, "handleSupportWidget");
function isAuthorized(request, env) {
  return request.headers.get("X-Admin-Password") === (env.ADMIN_PASSWORD || "admin123");
}
__name(isAuthorized, "isAuthorized");
__name2(isAuthorized, "isAuthorized");
async function handleAdminRoutes(request, env, path) {
  const method = request.method;
  if (path === "/api/admin/login" && method === "POST") {
    const { password } = await request.json();
    if (password === (env.ADMIN_PASSWORD || "admin123"))
      return Response.json({ success: true });
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  if (!isAuthorized(request, env))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    if (path === "/api/admin/stats" && method === "GET")
      return Response.json(await getStats(env.DB));
    if (path === "/api/admin/licenses" && method === "GET")
      return Response.json({ licenses: await getAllLicenses(env.DB) });
    if (path === "/api/admin/leads" && method === "GET")
      return Response.json({ leads: (await env.DB.prepare("SELECT id, name, email, casl_consent, source, email_sent, created_at FROM leads ORDER BY created_at DESC LIMIT 500").all()).results });
    if (path === "/api/admin/licenses/generate" && method === "POST") {
      const { tier, email, name, duration_days } = await request.json();
      if (!tier || !TIER_PREFIXES[tier.toUpperCase()])
        return Response.json({ error: "Invalid tier" }, { status: 400 });
      const key = generateLicenseKey(tier.toUpperCase(), duration_days);
      const license = await createLicense(env.DB, { key, tier: tier.toUpperCase(), email: email || "", customer_name: name || "", source: "manual", stripe_payment_id: null });
      if (email) {
        try {
          await sendLicenseEmail(env, email, key, tier.toUpperCase(), name);
        } catch (e) {
        }
      }
      return Response.json({ success: true, license });
    }
    const deactivateMatch = path.match(/^\/api\/admin\/licenses\/(\d+)\/deactivate$/);
    if (deactivateMatch && method === "POST") {
      await deactivateLicense(env.DB, parseInt(deactivateMatch[1]));
      return Response.json({ success: true });
    }
    const activateMatch = path.match(/^\/api\/admin\/licenses\/(\d+)\/activate$/);
    if (activateMatch && method === "POST") {
      await activateLicense(env.DB, parseInt(activateMatch[1]));
      return Response.json({ success: true });
    }
    const deleteMatch = path.match(/^\/api\/admin\/licenses\/(\d+)$/);
    if (deleteMatch && method === "DELETE") {
      await deleteLicense(env.DB, parseInt(deleteMatch[1]));
      return Response.json({ success: true });
    }
    if (path === "/api/admin/orders" && method === "GET") {
      const status = new URL(request.url).searchParams.get("status");
      return Response.json({ orders: await getOrders(env.DB, status) });
    }
    const approveMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/approve$/);
    if (approveMatch && method === "POST") {
      const orderId = parseInt(approveMatch[1]);
      const order = await getOrderById(env.DB, orderId);
      if (!order)
        return Response.json({ error: "Order not found" }, { status: 404 });
      if (order.order_status !== "pending")
        return Response.json({ error: `Order already ${order.order_status}` }, { status: 400 });
      let notes = "";
      try {
        notes = (await request.json()).notes || "";
      } catch (e) {
      }
      const key = generateLicenseKey(order.tier);
      const lic = await createLicense(env.DB, { key, tier: order.tier, email: order.email, customer_name: order.customer_name, source: "stripe", stripe_payment_id: order.stripe_payment_id });
      await approveOrder(env.DB, orderId, key, lic.id, "admin", notes);
      let emailSent = false;
      if (order.email) {
        try {
          await sendLicenseEmail(env, order.email, key, order.tier, order.customer_name);
          emailSent = true;
        } catch (e) {
        }
      }
      return Response.json({ success: true, license_key: key, email_sent: emailSent, order_id: orderId });
    }
    const rejectMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/reject$/);
    if (rejectMatch && method === "POST") {
      const orderId = parseInt(rejectMatch[1]);
      const order = await getOrderById(env.DB, orderId);
      if (!order)
        return Response.json({ error: "Order not found" }, { status: 404 });
      let notes = "";
      try {
        notes = (await request.json()).notes || "";
      } catch (e) {
      }
      await rejectOrder(env.DB, orderId, "admin", notes);
      return Response.json({ success: true, order_id: orderId });
    }
    const resendMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/resend$/);
    if (resendMatch && method === "POST") {
      const order = await getOrderById(env.DB, parseInt(resendMatch[1]));
      if (!order || order.order_status !== "approved" || !order.license_key)
        return Response.json({ error: "Cannot resend" }, { status: 400 });
      try {
        await sendLicenseEmail(env, order.email, order.license_key, order.tier, order.customer_name);
        return Response.json({ success: true, email_sent: true });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }
    if (path === "/api/admin/settings" && method === "GET")
      return Response.json({ auto_approve: await getSetting(env.DB, "auto_approve") === "true" });
    if (path === "/api/admin/settings" && method === "POST") {
      const { auto_approve } = await request.json();
      if (auto_approve !== void 0)
        await setSetting(env.DB, "auto_approve", auto_approve ? "true" : "false");
      return Response.json({ success: true });
    }
    return Response.json({ error: "Not found", path }, { status: 404 });
  } catch (err) {
    console.error("Admin error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
__name(handleAdminRoutes, "handleAdminRoutes");
__name2(handleAdminRoutes, "handleAdminRoutes");
async function handleDashboardStats(request, env) {
  if (!isAuthorized(request, env))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const revenueRow = await env.DB.prepare(`SELECT COALESCE(SUM(CASE WHEN order_status='approved' THEN amount ELSE 0 END),0) as total_revenue, COUNT(CASE WHEN order_status='approved' THEN 1 END) as total_sales, COUNT(CASE WHEN order_status='pending' THEN 1 END) as pending_orders, COUNT(*) as total_orders FROM orders`).first();
    const monthlyRev = await env.DB.prepare(`SELECT COALESCE(SUM(amount),0) as revenue FROM orders WHERE order_status='approved' AND created_at >= datetime('now','-30 days')`).first();
    const { results: weekly } = await env.DB.prepare(`SELECT CASE WHEN created_at >= datetime('now','-7 days') THEN 'Week 4' WHEN created_at >= datetime('now','-14 days') THEN 'Week 3' WHEN created_at >= datetime('now','-21 days') THEN 'Week 2' ELSE 'Week 1' END as week, COALESCE(SUM(amount),0) as revenue, COUNT(*) as sales FROM orders WHERE order_status='approved' AND created_at >= datetime('now','-28 days') GROUP BY week ORDER BY MIN(created_at)`).all();
    const { results: byTier } = await env.DB.prepare(`SELECT tier, COUNT(*) as count, COALESCE(SUM(amount),0) as revenue FROM orders WHERE order_status='approved' GROUP BY tier ORDER BY revenue DESC LIMIT 8`).all();
    const licRow = await env.DB.prepare(`SELECT COUNT(*) as total, SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END) as active, SUM(CASE WHEN source='stripe' THEN 1 ELSE 0 END) as from_stripe FROM licenses`).first();
    const leadRow = await env.DB.prepare(`SELECT COUNT(*) as total, SUM(CASE WHEN email_sent=1 THEN 1 ELSE 0 END) as converted, SUM(CASE WHEN unsubscribed=1 THEN 1 ELSE 0 END) as unsubscribed, SUM(CASE WHEN day7_sent=1 THEN 1 ELSE 0 END) as sequence_complete FROM leads`).first();
    const { results: recentOrders } = await env.DB.prepare(`SELECT id, email, customer_name, tier, amount, currency, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 10`).all();
    const totalLeads = leadRow?.total || 0;
    const totalSales = revenueRow?.total_sales || 0;
    const conversionRate = totalLeads > 0 ? (totalSales / totalLeads * 100).toFixed(1) : "\u2014";
    return Response.json({ revenue: { total: revenueRow?.total_revenue || 0, monthly: monthlyRev?.revenue || 0, weekly: weekly || [], byTier: byTier || [] }, orders: { total: revenueRow?.total_orders || 0, approved: totalSales, pending: revenueRow?.pending_orders || 0 }, licenses: { total: licRow?.total || 0, active: licRow?.active || 0, stripe: licRow?.from_stripe || 0 }, leads: { total: totalLeads, converted: leadRow?.converted || 0, unsubscribed: leadRow?.unsubscribed || 0, sequence_complete: leadRow?.sequence_complete || 0 }, conversion_rate: conversionRate, recent_orders: recentOrders || [], generated_at: (/* @__PURE__ */ new Date()).toISOString() });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
__name(handleDashboardStats, "handleDashboardStats");
__name2(handleDashboardStats, "handleDashboardStats");
function handleAdminPanel() {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NAC OS \u2014 License Admin</title>
<style>:root{--green:#2E7D32;--green-light:#43A047;--bg:#0d0d0d;--surface:#141414;--surface2:#1a1a1a;--surface3:#1e1e1e;--border:rgba(255,255,255,0.07);--text:rgba(255,255,255,0.85);--muted:rgba(255,255,255,0.4);--dim:rgba(255,255,255,0.2);--danger:#C62828;--warn:#F57C00;--purple:#635BFF}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);font-size:14px;line-height:1.5;min-height:100vh}
.login-screen{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.login-box{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:40px;width:100%;max-width:380px;text-align:center}
.login-box h1{font-size:20px;margin-bottom:4px}.login-box .sub{font-size:12px;color:var(--muted);margin-bottom:24px}.login-box input{width:100%;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;margin-bottom:12px;outline:none}
.login-box input:focus{border-color:var(--green)}.err{color:var(--danger);font-size:12px;margin-bottom:8px;display:none}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}
.btn-primary{background:var(--green);color:#fff;width:100%;justify-content:center;padding:10px 16px}.btn-primary:hover{background:var(--green-light)}
.btn-sm{padding:5px 10px;font-size:11px;border-radius:4px}.btn-success{background:rgba(46,125,50,.15);color:var(--green)}.btn-danger{background:rgba(198,40,40,.15);color:var(--danger)}.btn-secondary{background:var(--surface3);color:var(--muted);border:1px solid var(--border)}.btn-info{background:rgba(21,101,192,.15);color:#1565C0}
.dashboard{display:none;max-width:1200px;margin:0 auto;padding:20px}
.top-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:12px}.top-bar h1{font-size:18px}.eyebrow{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--green);font-weight:600}
.top-bar-right{display:flex;align-items:center;gap:12px}.toggle-wrapper{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted)}
.toggle{position:relative;width:40px;height:22px;background:var(--surface3);border:1px solid var(--border);border-radius:11px;cursor:pointer;transition:all .2s}.toggle.active{background:var(--green);border-color:var(--green)}.toggle::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:all .2s}.toggle.active::after{left:20px}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px}.stat-card{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px}.stat-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:4px}.stat-value{font-size:28px;font-weight:700;color:var(--text)}.stat-value.green{color:var(--green)}.stat-value.warn{color:var(--warn)}
.panel{background:var(--surface2);border:1px solid var(--border);border-radius:10px;margin-bottom:20px;overflow:hidden}.panel-highlight{border-color:rgba(245,124,0,.3);box-shadow:0 0 0 1px rgba(245,124,0,.1)}.panel-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:8px}.panel-title{font-size:14px;font-weight:600}.panel-body{padding:16px}
.count-badge{background:var(--warn);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px}
.generate-form{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end}.form-group label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:4px}
.form-group input,.form-group select{width:100%;padding:8px 10px;background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;outline:none;font-family:inherit}.form-group input:focus,.form-group select:focus{border-color:var(--green)}
.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse}thead th{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);white-space:nowrap}tbody td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}tbody tr:hover{background:rgba(255,255,255,.02)}
.key-cell{font-family:'Courier New',monospace;font-size:12px;color:var(--green);cursor:pointer}.key-cell:hover{text-decoration:underline}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}.badge-active{background:rgba(46,125,50,.15);color:var(--green)}.badge-inactive{background:rgba(198,40,40,.15);color:var(--danger)}.badge-stripe{background:rgba(99,91,255,.15);color:var(--purple)}.badge-manual{background:rgba(255,255,255,.06);color:var(--muted)}.badge-pending{background:rgba(245,124,0,.15);color:var(--warn)}.badge-approved{background:rgba(46,125,50,.15);color:var(--green)}.badge-rejected{background:rgba(198,40,40,.15);color:var(--danger)}
.empty-state{text-align:center;padding:40px 20px;color:var(--muted)}
.order-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px}.order-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px}.order-card-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:12px}.order-card-field{font-size:12px}.field-label{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em}.field-value{color:var(--text);margin-top:2px}.order-card-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.notes-input{flex:1;min-width:150px;padding:6px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:12px;outline:none}.notes-input:focus{border-color:var(--green)}
.tab-bar{display:flex;border-bottom:1px solid var(--border);margin-bottom:16px}.tab{padding:10px 16px;font-size:13px;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s}.tab:hover{color:var(--text)}.tab.active{color:var(--green);border-bottom-color:var(--green)}
.toast{position:fixed;bottom:20px;right:20px;background:var(--green);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:9999;animation:slideIn .3s ease;max-width:400px}.toast.error{background:var(--danger)}
@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
@media(max-width:700px){.generate-form{grid-template-columns:1fr}.stats-grid{grid-template-columns:repeat(2,1fr)}.order-card-info{grid-template-columns:1fr}}
</style></head><body>
<div class="login-screen" id="login-screen">
<div class="login-box">
<div class="eyebrow" style="margin-bottom:4px">NATURAL ALTERNATIVES</div>
<h1>License Admin</h1><p class="sub">NAC OS Fleet Logbook\u2122</p>
<div class="err" id="err">Wrong password.</div>
<input type="password" id="pw" placeholder="Admin password" autofocus>
<button class="btn btn-primary" onclick="doLogin()">Log In \u2192</button>
<p style="margin-top:12px;font-size:11px;color:var(--muted)"><a href="/dashboard" style="color:var(--green)">\u2192 Billfold Command Dashboard</a></p>
</div></div>
<div class="dashboard" id="dash">
<div class="top-bar">
<div><div class="eyebrow">Natural Alternatives</div><h1>\u{1F511} License Admin Panel</h1></div>
<div class="top-bar-right">
<div class="toggle-wrapper"><span>Auto-approve</span><div class="toggle" id="toggle" onclick="toggleAA()"></div></div>
<button class="btn btn-secondary btn-sm" onclick="doLogout()">Log Out</button>
</div></div>
<div class="stats-grid">
<div class="stat-card"><div class="stat-label">Total Keys</div><div class="stat-value" id="s-total">\u2014</div></div>
<div class="stat-card"><div class="stat-label">Active</div><div class="stat-value green" id="s-active">\u2014</div></div>
<div class="stat-card"><div class="stat-label">Inactive</div><div class="stat-value" id="s-inactive">\u2014</div></div>
<div class="stat-card"><div class="stat-label">From Stripe</div><div class="stat-value" id="s-stripe">\u2014</div></div>
<div class="stat-card"><div class="stat-label">Manual</div><div class="stat-value" id="s-manual">\u2014</div></div>
<div class="stat-card"><div class="stat-label">Pending Orders</div><div class="stat-value warn" id="s-pending">\u2014</div></div>
</div>
<div class="panel panel-highlight">
<div class="panel-header"><div><span class="panel-title">\u23F3 Pending Orders</span><span class="count-badge" id="badge" style="display:none">0</span></div><button class="btn btn-secondary btn-sm" onclick="loadOrders()">\u21BB</button></div>
<div class="panel-body" id="pending-body"><div class="empty-state">Loading...</div></div>
</div>
<div class="panel">
<div class="panel-header"><div class="panel-title">\u{1F4CB} Order History</div>
<div class="tab-bar" style="border-bottom:none;margin-bottom:0">
<div class="tab active" onclick="switchTab('all',this)">All</div>
<div class="tab" onclick="switchTab('approved',this)">Approved</div>
<div class="tab" onclick="switchTab('rejected',this)">Rejected</div>
</div></div>
<div class="panel-body" style="padding:0"><div class="table-wrap"><table>
<thead><tr><th>Order #</th><th>Email</th><th>Name</th><th>Tier</th><th>Amount</th><th>Status</th><th>License Key</th><th>Date</th><th>Actions</th></tr></thead>
<tbody id="orders-body"><tr><td colspan="9" class="empty-state">Loading...</td></tr></tbody>
</table></div></div></div>
<div class="panel">
<div class="panel-header"><div class="panel-title">\u2795 Generate New Key (Manual)</div></div>
<div class="panel-body">
<div class="generate-form">
<div class="form-group"><label>Tier *</label><select id="gen-tier"><option value="SOLO">Solo (Lifetime)</option><option value="ADDON">Add-on (Lifetime)</option><option value="FLEET">Fleet (Annual)</option><option value="OCOS1">OCOS T1 (Lifetime)</option><option value="OCOS2">OCOS T2 (Lifetime)</option><option value="OCOS3">OCOS T3 (Lifetime)</option><option value="OCOSB">OCOS Bundle (Lifetime)</option><option value="PRACS">Partner Starter (Annual)</option><option value="PRACG">Partner Growth (Annual)</option><option value="PRACP">Partner Pro (Annual)</option><option value="PRACA">Partner Agency (Annual)</option></select></div>
<div class="form-group"><label>Email</label><input type="email" id="gen-email" placeholder="customer@example.com"></div>
<div class="form-group"><label>Name</label><input type="text" id="gen-name" placeholder="John Doe"></div>
<button class="btn btn-primary" style="height:36px;white-space:nowrap" onclick="genKey()">Generate Key</button>
</div>
<p style="font-size:11px;color:var(--dim);margin-top:8px">If email is entered, license key is sent automatically.</p>
</div></div>
<div class="panel">
<div class="panel-header"><div class="panel-title">\u{1F510} All License Keys</div><button class="btn btn-secondary btn-sm" onclick="loadLicenses()">\u21BB</button></div>
<div class="panel-body" style="padding:0"><div class="table-wrap"><table>
<thead><tr><th>License Key</th><th>Tier</th><th>Customer</th><th>Email</th><th>Status</th><th>Source</th><th>Created</th><th>Last Used</th><th>Actions</th></tr></thead>
<tbody id="lic-body"><tr><td colspan="9" class="empty-state">Loading...</td></tr></tbody>
</table></div></div></div>
</div>
<script>
const API=window.location.origin;let pw='',orderTab='all';
function authH(){return{'Content-Type':'application/json','X-Admin-Password':pw};}
async function doLogin(){const p=document.getElementById('pw').value;const e=document.getElementById('err');e.style.display='none';try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:p})});if(r.ok){pw=p;localStorage.setItem('nac_pw',p);show();}else{e.style.display='block';}}catch(err){e.textContent='Connection error.';e.style.display='block';}}
function doLogout(){pw='';localStorage.removeItem('nac_pw');document.getElementById('login-screen').style.display='flex';document.getElementById('dash').style.display='none';}
function show(){document.getElementById('login-screen').style.display='none';document.getElementById('dash').style.display='block';loadStats();loadLicenses();loadOrders();loadSettings();}
async function tryAuto(){const s=localStorage.getItem('nac_pw');if(!s)return;try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:s})});if(r.ok){pw=s;show();}}catch(e){}}
document.getElementById('pw').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
async function loadStats(){try{const r=await fetch(API+'/api/admin/stats',{headers:authH()});const d=await r.json();document.getElementById('s-total').textContent=d.total;document.getElementById('s-active').textContent=d.active;document.getElementById('s-inactive').textContent=d.inactive;document.getElementById('s-stripe').textContent=d.stripe;document.getElementById('s-manual').textContent=d.manual;document.getElementById('s-pending').textContent=d.pending_orders;const b=document.getElementById('badge');if(d.pending_orders>0){b.textContent=d.pending_orders;b.style.display='inline';}else{b.style.display='none';}}catch(e){}}
async function loadSettings(){try{const r=await fetch(API+'/api/admin/settings',{headers:authH()});const d=await r.json();document.getElementById('toggle').classList.toggle('active',d.auto_approve);}catch(e){}}
async function toggleAA(){const t=document.getElementById('toggle');const v=!t.classList.contains('active');try{await fetch(API+'/api/admin/settings',{method:'POST',headers:authH(),body:JSON.stringify({auto_approve:v})});t.classList.toggle('active',v);toast(v?'\u26A1 Auto-approve ON':'\u23F3 Auto-approve OFF');}catch(e){toast('\u274C Failed',true);}}
async function loadOrders(){try{const r=await fetch(API+'/api/admin/orders?status=pending',{headers:authH()});const d=await r.json();const c=document.getElementById('pending-body');if(!d.orders||d.orders.length===0){c.innerHTML='<div class="empty-state">\u2705 No pending orders</div>';}else{c.innerHTML=d.orders.map(renderCard).join('');}}catch(e){document.getElementById('pending-body').innerHTML='<div class="empty-state">Error loading</div>';}loadHistory();}
function renderCard(o){const amt=o.amount?'$'+(o.amount/100).toFixed(2):'\u2014';return\`<div class="order-card"><div class="order-card-header"><div><span style="font-size:16px;font-weight:600">Order #\${o.id}</span><span class="badge badge-pending" style="margin-left:8px">PENDING</span></div><span style="font-size:11px;color:var(--muted)">\${fmtDate(o.created_at)}</span></div><div class="order-card-info"><div class="order-card-field"><div class="field-label">Email</div><div class="field-value">\${o.email||'\u2014'}</div></div><div class="order-card-field"><div class="field-label">Name</div><div class="field-value">\${o.customer_name||'\u2014'}</div></div><div class="order-card-field"><div class="field-label">Tier</div><div class="field-value" style="color:var(--green);font-weight:600">\${o.tier}</div></div><div class="order-card-field"><div class="field-label">Amount</div><div class="field-value">\${amt} \${o.currency?.toUpperCase()||''}</div></div></div><div class="order-card-actions"><input type="text" class="notes-input" id="n-\${o.id}" placeholder="Optional notes..."><button class="btn btn-success btn-sm" onclick="approve(\${o.id})">\u2713 Approve & Send Key</button><button class="btn btn-danger btn-sm" onclick="reject(\${o.id})">\u2715 Reject</button></div></div>\`;}
async function approve(id){const notes=document.getElementById('n-'+id)?.value||'';try{const r=await fetch(API+'/api/admin/orders/'+id+'/approve',{method:'POST',headers:authH(),body:JSON.stringify({notes})});const d=await r.json();if(d.success){toast('\u2705 Order #'+id+' approved! Key: '+d.license_key+(d.email_sent?' (email sent)':''));loadOrders();loadStats();loadLicenses();}else{toast('\u274C '+(d.error||'Failed'),true);}}catch(e){toast('\u274C Connection error',true);}}
async function reject(id){if(!confirm('Reject this order?'))return;const notes=document.getElementById('n-'+id)?.value||'';try{const r=await fetch(API+'/api/admin/orders/'+id+'/reject',{method:'POST',headers:authH(),body:JSON.stringify({notes})});const d=await r.json();if(d.success){toast('Order #'+id+' rejected');loadOrders();loadStats();}else{toast('\u274C '+(d.error||'Failed'),true);}}catch(e){toast('\u274C Connection error',true);}}
async function resend(id){try{const r=await fetch(API+'/api/admin/orders/'+id+'/resend',{method:'POST',headers:authH()});const d=await r.json();if(d.success)toast('\u{1F4E7} Email resent for #'+id);else toast('\u274C '+(d.error||'Failed'),true);}catch(e){toast('\u274C Connection error',true);}}
async function loadHistory(){const tb=document.getElementById('orders-body');try{let url=API+'/api/admin/orders';if(orderTab!=='all')url+='?status='+orderTab;const r=await fetch(url,{headers:authH()});const d=await r.json();const orders=orderTab==='all'?d.orders.filter(o=>o.order_status!=='pending'):d.orders;if(!orders||orders.length===0){tb.innerHTML='<tr><td colspan="9" class="empty-state">No orders found</td></tr>';return;}tb.innerHTML=orders.map(o=>{const amt=o.amount?'$'+(o.amount/100).toFixed(2):'\u2014';const sc=o.order_status==='approved'?'badge-approved':o.order_status==='rejected'?'badge-rejected':'badge-pending';const acts=o.order_status==='approved'&&o.license_key?\`<button class="btn btn-info btn-sm" onclick="resend(\${o.id})">\u{1F4E7} Resend</button>\`:'\u2014';return\`<tr><td>#\${o.id}</td><td>\${o.email||'\u2014'}</td><td>\${o.customer_name||'\u2014'}</td><td>\${o.tier}</td><td>\${amt}</td><td><span class="badge \${sc}">\${o.order_status}</span></td><td class="key-cell" onclick="copy('\${o.license_key||''}')">\${o.license_key||'\u2014'}</td><td style="font-size:11px;color:var(--muted);white-space:nowrap">\${fmtDate(o.created_at)}</td><td style="white-space:nowrap">\${acts}</td></tr>\`;}).join('');}catch(e){tb.innerHTML='<tr><td colspan="9" class="empty-state">Error loading</td></tr>';}}
function switchTab(tab,el){orderTab=tab;document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');loadHistory();}
async function loadLicenses(){const tb=document.getElementById('lic-body');try{const r=await fetch(API+'/api/admin/licenses',{headers:authH()});const d=await r.json();if(!d.licenses||d.licenses.length===0){tb.innerHTML='<tr><td colspan="9" class="empty-state">No keys yet. Generate one above! \u261D\uFE0F</td></tr>';return;}tb.innerHTML=d.licenses.map(l=>\`<tr><td class="key-cell" title="Copy" onclick="copy('\${l.key}')">\${l.key}</td><td>\${l.tier}</td><td>\${l.customer_name||'\u2014'}</td><td>\${l.email||'\u2014'}</td><td><span class="badge \${l.is_active?'badge-active':'badge-inactive'}">\${l.is_active?'Active':'Inactive'}</span></td><td><span class="badge \${l.source==='stripe'?'badge-stripe':'badge-manual'}">\${l.source}</span></td><td style="font-size:11px;color:var(--muted);white-space:nowrap">\${fmtDate(l.created_at)}</td><td style="font-size:11px;color:var(--muted);white-space:nowrap">\${l.last_used_at?fmtDate(l.last_used_at):'\u2014'}</td><td style="white-space:nowrap">\${l.is_active?\`<button class="btn btn-danger btn-sm" onclick="toggleLic(\${l.id},false)">Deactivate</button>\`:\`<button class="btn btn-success btn-sm" onclick="toggleLic(\${l.id},true)">Activate</button>\`}<button class="btn btn-secondary btn-sm" onclick="delLic(\${l.id})" style="margin-left:4px">\u{1F5D1}</button></td></tr>\`).join('');}catch(e){tb.innerHTML='<tr><td colspan="9" class="empty-state">Error loading</td></tr>';}}
async function genKey(){const tier=document.getElementById('gen-tier').value;const email=document.getElementById('gen-email').value;const name=document.getElementById('gen-name').value;try{const r=await fetch(API+'/api/admin/licenses/generate',{method:'POST',headers:authH(),body:JSON.stringify({tier,email,name})});const d=await r.json();if(d.success){toast('\u2705 Key: '+d.license.key);document.getElementById('gen-email').value='';document.getElementById('gen-name').value='';loadStats();loadLicenses();}else{toast('\u274C '+(d.error||'Failed'),true);}}catch(e){toast('\u274C Connection error',true);}}
async function toggleLic(id,activate){await fetch(API+'/api/admin/licenses/'+id+'/'+(activate?'activate':'deactivate'),{method:'POST',headers:authH()});loadStats();loadLicenses();}
async function delLic(id){if(!confirm('Delete permanently?'))return;await fetch(API+'/api/admin/licenses/'+id,{method:'DELETE',headers:authH()});loadStats();loadLicenses();}
function copy(key){if(!key||key==='\u2014')return;navigator.clipboard.writeText(key).then(()=>toast('\u{1F4CB} Copied: '+key));}
function fmtDate(str){if(!str)return'\u2014';const d=new Date(str+'Z');return d.toLocaleDateString('en-CA')+' '+d.toLocaleTimeString('en-CA',{hour:'2-digit',minute:'2-digit'});}
function toast(msg,isErr){const el=document.createElement('div');el.className='toast'+(isErr?' error':'');el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),5000);}
tryAuto();
<\/script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store", "cf-edge-cache": "no-store" } });
}
__name(handleAdminPanel, "handleAdminPanel");
__name2(handleAdminPanel, "handleAdminPanel");
function handleDashboard() {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NAC OS \u2014 Billfold Command</title>

<style>:root{--bg:#060807;--panel:#0d1210;--panel-2:#101814;--border:rgba(162,255,204,.10);--border-2:rgba(162,255,204,.20);--text:#edf5f0;--muted:#8faa99;--dim:rgba(237,245,240,.35);--accent:#4fd28c;--accent-2:#9ff0c2;--warn:#f3b558;--danger:#f06b6b;--shadow:0 20px 60px rgba(0,0,0,.5)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);font-size:13px;line-height:1.5}
.app{display:grid;grid-template-columns:260px 1fr;height:100vh;overflow:hidden}
.sidebar{background:linear-gradient(180deg,rgba(10,16,12,.97),rgba(7,11,9,.97));border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 14px;overflow-y:auto}
.brand{display:flex;align-items:center;gap:12px;padding:14px;background:rgba(79,210,140,.05);border:1px solid var(--border);border-radius:14px;margin-bottom:24px}
.brand-icon{width:38px;height:38px;border-radius:12px;background:radial-gradient(circle at 35% 30%,#86eeb2,#38b870 58%,#163222 100%);display:grid;place-items:center;font-size:18px;color:#041109;box-shadow:0 8px 24px rgba(79,210,140,.25);flex-shrink:0}
.brand-text .title{font-size:13px;font-weight:700}.brand-text .sub{font-size:10px;color:var(--muted)}
.nav-label{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);padding:14px 10px 8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:var(--muted);cursor:pointer;font-size:13px;border:1px solid transparent;transition:all .15s;margin-bottom:2px;text-decoration:none}
.nav-item:hover{background:rgba(79,210,140,.07);color:var(--text);border-color:var(--border)}.nav-item.active{background:rgba(79,210,140,.12);color:var(--accent);border-color:rgba(79,210,140,.2)}
.nav-dot{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.6;flex-shrink:0}.nav-item.active .nav-dot{box-shadow:0 0 10px currentColor;opacity:1}
.sidebar-footer{margin-top:auto;padding:12px 14px;background:rgba(79,210,140,.05);border:1px solid var(--border);border-radius:14px;font-size:11px;color:var(--muted)}
.status-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);margin-right:6px}
.main{overflow-y:auto;padding:24px}.main::-webkit-scrollbar{width:4px}.main::-webkit-scrollbar-thumb{background:rgba(79,210,140,.15);border-radius:4px}
.topbar{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:16px}
.topbar-left h1{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;letter-spacing:-.03em;line-height:1.1;margin-bottom:4px}.topbar-left h1 em{font-style:italic;color:var(--accent)}.topbar-left .sub{font-size:12px;color:var(--muted)}
.topbar-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
.chip{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;border:1px solid var(--border);background:var(--panel);font-size:12px;color:var(--muted);cursor:pointer;transition:all .15s;white-space:nowrap;text-decoration:none}.chip:hover{border-color:var(--border-2);color:var(--text)}.chip.accent{background:rgba(79,210,140,.12);border-color:rgba(79,210,140,.3);color:var(--accent);font-weight:600}
.card{background:linear-gradient(180deg,rgba(15,22,18,.97),rgba(11,17,14,.97));border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow);overflow:hidden}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}
.stat-card{padding:18px 20px;position:relative;overflow:hidden}.stat-card::after{content:'';position:absolute;right:-20px;top:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(79,210,140,.12),transparent 70%);pointer-events:none}
.stat-eyebrow{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.stat-value{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;letter-spacing:-.04em;color:var(--text);line-height:1;margin-bottom:8px}.stat-value.green{color:var(--accent)}.stat-value.warn{color:var(--warn)}
.stat-meta{font-size:12px;color:var(--muted)}.stat-up{color:var(--accent-2)}.stat-warn-text{color:var(--warn)}
.row{display:grid;gap:16px;margin-bottom:16px}.row-main{grid-template-columns:1.5fr 1fr}.row-lower{grid-template-columns:1.3fr 1fr}
.card-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 0;margin-bottom:12px}
.card-head h2{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;letter-spacing:-.02em}.card-head .sub{font-size:11px;color:var(--muted);margin-top:2px}
.pill{font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:20px;border:1px solid var(--border);color:var(--accent);background:rgba(79,210,140,.08)}
.chart-wrap{padding:12px 20px 20px}.bar-chart{height:200px;display:flex;align-items:flex-end;gap:12px;border-bottom:1px solid var(--border);padding-top:24px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px}.bar-val{font-size:11px;color:var(--text);font-weight:600}
.bar{width:100%;border-radius:10px 10px 4px 4px;background:linear-gradient(180deg,rgba(159,240,194,.95),rgba(79,210,140,.25));border:1px solid rgba(159,240,194,.12);min-height:4px}
.bar-label{font-size:10px;color:var(--muted);font-family:'DM Mono',monospace}.chart-empty{height:200px;display:flex;align-items:center;justify-content:center;color:var(--dim);font-size:12px}
.task-list{padding:4px 16px 16px}.task{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-bottom:1px solid var(--border)}.task:last-child{border-bottom:none}
.tick{width:16px;height:16px;border-radius:5px;border:1px solid rgba(159,240,194,.3);background:rgba(79,210,140,.06);flex-shrink:0;margin-top:1px}
.task-title{font-size:13px;font-weight:600;margin-bottom:3px}.task-sub{font-size:12px;color:var(--muted);line-height:1.45}
.tag{display:inline-block;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;border:1px solid var(--border);margin-top:6px;color:var(--muted)}.tag.urgent{color:var(--danger);border-color:rgba(240,107,107,.3);background:rgba(240,107,107,.08)}.tag.sales{color:var(--accent);border-color:rgba(79,210,140,.3);background:rgba(79,210,140,.08)}
.table-wrap{overflow-x:auto;padding:0 4px 4px}table{width:100%;border-collapse:collapse}
thead th{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);text-align:left;padding:10px 16px;border-bottom:1px solid var(--border);white-space:nowrap}
tbody td{padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;vertical-align:middle}tbody tr:hover{background:rgba(79,210,140,.03)}tbody tr:last-child td{border-bottom:none}
.sdot{display:inline-flex;align-items:center;gap:6px;font-size:11px}.sdot::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent)}.sdot.pending::before{background:var(--warn);box-shadow:0 0 8px var(--warn)}.sdot.rejected::before{background:var(--danger);box-shadow:0 0 8px var(--danger)}
.tier-list{padding:4px 20px 16px}.tier-row{margin-bottom:12px}.tier-header{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}.tier-name{color:var(--text);font-weight:500}.tier-amt{color:var(--accent);font-weight:600;font-size:11px}
.tier-track{height:4px;background:rgba(79,210,140,.08);border-radius:4px;overflow:hidden}.tier-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:4px}
.bottom-panel{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:16px;background:linear-gradient(180deg,rgba(15,22,18,.97),rgba(11,17,14,.97));border:1px solid var(--border);border-radius:20px;overflow:hidden}
.bp-item{padding:20px 24px;border-right:1px solid var(--border)}.bp-item:last-child{border-right:none}
.bp-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:8px}
.bp-value{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:var(--text);letter-spacing:-.03em}.bp-value.green{color:var(--accent)}
.login-screen{position:fixed;inset:0;z-index:1000;background:var(--bg);display:flex;align-items:center;justify-content:center}
.login-box{background:var(--panel);border:1px solid var(--border);border-radius:20px;padding:40px;width:100%;max-width:360px;text-align:center}
.login-logo{width:52px;height:52px;border-radius:16px;background:radial-gradient(circle at 35% 30%,#86eeb2,#38b870 58%,#163222 100%);display:grid;place-items:center;font-size:24px;color:#041109;margin:0 auto 20px;box-shadow:0 12px 32px rgba(79,210,140,.3)}
.login-box h2{font-family:'Playfair Display',serif;font-size:20px;margin-bottom:4px}.login-box p{font-size:12px;color:var(--muted);margin-bottom:24px}.login-err{color:var(--danger);font-size:12px;margin-bottom:8px;display:none}
.login-input{width:100%;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 16px;outline:none;margin-bottom:12px;transition:border-color .15s}.login-input:focus{border-color:var(--accent)}
.login-btn{width:100%;background:rgba(79,210,140,.18);border:1px solid rgba(79,210,140,.35);border-radius:10px;color:var(--accent);font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:12px;cursor:pointer;transition:all .15s;font-weight:500}.login-btn:hover{background:rgba(79,210,140,.25)}
.loading{display:flex;align-items:center;justify-content:center;height:200px}.spinner{width:24px;height:24px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr)}.row-main,.row-lower{grid-template-columns:1fr}.bottom-panel{grid-template-columns:1fr 1fr}}
@media(max-width:900px){.app{grid-template-columns:1fr}.sidebar{display:none}.main{padding:16px}}
</style></head><body>
<div class="login-screen" id="ls">
<div class="login-box">
<div class="login-logo"><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAOG0lEQVR42u2bSWxcR3rHf1/Ve70vbJKiSIq0tViy5QiK5NFYGUHwIidAHNhIJmMbSBBMcskAuRnIMQiQe26DIIcgTg5BgACJk5nJ2Jnxrhnvsq1IHtuSJYsSJVEUdzZ7eVtV5fCapOg1NkibGvR36UYvVe/9+l/fVtUCOLr2lU11EXQBdgF2AXYBdq0LsAuwC7ALsGtdgF2AXYBdgF3rAuwCvHnM2zRXIqAERNLnzoJzq++JrH7Uuc57X7KTKSodd50v+5ttqEpnDXyVG1O6A/NzviuSzmFNRzEZwc8rgrrFOXfzKnBZDcs3n80pRnZ77D6QZc/+PDtuL1LrzWMlYanZZmoyYOJSxPjZhIvvRYy/nxCHblWh3KBYQKn0dWvAGdAe7DyUAQ/G/zfBrZNuvn4F3jCj1sLwXo+9R332Hc2w50CGwWGfrK+JG1mWZjzmZkMW622CMME4i3gOtKWx6Bg7FXPqmYjxd5MVRQpgzOp0+bLi0IMZBvZ4fPBqzJnj4Yoabz6AndmUEob3a7Yf9hj5DU3/sCYrwtI1uPqh4eo5w8wVQ33OEDQtcRtcnH5XNGQKQm1IMbrXY2CHpj5jOf1sxOKkWZlo910+R7+X49YDmvffjHnmiYCFK8lG6uHrscqQ5tbf0pRvEQplRQZhYdxx7Yxh+pKhteCw4adHCAGkE03sjetVw7YdWXr7Nd86luXwQxn6RoQTxwN+9Pctzr0W3fxBRAS23OnRs1NQGUe+KISzwtRZy+I1S9J2OOvWfJ4OMKXSizTJ2kvdNlrgwHfy7PtOhjuOaLbvV8SR4dWfB/z4n1qceinEBnZlLOe4ORWofKHvDoXOg/YhVxAWLkL9qiUJbgAnqw9KCQ63xl8V8hn2Hahx9/1V7ro3w8g+Q2koQiRhZiLh5acCnn2yxfsnIoI5i4jbMHBfG0DlC7XbNElg8QuCnxcWLjrCBYtN3Jqr+HjKATAwUOTIvYPc/+Aoh+7po39XQsw0EQu0XcD4BxGv/U+bXzzd5qMPQtoLFhvCnvt9zr4YgdtYgBuaxogSyrcomtctfim9kZkPPmW5dmoiZ9OUo1r1OPI7VR74bo1D91XZNlwjQ40EH0NCZBRnT8IL/93gleeWuDwWEbccYd3iHDz8lwWWtOHMCxu/vryN1HVxWNG+7hDt0DnF4lgK71OrAwfDO3zueSTPPb9fYvQOHz8X0oynuNxqMVQQdFzhzV9O89MfX+TEq/NMTUQkLUfSdsSho1hRPPpXJWq3w5NPBPhFRalXmB83G7bWvI2Cl+sTkpYlbkFlh9C44tbAE1mtImqDmsPfy7H/t30qA4oFCWieC+jt87hlJA8txdM/neDZn5zm3dNzNBYs8RLELUscpWMevDfPQ48XUFXDy88EhJElaQnV/Qq0Yn7Mrsy5uQG61O/prNCcsJRGNO1ZR9Kyn4CntbD3gQx7jnlkq3B1MmZpSVMb0AyPekjb45l/jDj+1GXGPmoRNh2mJYQNR2LS8Ua2Z3ns8Qq7jwlj4wFzFxyXxyLECA6YPm/ZekCxMG7XPYVZf4DL6usV2jOOTFlwxhEtfBJedVBzx4MehSG4PpNQbCsqNYXeAhLDG/8W8dZzDSYux9jYYVrQXrIrJdjo9gKP/aCfw48I86bFh2dbeEpz/kxIs2ExsSAKWrOWoCnktypaE3bdl7K37urLCM4JNrJktmpa1+0awM7BwF7Ntrs1DWNoTQj5kmBLDt+HsVcS3nshYOqqQQFJ2xE0V8c4dPdWHv2zYb71sKORm+OjS3Vmpw21Hp8zp2IuXgjBCUlbcMaCg2DBkSlC2xNc4japAju/bKYsRIuWTFkwocN2fNSy8oYOeBS3wdSlhEKvwi+A8iCegdefirh+wSJA0rJEHZ9ZrWb53YdG+cM/GWXPEcWsXOHC5CxLk4Z2C/r6faYuWd5+q4VCiCOwrVWlJUHaKtM5SBqbdQkvp3Q+mNCR69cEM3YNvC37NHhw/V1LfosQZhy5kjBzyjH5XkwSgQ1Xwe09UOC7fzzIsYeHqNxiuR5c5q2peaIQsIrECH19itkxeObZJZLYETTTueKFVaUZ49BZ1Yn6bl194bouYZ0VXALKE5x1mNCtLNvqdo01MP2eIVMW4gYUasLEq4al6+kPEDXSOzv0QI7f+9Miew8XcNmYD1tnic4n+FrjaQ+TWBJnGBrwOfVUwvPv1ImcIQkcYQAKRTi9CtBZUL7DJQ7xwYWbDWBn+eoc2MihfEjaq8rM9gg6D3NnLMpPOyrZsjB12pA0hajj4+48muHY9/MM3KaYr0ccf6dNuayo9fgU8h7GQrMZU+vzyCc5fvK3Lc7Nt5E+i5mFdhNEC8l0ugqWc0ylIJMHl4Bk1jeKrKsClSdprueDWfZ9GvIDioXzaQfYLyny/Yq5cwYbQBJa+rdr7n40y9bbFZdmIt573lKuKrZsUZisotmwBG1HoaK4ZVuWC7+0PPnDBUr7LLkRy/ykJWg54lDwc4rFC2vXqPbBz6VVjpJNnMaIcmA79WzcaWhuUbSnHTZO05r8QKciaaWf2/OAz+hBzfRSwsWXLIWKotwjJBEsLjrC0NDTq9i+K4NuaP758SZjZ0MOPuYx2bTMXzXEATTr4BeEYMwRN1ddB4BfBJ0RnHMrWwibNA8U6HRAbOJQvqCy0Jq06JyQH1QsjRuSFuT7YOSwRxLAqWdiClug1C+YyNGsQxQaLIq+QY+Sp3n+7wJOPhey774Mxx7PcupXbeqzBhNDc9EhnqACxeK5ZDXX66it2CtozZqOz+ZUYKe2tZ3aNlMVooVUDaURReuaJWk5yqOKnh2KiZOGuAmFfiH2oWEdUQjVYejv1+SN4u1/ifnoRJudv+nz2N+UmGrHvP5GCxs7ktjRWnQYI5SrmivPmTTCyqr/FYHKsNC6kr4gqM3rA51NfR5mOSpDMOMoDCmCOUfccFR2KDIV4corCSKCn4f2jCMJhJ6cotKjkHk4fTyhft2y6y6fR/66CCV4690WS4sWpSCKHO0lRxwJPQMe144boiW3kjItP+Z6FL3bFLOnU7LOuc2rQBunyzYOLTorxG2Hl09LqnDOUhxJt89mTqWFvXWOuCkUB4XKqMKFcP7nCdqDHYc8jnw/i9Vw8v2AxbohlxOcg6CdKi+Jhd5Bn4lfGBrXPtYs6CzjLXuEQlmoX7WITiPx5gO4nPGHjmxewAoqlwaSTE1oTViy/an3rncipHOQ61UUB4QkhLlzlvKAsPOoR6kmLF53vPyfAcZzFPvAzwth02KStCb28oreHo/LLxqWrppPdlo6z3cf1cSL0Jh1ZMrqE+20TaVAE6Y+UFR6M35ZSBoOlQOvAM3xFJ5fFvJ9ggmhMemojgjbDihcLIyfSJi/7NAZKG4RcjUhxBHlLE7AAuUBDx0pxp5OaM/ZNRH3xh7jwC7N6H7FiX81ne442KVNXgubsJMyWIfOCMGUIz+kaI6nSXSuX2ETaM86KtvSfl206PjoeUNYdyt5mxIhWgJrHXoJxBdKw1Ad0ixdclx9M+3SfHZ3RTj4B5qkBRdeNyhfVlKrTV0LR3WHXxSsD0nL4VeFcMbhlQSvKIQLjsKA0L9XES7ApZdMWvJ1lCN0ysDIYZI0opeGhPKIAgvjLxgak/Yzd3SUTvdUdt3tsf3birf/3dCuW/K9imDRbmKANwQSEwoql+Z0ImmDAcC0HH13Cs7C5InV9v6N52OW+31+XihsFQoDAgpmz1oaEw5nblCd4xPbA9ZAZYvm23+kmR+HX/0sQWdk5YjHTbEnkrQttAW/ms5gmmniXBxR1C9aghm3xlctd0dEIFtLoXlFIQkcCxcdwZxb28dzn1YFpeNkC4r7fpAh3wMv/jAhaDoK/Zr2vN2IW924XTnRDskp4llH6VZBeTDzzg2J7vKpKoFsRcj1Cl4pfS1ahPpli2kvw/18x7+8bHNFxbG/yDKwF979keXiyZhsRRG3O8q9mfaFlZ+WA+WdQtKE5pW1CvBLQrYm+KW07R83U/+ZtPh/3+yNZwl7BzX3/nmW2m64+LLjxX8I0HnwskKwYNkwoWwIwM5xs8puTTjvCKZtp1sD2V5FppxOmjQhajhM230p//TxM4V3Hslw1yM+fs1y6TXH8SdC0Gl3PJizN9nJhM6I5e2KqO4I5xwqI2R7BZ0D04Z4yWGCtDMs0rkA98VKEzp1dse23upx8KEMQweFJLF8+Jzljf8IUb6QrSiCBbMhgWPjAHZGy29V2MQRzjryWxQqB3ETkqZDcJiYNCP+vHE+A6pSwrY9HnuOeozcpZCCY3Hcceq/Ei6cjPFygl9QBIsbD29DFKgLqV+L5tMmQtJyhPOpE1e+UNkp1HamqUx7FsIZR1RPO9gmclizenZUAV5WkStBdVCxdbdm8A5NbXtaKjanLeOvWU7/LCZoWbJVBQLR4sYu2w1VYLY3PYvmFSGYTpfqxy3Xp+i9TaiMCjrvMBZcLBA7XAxaCV4GMjnIloRsVSj0CLmSQiwEUzBx2nD+1YT6rEVlhEwpTXuS1jd24HYd1JcX8sNCUodw9otOAgheSSj0QqFXyFQhUwEvDzrj0L6gddq9005wbaE9DbNjhukxS2Ic4gvZsmDjtAvtLF+7rQ/AziilXZqkYQmuf4khlSA6jaxap5FaK1nprpg47fKsHK5UglcQPB+SqBPBvwFw665Av5Qqqj35FY5PdM4Fopa3BW6IvirdVRMliEsPXNrIYRM2ha0bQJ1VmPDX7V8svxaXuLmt+1+5LsAuwC7ALsCudQF2AXYBdgF2rQuwC7ALsAuwa12AXYBdgF2AXesC7ALsAuwC7NoX2v8BfvMHgWVagAMAAAAASUVORK5CYII=' style='width:100%;height:100%;object-fit:contain;border-radius:inherit;' alt='NAC'></div><h2>Billfold</h2><p>NAC OS Command Centre</p>
<div class="login-err" id="lerr">Wrong password.</div>
<input class="login-input" type="password" id="lpw" placeholder="Admin password" autofocus>
<button class="login-btn" onclick="doLogin()">Access Dashboard \u2192</button>
<p style="margin-top:12px;font-size:11px;color:var(--muted)"><a href="/admin" style="color:var(--accent)">\u2192 License Admin Panel</a></p>
</div></div>
<div class="app" id="app" style="display:none">
<aside class="sidebar">
<div class="brand"><div class="brand-icon"><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAOG0lEQVR42u2bSWxcR3rHf1/Ve70vbJKiSIq0tViy5QiK5NFYGUHwIidAHNhIJmMbSBBMcskAuRnIMQiQe26DIIcgTg5BgACJk5nJ2Jnxrhnvsq1IHtuSJYsSJVEUdzZ7eVtV5fCapOg1NkibGvR36UYvVe/9+l/fVtUCOLr2lU11EXQBdgF2AXYBdq0LsAuwC7ALsGtdgF2AXYBdgF3rAuwCvHnM2zRXIqAERNLnzoJzq++JrH7Uuc57X7KTKSodd50v+5ttqEpnDXyVG1O6A/NzviuSzmFNRzEZwc8rgrrFOXfzKnBZDcs3n80pRnZ77D6QZc/+PDtuL1LrzWMlYanZZmoyYOJSxPjZhIvvRYy/nxCHblWh3KBYQKn0dWvAGdAe7DyUAQ/G/zfBrZNuvn4F3jCj1sLwXo+9R332Hc2w50CGwWGfrK+JG1mWZjzmZkMW622CMME4i3gOtKWx6Bg7FXPqmYjxd5MVRQpgzOp0+bLi0IMZBvZ4fPBqzJnj4Yoabz6AndmUEob3a7Yf9hj5DU3/sCYrwtI1uPqh4eo5w8wVQ33OEDQtcRtcnH5XNGQKQm1IMbrXY2CHpj5jOf1sxOKkWZlo910+R7+X49YDmvffjHnmiYCFK8lG6uHrscqQ5tbf0pRvEQplRQZhYdxx7Yxh+pKhteCw4adHCAGkE03sjetVw7YdWXr7Nd86luXwQxn6RoQTxwN+9Pctzr0W3fxBRAS23OnRs1NQGUe+KISzwtRZy+I1S9J2OOvWfJ4OMKXSizTJ2kvdNlrgwHfy7PtOhjuOaLbvV8SR4dWfB/z4n1qceinEBnZlLOe4ORWofKHvDoXOg/YhVxAWLkL9qiUJbgAnqw9KCQ63xl8V8hn2Hahx9/1V7ro3w8g+Q2koQiRhZiLh5acCnn2yxfsnIoI5i4jbMHBfG0DlC7XbNElg8QuCnxcWLjrCBYtN3Jqr+HjKATAwUOTIvYPc/+Aoh+7po39XQsw0EQu0XcD4BxGv/U+bXzzd5qMPQtoLFhvCnvt9zr4YgdtYgBuaxogSyrcomtctfim9kZkPPmW5dmoiZ9OUo1r1OPI7VR74bo1D91XZNlwjQ40EH0NCZBRnT8IL/93gleeWuDwWEbccYd3iHDz8lwWWtOHMCxu/vryN1HVxWNG+7hDt0DnF4lgK71OrAwfDO3zueSTPPb9fYvQOHz8X0oynuNxqMVQQdFzhzV9O89MfX+TEq/NMTUQkLUfSdsSho1hRPPpXJWq3w5NPBPhFRalXmB83G7bWvI2Cl+sTkpYlbkFlh9C44tbAE1mtImqDmsPfy7H/t30qA4oFCWieC+jt87hlJA8txdM/neDZn5zm3dNzNBYs8RLELUscpWMevDfPQ48XUFXDy88EhJElaQnV/Qq0Yn7Mrsy5uQG61O/prNCcsJRGNO1ZR9Kyn4CntbD3gQx7jnlkq3B1MmZpSVMb0AyPekjb45l/jDj+1GXGPmoRNh2mJYQNR2LS8Ua2Z3ns8Qq7jwlj4wFzFxyXxyLECA6YPm/ZekCxMG7XPYVZf4DL6usV2jOOTFlwxhEtfBJedVBzx4MehSG4PpNQbCsqNYXeAhLDG/8W8dZzDSYux9jYYVrQXrIrJdjo9gKP/aCfw48I86bFh2dbeEpz/kxIs2ExsSAKWrOWoCnktypaE3bdl7K37urLCM4JNrJktmpa1+0awM7BwF7Ntrs1DWNoTQj5kmBLDt+HsVcS3nshYOqqQQFJ2xE0V8c4dPdWHv2zYb71sKORm+OjS3Vmpw21Hp8zp2IuXgjBCUlbcMaCg2DBkSlC2xNc4japAju/bKYsRIuWTFkwocN2fNSy8oYOeBS3wdSlhEKvwi+A8iCegdefirh+wSJA0rJEHZ9ZrWb53YdG+cM/GWXPEcWsXOHC5CxLk4Z2C/r6faYuWd5+q4VCiCOwrVWlJUHaKtM5SBqbdQkvp3Q+mNCR69cEM3YNvC37NHhw/V1LfosQZhy5kjBzyjH5XkwSgQ1Xwe09UOC7fzzIsYeHqNxiuR5c5q2peaIQsIrECH19itkxeObZJZLYETTTueKFVaUZ49BZ1Yn6bl194bouYZ0VXALKE5x1mNCtLNvqdo01MP2eIVMW4gYUasLEq4al6+kPEDXSOzv0QI7f+9Miew8XcNmYD1tnic4n+FrjaQ+TWBJnGBrwOfVUwvPv1ImcIQkcYQAKRTi9CtBZUL7DJQ7xwYWbDWBn+eoc2MihfEjaq8rM9gg6D3NnLMpPOyrZsjB12pA0hajj4+48muHY9/MM3KaYr0ccf6dNuayo9fgU8h7GQrMZU+vzyCc5fvK3Lc7Nt5E+i5mFdhNEC8l0ugqWc0ylIJMHl4Bk1jeKrKsClSdprueDWfZ9GvIDioXzaQfYLyny/Yq5cwYbQBJa+rdr7n40y9bbFZdmIt573lKuKrZsUZisotmwBG1HoaK4ZVuWC7+0PPnDBUr7LLkRy/ykJWg54lDwc4rFC2vXqPbBz6VVjpJNnMaIcmA79WzcaWhuUbSnHTZO05r8QKciaaWf2/OAz+hBzfRSwsWXLIWKotwjJBEsLjrC0NDTq9i+K4NuaP758SZjZ0MOPuYx2bTMXzXEATTr4BeEYMwRN1ddB4BfBJ0RnHMrWwibNA8U6HRAbOJQvqCy0Jq06JyQH1QsjRuSFuT7YOSwRxLAqWdiClug1C+YyNGsQxQaLIq+QY+Sp3n+7wJOPhey774Mxx7PcupXbeqzBhNDc9EhnqACxeK5ZDXX66it2CtozZqOz+ZUYKe2tZ3aNlMVooVUDaURReuaJWk5yqOKnh2KiZOGuAmFfiH2oWEdUQjVYejv1+SN4u1/ifnoRJudv+nz2N+UmGrHvP5GCxs7ktjRWnQYI5SrmivPmTTCyqr/FYHKsNC6kr4gqM3rA51NfR5mOSpDMOMoDCmCOUfccFR2KDIV4corCSKCn4f2jCMJhJ6cotKjkHk4fTyhft2y6y6fR/66CCV4690WS4sWpSCKHO0lRxwJPQMe144boiW3kjItP+Z6FL3bFLOnU7LOuc2rQBunyzYOLTorxG2Hl09LqnDOUhxJt89mTqWFvXWOuCkUB4XKqMKFcP7nCdqDHYc8jnw/i9Vw8v2AxbohlxOcg6CdKi+Jhd5Bn4lfGBrXPtYs6CzjLXuEQlmoX7WITiPx5gO4nPGHjmxewAoqlwaSTE1oTViy/an3rncipHOQ61UUB4QkhLlzlvKAsPOoR6kmLF53vPyfAcZzFPvAzwth02KStCb28oreHo/LLxqWrppPdlo6z3cf1cSL0Jh1ZMrqE+20TaVAE6Y+UFR6M35ZSBoOlQOvAM3xFJ5fFvJ9ggmhMemojgjbDihcLIyfSJi/7NAZKG4RcjUhxBHlLE7AAuUBDx0pxp5OaM/ZNRH3xh7jwC7N6H7FiX81ne442KVNXgubsJMyWIfOCMGUIz+kaI6nSXSuX2ETaM86KtvSfl206PjoeUNYdyt5mxIhWgJrHXoJxBdKw1Ad0ixdclx9M+3SfHZ3RTj4B5qkBRdeNyhfVlKrTV0LR3WHXxSsD0nL4VeFcMbhlQSvKIQLjsKA0L9XES7ApZdMWvJ1lCN0ysDIYZI0opeGhPKIAgvjLxgak/Yzd3SUTvdUdt3tsf3birf/3dCuW/K9imDRbmKANwQSEwoql+Z0ImmDAcC0HH13Cs7C5InV9v6N52OW+31+XihsFQoDAgpmz1oaEw5nblCd4xPbA9ZAZYvm23+kmR+HX/0sQWdk5YjHTbEnkrQttAW/ms5gmmniXBxR1C9aghm3xlctd0dEIFtLoXlFIQkcCxcdwZxb28dzn1YFpeNkC4r7fpAh3wMv/jAhaDoK/Zr2vN2IW924XTnRDskp4llH6VZBeTDzzg2J7vKpKoFsRcj1Cl4pfS1ahPpli2kvw/18x7+8bHNFxbG/yDKwF979keXiyZhsRRG3O8q9mfaFlZ+WA+WdQtKE5pW1CvBLQrYm+KW07R83U/+ZtPh/3+yNZwl7BzX3/nmW2m64+LLjxX8I0HnwskKwYNkwoWwIwM5xs8puTTjvCKZtp1sD2V5FppxOmjQhajhM230p//TxM4V3Hslw1yM+fs1y6TXH8SdC0Gl3PJizN9nJhM6I5e2KqO4I5xwqI2R7BZ0D04Z4yWGCtDMs0rkA98VKEzp1dse23upx8KEMQweFJLF8+Jzljf8IUb6QrSiCBbMhgWPjAHZGy29V2MQRzjryWxQqB3ETkqZDcJiYNCP+vHE+A6pSwrY9HnuOeozcpZCCY3Hcceq/Ei6cjPFygl9QBIsbD29DFKgLqV+L5tMmQtJyhPOpE1e+UNkp1HamqUx7FsIZR1RPO9gmclizenZUAV5WkStBdVCxdbdm8A5NbXtaKjanLeOvWU7/LCZoWbJVBQLR4sYu2w1VYLY3PYvmFSGYTpfqxy3Xp+i9TaiMCjrvMBZcLBA7XAxaCV4GMjnIloRsVSj0CLmSQiwEUzBx2nD+1YT6rEVlhEwpTXuS1jd24HYd1JcX8sNCUodw9otOAgheSSj0QqFXyFQhUwEvDzrj0L6gddq9005wbaE9DbNjhukxS2Ic4gvZsmDjtAvtLF+7rQ/AziilXZqkYQmuf4khlSA6jaxap5FaK1nprpg47fKsHK5UglcQPB+SqBPBvwFw665Av5Qqqj35FY5PdM4Fopa3BW6IvirdVRMliEsPXNrIYRM2ha0bQJ1VmPDX7V8svxaXuLmt+1+5LsAuwC7ALsCudQF2AXYBdgF2rQuwC7ALsAuwa12AXYBdgF2AXesC7ALsAuwC7NoX2v8BfvMHgWVagAMAAAAASUVORK5CYII=' style='width:100%;height:100%;object-fit:contain;border-radius:inherit;' alt='NAC'></div><div class="brand-text"><div class="title">NAC OS</div><div class="sub">Billfold Command</div></div></div>
<div class="nav-label">Core</div>
<div class="nav-item active" onclick="sv('dashboard',this)"><span class="nav-dot"></span>Dashboard</div>
<div class="nav-item" onclick="sv('billfold',this)"><span class="nav-dot"></span>Billfold Ledger</div>
<div class="nav-item" onclick="sv('leads',this)"><span class="nav-dot"></span>Lead Pipeline</div>
<div class="nav-item" onclick="sv('licenses',this)"><span class="nav-dot"></span>License Keys</div>
<div class="nav-label">Command</div>
<a class="nav-item" href="/nac-os/command-centre" target="_blank"><span class="nav-dot"></span>Command Centre \u2197</a>
<div class="nav-label">Operations</div>
<a class="nav-item" href="/admin" target="_blank"><span class="nav-dot"></span>Order Admin \u2197</a>
<a class="nav-item" href="/learning" target="_blank"><span class="nav-dot"></span>Learning Academy \u2197</a>
<div class="nav-item" onclick="sv('automations',this)"><span class="nav-dot"></span>Automations</div>
<div class="nav-label">Growth</div>
<a class="nav-item" href="https://dashboard.stripe.com" target="_blank"><span class="nav-dot"></span>Offers + Stripe \u2197</a>
<div class="nav-item" onclick="sv('nurture',this)"><span class="nav-dot"></span>Email Sequences</div>
<div class="sidebar-footer" id="sys-status"><span class="status-dot"></span>Loading...</div>
</aside>
<main class="main" id="main-content"><div class="loading"><div class="spinner"></div></div></main>
</div>
<script>
const API=window.location.origin;let pw='',stats=null,curView='dashboard';
const TIERS={SOLO:'Fleet Solo',ADDON:'Fleet Add-on',FLEET:'Fleet Fleet',OCOS1:'OCOS T1',OCOS2:'OCOS T2',OCOS3:'OCOS T3',OCOSB:'OCOS Bundle',PRACS:'Partner Starter',PRACG:'Partner Growth',PRACP:'Partner Pro',PRACA:'Partner Agency'};
function authH(){return{'Content-Type':'application/json','X-Admin-Password':pw};}
async function doLogin(){const p=document.getElementById('lpw').value;const e=document.getElementById('lerr');e.style.display='none';try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:p})});if(r.ok){pw=p;localStorage.setItem('nac_pw',p);document.getElementById('ls').style.display='none';document.getElementById('app').style.display='grid';await load();}else{e.style.display='block';}}catch(err){e.textContent='Connection error.';e.style.display='block';}}
async function tryAuto(){const s=localStorage.getItem('nac_pw');if(!s)return;try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:s})});if(r.ok){pw=s;document.getElementById('ls').style.display='none';document.getElementById('app').style.display='grid';await load();}}catch(e){}}
document.getElementById('lpw').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
async function load(){const r=await fetch(API+'/api/dashboard/stats',{headers:authH()});stats=await r.json();render(curView);updateStatus();}
function sv(view,el){curView=view;document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));el.classList.add('active');render(view);}
function render(view){const m=document.getElementById('main-content');switch(view){case'dashboard':m.innerHTML=renderDash();break;case'billfold':m.innerHTML=renderBillfold();break;case'leads':m.innerHTML=renderLeads();break;case'licenses':m.innerHTML=renderLicenses();break;case'automations':m.innerHTML=renderAuto();break;case'nurture':m.innerHTML=renderNurture();break;default:m.innerHTML=renderDash();}}
function fmt(c){const d=c/100;return d>=1000?'$'+(d/1000).toFixed(1)+'k':'$'+d.toFixed(0);}
function fmtFull(c){return'$'+(c/100).toLocaleString('en-CA',{minimumFractionDigits:2});}
function fmtDate(str){if(!str)return'\u2014';return new Date(str+'Z').toLocaleDateString('en-CA');}
function timeAgo(str){if(!str)return'\u2014';const diff=Date.now()-new Date(str+'Z').getTime();const m=Math.floor(diff/60000);if(m<1)return'just now';if(m<60)return m+'m ago';const h=Math.floor(m/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago';}
function tierLabel(t){return TIERS[t]||t;}
function renderDash(){if(!stats)return'';const monthly=fmtFull(stats.revenue.monthly);const total=fmtFull(stats.revenue.total);const weekly=stats.revenue.weekly||[];const maxR=weekly.length>0?Math.max(...weekly.map(w=>w.revenue)):1;const wLabels=['Week 1','Week 2','Week 3','Week 4'];const wMap={};weekly.forEach(w=>wMap[w.week]=w.revenue);
const bars=wLabels.map(l=>{const r=wMap[l]||0;const pct=maxR>0?Math.max(4,(r/maxR)*100):4;return\`<div class="bar-col"><div class="bar-val">\${r>0?fmt(r):'\u2014'}</div><div class="bar" style="height:\${pct}%"></div><div class="bar-label">\${l}</div></div>\`;}).join('');
const rows=(stats.recent_orders||[]).slice(0,6).map(o=>\`<tr><td>\${o.customer_name||'\u2014'}</td><td>\${tierLabel(o.tier)}</td><td style="color:var(--muted);font-size:11px">\${timeAgo(o.created_at)}</td><td style="color:var(--accent)">\${fmtFull(o.amount)}</td><td><span class="sdot \${o.order_status==='approved'?'':o.order_status==='pending'?'pending':'rejected'}">\${o.order_status}</span></td></tr>\`).join('')||'<tr><td colspan="5" style="text-align:center;color:var(--dim);padding:20px">No transactions yet</td></tr>';
const pending=stats.orders.pending;
const tasks=[pending>0?{t:pending+' order'+(pending>1?'s':'')+' pending review',s:'Open admin panel to approve and send license keys.',tag:'urgent'}:{t:'All orders processed \u2713',s:'No pending orders. Auto-approve is active.',tag:''},{t:'Review lead nurture sequence',s:stats.leads.total+' leads in pipeline. Day 1/3/7 emails via Cloudflare Cron.',tag:''},{t:'OCOS Partner outreach',s:'30 LinkedIn targets identified. Begin warm outreach when ready.',tag:'sales'}].map(t=>\`<div class="task"><div class="tick"></div><div><div class="task-title">\${t.t}</div><div class="task-sub">\${t.s}</div>\${t.tag?\`<span class="tag \${t.tag}">\${t.tag}</span>\`:''}</div></div>\`).join('');
const tierBars=(()=>{const tiers=stats.revenue.byTier||[];if(!tiers.length)return'<div style="text-align:center;color:var(--dim);padding:20px;font-size:12px">Revenue by tier appears after first sales.</div>';const maxRev=Math.max(...tiers.map(t=>t.revenue));return tiers.map(t=>\`<div class="tier-row"><div class="tier-header"><span class="tier-name">\${tierLabel(t.tier)} <span style="color:var(--dim);font-size:11px">(\${t.count})</span></span><span class="tier-amt">\${fmtFull(t.revenue)}</span></div><div class="tier-track"><div class="tier-fill" style="width:\${maxRev>0?(t.revenue/maxRev*100):0}%"></div></div></div>\`).join('');})();
return\`<div class="topbar"><div class="topbar-left"><h1>Billfold <em>Command.</em></h1><div class="sub">Revenue, leads, licenses, and system health \u2014 live.</div></div><div class="topbar-right"><div class="chip" onclick="load()">\u21BB Refresh</div><a href="/admin" target="_blank" class="chip accent">Admin Panel \u2197</a></div></div>
<div class="stats-grid"><div class="card stat-card"><div class="stat-eyebrow">30-Day Revenue</div><div class="stat-value green">\${monthly}</div><div class="stat-meta">All time: \${total}</div></div><div class="card stat-card"><div class="stat-eyebrow">Active Leads</div><div class="stat-value">\${stats.leads.total}</div><div class="stat-meta">\${stats.leads.converted} PDF delivered \xB7 \${stats.leads.sequence_complete} sequence complete</div></div><div class="card stat-card"><div class="stat-eyebrow">Conversion Rate</div><div class="stat-value">\${stats.conversion_rate}%</div><div class="stat-meta">\${stats.orders.approved} sales from \${stats.leads.total} leads</div></div><div class="card stat-card"><div class="stat-eyebrow">Active Licenses</div><div class="stat-value">\${stats.licenses.active}</div><div class="stat-meta">\${stats.orders.pending>0?'<span class="stat-warn-text">\u26A0 '+stats.orders.pending+' pending</span>':'All orders processed \u2713'}</div></div></div>
<div class="row row-main"><div class="card"><div class="card-head"><div><h2>Billfold Revenue Overview</h2><div class="sub">28-day performance \xB7 CAD</div></div><div class="pill">Live</div></div><div class="chart-wrap">\${weekly.length>0||stats.revenue.total>0?\`<div class="bar-chart">\${bars}</div>\`:'<div class="chart-empty">Revenue data appears here once sales come in.</div>'}</div></div><div style="display:grid;gap:16px"><div class="card"><div class="card-head"><div><h2>Today's Priority Queue</h2><div class="sub">Operations + sales actions</div></div></div><div class="task-list">\${tasks}</div></div></div></div>
<div class="row row-lower"><div class="card"><div class="card-head"><div><h2>Recent Billfold Transactions</h2><div class="sub">Latest paid activity</div></div><div class="pill">D1</div></div><div class="table-wrap"><table><thead><tr><th>Client</th><th>Product</th><th>When</th><th>Value</th><th>Status</th></tr></thead><tbody>\${rows}</tbody></table></div></div><div class="card"><div class="card-head"><div><h2>Revenue by Product</h2><div class="sub">All-time breakdown</div></div></div><div class="tier-list">\${tierBars}</div></div></div>
<div class="bottom-panel"><div class="bp-item"><div class="bp-label">Total Sales</div><div class="bp-value green">\${stats.orders.approved}</div></div><div class="bp-item"><div class="bp-label">Total Licenses</div><div class="bp-value">\${stats.licenses.total}</div></div><div class="bp-item"><div class="bp-label">Lead Pipeline</div><div class="bp-value">\${stats.leads.total}</div></div><div class="bp-item"><div class="bp-label">All-Time Revenue</div><div class="bp-value green">\${total}</div></div></div>\`;}
function renderBillfold(){if(!stats)return'';const rows=(stats.recent_orders||[]).map(o=>\`<tr><td style="font-size:11px;color:var(--dim)">#\${o.id}</td><td>\${o.customer_name||'\u2014'}</td><td style="font-size:11px;color:var(--muted)">\${o.email||'\u2014'}</td><td>\${tierLabel(o.tier)}</td><td style="color:var(--accent)">\${fmtFull(o.amount)}</td><td><span class="sdot \${o.order_status==='pending'?'pending':o.order_status==='rejected'?'rejected':''}">\${o.order_status}</span></td><td style="font-size:11px;color:var(--muted)">\${fmtDate(o.created_at)}</td></tr>\`).join('')||'<tr><td colspan="7" style="text-align:center;color:var(--dim);padding:24px">No transactions yet</td></tr>';
return\`<div class="topbar"><div class="topbar-left"><h1>Billfold <em>Ledger.</em></h1><div class="sub">Complete transaction history</div></div><a href="/admin" target="_blank" class="chip accent">Manage Orders \u2197</a></div>
<div class="stats-grid" style="grid-template-columns:repeat(3,1fr)"><div class="card stat-card"><div class="stat-eyebrow">Total Revenue</div><div class="stat-value green">\${fmtFull(stats.revenue.total)}</div><div class="stat-meta">All approved orders</div></div><div class="card stat-card"><div class="stat-eyebrow">Total Orders</div><div class="stat-value">\${stats.orders.total}</div><div class="stat-meta">\${stats.orders.approved} approved \xB7 \${stats.orders.pending} pending</div></div><div class="card stat-card"><div class="stat-eyebrow">Avg Order Value</div><div class="stat-value">\${stats.orders.approved>0?fmtFull(Math.round(stats.revenue.total/stats.orders.approved)):'\u2014'}</div><div class="stat-meta">Per approved order</div></div></div>
<div class="card"><div class="card-head"><div><h2>All Transactions</h2><div class="sub">Most recent first</div></div><div class="pill">D1</div></div><div class="table-wrap"><table><thead><tr><th>Order</th><th>Client</th><th>Email</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>\${rows}</tbody></table></div></div>\`;}
function renderLeads(){if(!stats)return'';return\`<div class="topbar"><div class="topbar-left"><h1>Lead <em>Pipeline.</em></h1><div class="sub">Playbook downloads \xB7 nurture sequence \xB7 CASL compliant</div></div></div>
<div class="stats-grid"><div class="card stat-card"><div class="stat-eyebrow">Total Leads</div><div class="stat-value">\${stats.leads.total}</div><div class="stat-meta">Ontario Contractor Compliance Playbook</div></div><div class="card stat-card"><div class="stat-eyebrow">PDF Delivered</div><div class="stat-value green">\${stats.leads.converted}</div><div class="stat-meta">Day 0 email via Resend</div></div><div class="card stat-card"><div class="stat-eyebrow">Sequence Complete</div><div class="stat-value">\${stats.leads.sequence_complete}</div><div class="stat-meta">Completed Day 1/3/7</div></div><div class="card stat-card"><div class="stat-eyebrow">Unsubscribed</div><div class="stat-value">\${stats.leads.unsubscribed}</div><div class="stat-meta">CASL s.11 compliant</div></div></div>
<div class="card"><div class="card-head"><div><h2>Nurture Sequence</h2><div class="sub">Cloudflare Cron \xB7 daily 8 AM ET</div></div><div class="pill">Live</div></div><div class="task-list"><div class="task"><div class="tick"></div><div><div class="task-title">Day 0 \u2014 PDF Delivery</div><div class="task-sub">Fires immediately on form submit via /api/leads/submit.</div></div></div><div class="task"><div class="tick"></div><div><div class="task-title">Day 1 \u2014 MOL Pre-Shift Inspection</div><div class="task-sub">O.Reg 213/91 documentation requirements. Educational \u2014 no pitch.</div></div></div><div class="task"><div class="tick"></div><div><div class="task-title">Day 3 \u2014 WSIB Clearance</div><div class="task-sub">WSIA s.141 liability. Soft CTA to OCOS T1 pricing page.</div></div></div><div class="task"><div class="tick"></div><div><div class="task-title">Day 7 \u2014 MOL Audit Checklist</div><div class="task-sub">5-point checklist. Direct OCOS T1 offer $397. Final email.</div></div></div></div></div>\`;}
function renderLicenses(){if(!stats)return'';return\`<div class="topbar"><div class="topbar-left"><h1>License <em>Keys.</em></h1><div class="sub">Active licenses \xB7 Cloudflare Worker + D1</div></div><a href="/admin" target="_blank" class="chip accent">Manage Keys \u2197</a></div>
<div class="stats-grid" style="grid-template-columns:repeat(3,1fr)"><div class="card stat-card"><div class="stat-eyebrow">Total Keys</div><div class="stat-value">\${stats.licenses.total}</div></div><div class="card stat-card"><div class="stat-eyebrow">Active</div><div class="stat-value green">\${stats.licenses.active}</div></div><div class="card stat-card"><div class="stat-eyebrow">From Stripe</div><div class="stat-value">\${stats.licenses.stripe}</div></div></div>
<div class="card"><div class="card-head"><div><h2>License Management</h2></div></div><div style="padding:24px;text-align:center;color:var(--muted)"><p style="margin-bottom:16px">Full license management \u2014 activate, deactivate, generate, resend \u2014 is in the Admin Panel.</p><a href="/admin" target="_blank" class="chip accent" style="display:inline-flex">Open Admin Panel \u2197</a></div></div>\`;}
function renderAuto(){const autos=[{n:'Stripe Webhook \u2192 Order Creation',d:'POST /api/stripe/webhook \xB7 checkout.session.completed \xB7 creates D1 order record'},{n:'Auto-Approve \u2192 License + Email',d:'Generates license key \xB7 sends via Resend from billing@naturalalternatives.ca'},{n:'Sale Notification \u2192 Owner Email',d:'Fires on every purchase \xB7 delivers to info@naturalalternatives.ca instantly'},{n:'Lead Capture \u2192 PDF Delivery',d:'POST /api/leads/submit \xB7 saves to D1 \xB7 Resend Day 0 \xB7 redirects to thank-you.html'},{n:'Nurture Cron \u2192 Day 1/3/7 Emails',d:'Cloudflare Cron 0 13 * * * (8 AM ET) \xB7 purchase suppression built in'},{n:'Support Chat \u2192 Static FAQ',d:'GET /api/support/widget.js \xB7 30+ Q&As \xB7 escalation to info@naturalalternatives.ca'},{n:'CASL Unsubscribe',d:'GET /unsubscribe?email=... \xB7 D1 flag set instantly \xB7 CASL s.11 compliant'}];
return\`<div class="topbar"><div class="topbar-left"><h1>Automation <em>Stack.</em></h1><div class="sub">All 7 live on Cloudflare Workers \xB7 zero third-party platforms</div></div></div>
<div class="stats-grid" style="grid-template-columns:repeat(3,1fr)"><div class="card stat-card"><div class="stat-eyebrow">Total Automations</div><div class="stat-value green">7</div></div><div class="card stat-card"><div class="stat-eyebrow">Healthy</div><div class="stat-value green">7</div></div><div class="card stat-card"><div class="stat-eyebrow">Platform Cost</div><div class="stat-value">$0</div><div class="stat-meta">Cloudflare free tier</div></div></div>
<div class="card"><div class="card-head"><div><h2>Automation Registry</h2><div class="sub">nacosapp.craig3113.workers.dev</div></div><div class="pill">All Live</div></div><div class="task-list">\${autos.map(a=>\`<div class="task"><div class="tick" style="background:rgba(79,210,140,.15);border-color:rgba(79,210,140,.4);display:flex;align-items:center;justify-content:center;font-size:9px;color:#4fd28c">\u2713</div><div><div class="task-title">\${a.n}</div><div class="task-sub">\${a.d}</div></div><div style="margin-left:auto;flex-shrink:0"><span class="tag" style="color:var(--accent);border-color:rgba(79,210,140,.3)">live</span></div></div>\`).join('')}</div></div>\`;}
function renderNurture(){return\`<div class="topbar"><div class="topbar-left"><h1>Email <em>Sequences.</em></h1><div class="sub">Lead nurture \xB7 product onboarding \xB7 renewal reminders</div></div></div>
<div class="stats-grid" style="grid-template-columns:repeat(2,1fr)"><div class="card stat-card"><div class="stat-eyebrow">Lead Nurture</div><div class="stat-value green">4</div><div class="stat-meta">Day 0/1/3/7 \xB7 Cloudflare Cron</div></div><div class="card stat-card"><div class="stat-eyebrow">Engine</div><div class="stat-value">Resend</div><div class="stat-meta">3,000/mo free tier</div></div></div>
<div class="card"><div class="card-head"><div><h2>Active Sequences</h2></div><div class="pill">Live</div></div><div class="task-list"><div class="task"><div class="tick"></div><div><div class="task-title">Day 0 \u2014 Ontario Contractor Compliance Playbook</div><div class="task-sub">Instant on submit. PDF download link. From info@naturalalternatives.ca.</div></div></div><div class="task"><div class="tick"></div><div><div class="task-title">Day 1 \u2014 MOL Pre-Shift Inspection</div><div class="task-sub">O.Reg 213/91. Educational, no pitch.</div></div></div><div class="task"><div class="tick"></div><div><div class="task-title">Day 3 \u2014 WSIB Clearance Liability</div><div class="task-sub">WSIA s.141. Soft CTA to OCOS T1.</div></div></div><div class="task"><div class="tick"></div><div><div class="task-title">Day 7 \u2014 MOL Audit Checklist + OCOS T1 Offer</div><div class="task-sub">$397 one-time. Final email in sequence.</div></div></div></div></div>\`;}
function updateStatus(){const el=document.getElementById('sys-status');if(!el||!stats)return;const p=stats?.orders?.pending||0;el.innerHTML=p>0?\`<span class="status-dot" style="background:var(--warn);box-shadow:0 0 8px var(--warn)"></span>\${p} order\${p>1?'s':''} pending\`:'<span class="status-dot"></span>All systems operational';}
tryAuto();
setInterval(()=>{if(pw)load();},60000);
<\/script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store", "cf-edge-cache": "no-store" } });
}
__name(handleDashboard, "handleDashboard");
__name2(handleDashboard, "handleDashboard");
async function handlePlaybookDownload(request, env) {
  const PDF_URL = "https://naturalalternatives.ca/ontario-contractor-compliance-playbook.pdf";
  try {
    const res = await fetch(PDF_URL);
    if (!res.ok)
      return new Response("PDF not found", { status: 404 });
    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ontario-contractor-compliance-playbook.pdf"',
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (err) {
    return new Response("Download failed", { status: 500 });
  }
}
__name(handlePlaybookDownload, "handlePlaybookDownload");
__name2(handlePlaybookDownload, "handlePlaybookDownload");
async function cmdAuditLog(env, source, table_name, record_id, field, old_val, new_val, note) {
  try {
    await env.CMD_DB.prepare(
      "INSERT INTO audit_log (source, table_name, record_id, field, old_val, new_val, note) VALUES (?,?,?,?,?,?,?)"
    ).bind(
      source,
      table_name,
      record_id || null,
      field || null,
      old_val == null ? null : String(old_val),
      new_val == null ? null : String(new_val),
      note || null
    ).run();
  } catch (e) {
    console.error("audit_log insert failed:", e.message);
  }
}
__name(cmdAuditLog, "cmdAuditLog");
__name2(cmdAuditLog, "cmdAuditLog");
async function handleCmdDraws(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (request.method === "GET") {
    const { results } = await env.CMD_DB.prepare("SELECT * FROM draws ORDER BY id").all();
    const { results: lineItems } = await env.CMD_DB.prepare("SELECT * FROM draw_line_items ORDER BY draw_id, sort_order, id").all();
    const grouped = {};
    for (const li of lineItems) {
      if (!grouped[li.draw_id])
        grouped[li.draw_id] = [];
      grouped[li.draw_id].push(li);
    }
    return Response.json({ draws: results, draw_line_items: grouped });
  }
  if (request.method === "POST") {
    if (!isAuthorized(request, env))
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id, field, value } = await request.json();
    const allowed = ["label", "gross", "net", "lender_fee", "legal_fee", "date", "status", "notes"];
    if (!id || !allowed.includes(field))
      return Response.json({ error: "Invalid field" }, { status: 400 });
    const old = await env.CMD_DB.prepare("SELECT " + field + " AS v FROM draws WHERE id = ?").bind(id).first();
    if (!old)
      return Response.json({ error: "Draw not found" }, { status: 404 });
    await env.CMD_DB.prepare("UPDATE draws SET " + field + " = ?, updated_at = datetime('now') WHERE id = ?").bind(value, id).run();
    await cmdAuditLog(env, "dashboard", "draws", id, field, old.v, value, null);
    return Response.json({ success: true });
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
__name(handleCmdDraws, "handleCmdDraws");
__name2(handleCmdDraws, "handleCmdDraws");
async function handleCmdBudget(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (request.method === "GET") {
    const { results } = await env.CMD_DB.prepare(
      "SELECT id, category_id, category_label, name, estimate_ex_hst, actual, status, draw_ref, notes FROM budget_items ORDER BY category_id, id"
    ).all();
    const groups = {};
    const order = [];
    for (const r of results) {
      if (!groups[r.category_id]) {
        groups[r.category_id] = { id: r.category_id, label: r.category_label, items: [] };
        order.push(r.category_id);
      }
      groups[r.category_id].items.push({
        _id: r.id,
        n: r.name,
        ex: r.estimate_ex_hst || 0,
        act: r.actual || 0,
        st: r.status || "Pending",
        dr: r.draw_ref || "",
        notes: r.notes || ""
      });
    }
    return Response.json({ categories: order.map((k) => groups[k]) });
  }
  if (request.method === "POST") {
    if (!isAuthorized(request, env))
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id, field, value } = await request.json();
    const colMap = { n: "name", ex: "estimate_ex_hst", act: "actual", st: "status", dr: "draw_ref", notes: "notes" };
    const col = colMap[field] || (["name", "estimate_ex_hst", "actual", "status", "draw_ref", "notes"].includes(field) ? field : null);
    if (!id || !col)
      return Response.json({ error: "Invalid field" }, { status: 400 });
    const old = await env.CMD_DB.prepare("SELECT " + col + " AS v FROM budget_items WHERE id = ?").bind(id).first();
    if (!old)
      return Response.json({ error: "Item not found" }, { status: 404 });
    await env.CMD_DB.prepare("UPDATE budget_items SET " + col + " = ?, updated_at = datetime('now') WHERE id = ?").bind(value, id).run();
    await cmdAuditLog(env, "dashboard", "budget_items", String(id), col, old.v, value, null);
    return Response.json({ success: true });
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
__name(handleCmdBudget, "handleCmdBudget");
__name2(handleCmdBudget, "handleCmdBudget");
async function handleCmdSettings(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (request.method === "GET") {
    const { results } = await env.CMD_DB.prepare("SELECT key, value, updated_at FROM settings").all();
    const out = {};
    for (const r of results)
      out[r.key] = r.value;
    return Response.json({ settings: out, raw: results });
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
__name(handleCmdSettings, "handleCmdSettings");
__name2(handleCmdSettings, "handleCmdSettings");
async function handleCmdLock(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (!isAuthorized(request, env))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { locked } = await request.json();
  const newVal = locked ? "true" : "false";
  const old = await env.CMD_DB.prepare("SELECT value AS v FROM settings WHERE key = 'lock_mode'").first();
  await env.CMD_DB.prepare(
    "INSERT INTO settings (key, value, updated_at) VALUES ('lock_mode', ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
  ).bind(newVal).run();
  await cmdAuditLog(env, "dashboard", "settings", "lock_mode", "value", old ? old.v : null, newVal, locked ? "locked" : "unlocked");
  return Response.json({ success: true, lock_mode: newVal });
}
__name(handleCmdLock, "handleCmdLock");
__name2(handleCmdLock, "handleCmdLock");
async function handleCmdSync(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (!isAuthorized(request, env))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { source, draws, budget_items, draw_line_items } = body;
  if (!source)
    return Response.json({ error: "source required" }, { status: 400 });
  const stmts = [];
  if (Array.isArray(draws)) {
    for (const d of draws) {
      stmts.push(env.CMD_DB.prepare(
        "INSERT INTO draws (id,label,gross,net,lender_fee,legal_fee,date,status,notes,updated_at) VALUES (?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET label=excluded.label, gross=excluded.gross, net=excluded.net, lender_fee=excluded.lender_fee, legal_fee=excluded.legal_fee, date=excluded.date, status=excluded.status, notes=excluded.notes, updated_at=excluded.updated_at"
      ).bind(d.id, d.label, d.gross || 0, d.net || 0, d.lender_fee || 0, d.legal_fee || 0, d.date || null, d.status || "pending", d.notes || null));
    }
  }
  if (Array.isArray(budget_items)) {
    stmts.push(env.CMD_DB.prepare("DELETE FROM budget_items"));
    for (const i of budget_items) {
      stmts.push(env.CMD_DB.prepare(
        "INSERT INTO budget_items (category_id,category_label,name,estimate_ex_hst,actual,status,draw_ref,notes,updated_at) VALUES (?,?,?,?,?,?,?,?,datetime('now'))"
      ).bind(i.category_id, i.category_label, i.name, i.estimate_ex_hst || 0, i.actual || 0, i.status || "Pending", i.draw_ref || null, i.notes || null));
    }
  }
  if (Array.isArray(draw_line_items)) {
    stmts.push(env.CMD_DB.prepare("DELETE FROM draw_line_items"));
    for (let idx = 0; idx < draw_line_items.length; idx++) {
      const li = draw_line_items[idx];
      stmts.push(env.CMD_DB.prepare(
        "INSERT INTO draw_line_items (draw_id,name,draw_received,amount_spent,running_balance,notes,is_fee,sort_order,updated_at) VALUES (?,?,?,?,?,?,?,?,datetime('now'))"
      ).bind(li.draw_id, li.name, li.draw_received || 0, li.amount_spent || 0, li.running_balance || 0, li.notes || null, li.is_fee ? 1 : 0, idx));
    }
  }
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19);
  stmts.push(env.CMD_DB.prepare("INSERT INTO settings (key,value,updated_at) VALUES ('last_sync', ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at").bind(ts));
  stmts.push(env.CMD_DB.prepare("INSERT INTO settings (key,value,updated_at) VALUES ('last_sync_source', ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at").bind(source));
  if (stmts.length > 0)
    await env.CMD_DB.batch(stmts);
  await cmdAuditLog(
    env,
    source,
    "sync",
    null,
    null,
    null,
    null,
    `${(draws || []).length} draws + ${(budget_items || []).length} budget items + ${(draw_line_items || []).length} draw line items synced`
  );
  return Response.json({ success: true, draws: (draws || []).length, budget_items: (budget_items || []).length, draw_line_items: (draw_line_items || []).length, last_sync: ts });
}
__name(handleCmdSync, "handleCmdSync");
__name2(handleCmdSync, "handleCmdSync");
async function handleFieldJobs(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (request.method === "GET") {
    const { results } = await env.CMD_DB.prepare(
      "SELECT * FROM field_jobs ORDER BY created_at DESC"
    ).all();
    return Response.json({ jobs: results });
  }
  if (request.method === "POST") {
    const { id, name, site, status, quote_ex_hst, lm, crew_lead, start_date, notes } = await request.json();
    const jobId = id || "NAC-LS-" + Date.now().toString(36).toUpperCase();
    await env.CMD_DB.prepare(
      "INSERT INTO field_jobs (id,name,site,status,quote_ex_hst,lm,crew_lead,start_date,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now')) ON CONFLICT(id) DO UPDATE SET name=excluded.name,site=excluded.site,status=excluded.status,quote_ex_hst=excluded.quote_ex_hst,updated_at=datetime('now')"
    ).bind(jobId, name || "New Job", site || "", status || "active", quote_ex_hst || 0, lm || 0, crew_lead || "", start_date || "", notes || "").run();
    return Response.json({ ok: true, id: jobId });
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
__name(handleFieldJobs, "handleFieldJobs");
async function handleFieldScans(request, env) {
  if (!env.CMD_DB)
    return Response.json({ error: "CMD_DB not bound" }, { status: 500 });
  if (request.method === "GET") {
    const url = new URL(request.url);
    const jobId = url.searchParams.get("job_id");
    const sql = jobId ? "SELECT * FROM field_scans WHERE job_id=? ORDER BY ts DESC LIMIT 200" : "SELECT * FROM field_scans ORDER BY ts DESC LIMIT 200";
    const { results } = jobId ? await env.CMD_DB.prepare(sql).bind(jobId).all() : await env.CMD_DB.prepare(sql).all();
    return Response.json({ scans: results });
  }
  if (request.method === "POST") {
    const { job_id, type, crew, fuel_price, hours, crew_count, rate_per_hr, fuel_litres, cost, notes } = await request.json();
    if (!job_id)
      return Response.json({ error: "job_id required" }, { status: 400 });
    await env.CMD_DB.prepare(
      "INSERT INTO field_scans (job_id,ts,type,crew,fuel_price,hours,crew_count,rate_per_hr,fuel_litres,cost,notes) VALUES (?,datetime('now'),?,?,?,?,?,?,?,?,?)"
    ).bind(job_id, type || "Arrival", crew || "Owner", fuel_price || 0, hours || 0, crew_count || 1, rate_per_hr || 38, fuel_litres || 0, cost || 0, notes || "").run();
    await env.CMD_DB.prepare("UPDATE field_jobs SET updated_at=datetime('now') WHERE id=?").bind(job_id).run();
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
__name(handleFieldScans, "handleFieldScans");
function generateDemoCode() {
  const charset = "ACDEFGHJKMNPQRTUVWXY3467";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < 12; i++)
    s += charset[bytes[i] % charset.length];
  return "DEMO-" + s.slice(0, 4) + "-" + s.slice(4, 8) + "-" + s.slice(8, 12);
}
__name(generateDemoCode, "generateDemoCode");
__name2(generateDemoCode, "generateDemoCode");
function isValidEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length < 200;
}
__name(isValidEmail, "isValidEmail");
__name2(isValidEmail, "isValidEmail");
function demoEmailHtml(code, name) {
  const greet = name ? `Hi ${name},` : "Hi there,";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#333333;line-height:1.7;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 20px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dddddd;">
      <tr><td style="background:#0a0a0a;border-bottom:2px solid #00FF41;padding:20px 32px;">
        <span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#00FF41;">NAC OS \xB7 Property Demo Access</span>
      </td></tr>
      <tr><td style="background:#0a0a0a;padding:36px 32px 32px;">
        <div style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#ffffff;line-height:1.15;margin-bottom:12px;">Your demo access is ready.</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.55);">Use the access code below to enter the NAC Property Demo.</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 18px;font-size:15px;color:#555555;">${greet}</p>
        <p style="margin:0 0 24px;font-size:15px;color:#555555;">Thanks for requesting access to the <strong style="color:#333333;">NAC Property Demo</strong>. Your access code is below \u2014 it's also displayed on the page where you requested it.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr><td style="background:#0a0a0a;border:1px dashed rgba(0,255,65,0.4);padding:22px;text-align:center;">
            <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#888888;margin-bottom:8px;">Demo Access Code</div>
            <div style="font-family:'Courier New',monospace;font-size:22px;font-weight:700;color:#00FF41;letter-spacing:0.06em;">${code}</div>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr><td align="center">
            <a href="https://ops.naturalalternatives.ca/nac/property/preview?code=${encodeURIComponent(code)}" style="display:inline-block;padding:13px 32px;background:#00FF41;color:#000000;font-family:'Helvetica Neue',Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;border-radius:3px;">Launch Demo \u2192</a>
          </td></tr>
        </table>
        <p style="margin:0 0 18px;font-size:14px;color:#555555;">The NAC Property Demo previews work orders, tenant management, QR job scanning, compliance tracking, and AI-powered maintenance \u2014 built for property managers who work on site.</p>
        <p style="margin:0 0 18px;font-size:13px;color:#888888;">Your access code is valid for 14 days. If you have questions, just reply to this email.</p>
        <p style="font-size:12px;color:#888888;line-height:1.7;border-top:1px solid #dddddd;padding-top:18px;margin:18px 0 0;">This email was sent because someone (hopefully you) requested NAC Property Demo access at this address. If that wasn't you, you can ignore this message safely \u2014 the code does nothing on its own.</p>
        <p style="font-size:13px;color:#555555;margin:14px 0 0;">Natural Alternatives \xB7 Cornwall ON<br>
          <a href="https://www.naturalalternatives.ca" style="color:#00cc33;text-decoration:none;">naturalalternatives.ca</a> \xB7 <a href="mailto:info@naturalalternatives.ca" style="color:#00cc33;text-decoration:none;">info@naturalalternatives.ca</a>
        </p>
      </td></tr>
      <tr><td style="background:#0a0a0a;padding:14px 32px;text-align:center;">
        <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.3);">NAC OS \u2014 Operating System for Ontario Contractors</span>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}
__name(demoEmailHtml, "demoEmailHtml");
__name2(demoEmailHtml, "demoEmailHtml");
async function sendDemoAccessEmail(env, email, name, code) {
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set \u2014 demo email skipped");
    return { skipped: true };
  }
  const html = demoEmailHtml(code, name);
  const text = `${name ? "Hi " + name : "Hi there"},

Your NAC Property Demo access code: ${code}

Launch the demo: https://ops.naturalalternatives.ca/nac/property/preview?code=${encodeURIComponent(code)}

Valid for 14 days. Questions? Reply to this email.

Natural Alternatives
Cornwall ON`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NAC OS <info@naturalalternatives.ca>",
      to: [email],
      subject: `Your NAC Property Demo access \u2014 ${code}`,
      html,
      text
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return await res.json();
}
__name(sendDemoAccessEmail, "sendDemoAccessEmail");
__name2(sendDemoAccessEmail, "sendDemoAccessEmail");
async function handleDemoRequest(request, env) {
  if (request.method !== "POST")
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  if (!env.DB)
    return Response.json({ error: "DB not bound" }, { status: 500 });
  if (!env.DEMO_CODES)
    return Response.json({ error: "KV not bound" }, { status: 500 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim().slice(0, 100) || null;
  const company = (body.company || "").trim().slice(0, 200) || null;
  const honeypot = (body.website || "").trim();
  if (honeypot)
    return Response.json({ success: true, code: "DEMO-XXXX-XXXX-XXXX", email, expires_at: "" });
  if (!isValidEmail(email))
    return Response.json({ error: "Valid email required" }, { status: 400 });
  const existing = await env.DB.prepare(
    "SELECT id, email, code, attempts, created_at, expires_at, revoked FROM demo_leads WHERE email = ? ORDER BY id DESC LIMIT 1"
  ).bind(email).first();
  const now = /* @__PURE__ */ new Date();
  const nowIso = now.toISOString().replace("T", " ").slice(0, 19);
  const expiresIso = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1e3).toISOString().replace("T", " ").slice(0, 19);
  let code, leadId, isRotation = false, isFresh = false;
  if (!existing) {
    code = generateDemoCode();
    const ins = await env.DB.prepare(
      "INSERT INTO demo_leads (email, name, company, code, source, attempts, created_at, expires_at, revoked) VALUES (?,?,?,?,?,?,?,?,0)"
    ).bind(email, name, company, code, "website", 1, nowIso, expiresIso).run();
    leadId = ins.meta.last_row_id;
    isFresh = true;
  } else {
    const expired = !existing.expires_at || existing.expires_at < nowIso;
    if (existing.revoked || expired) {
      code = generateDemoCode();
      try {
        await env.DEMO_CODES.delete(existing.code);
      } catch (e) {
      }
      const ins = await env.DB.prepare(
        "INSERT INTO demo_leads (email, name, company, code, source, attempts, created_at, expires_at, revoked) VALUES (?,?,?,?,?,?,?,?,0)"
      ).bind(email, name || null, company || null, code, "website-rerequest", 1, nowIso, expiresIso).run();
      leadId = ins.meta.last_row_id;
      isFresh = true;
    } else if (existing.attempts >= 3) {
      const oldCode = existing.code;
      code = generateDemoCode();
      try {
        await env.DEMO_CODES.delete(oldCode);
      } catch (e) {
      }
      await env.DB.prepare("UPDATE demo_leads SET revoked = 1 WHERE id = ?").bind(existing.id).run();
      const ins = await env.DB.prepare(
        "INSERT INTO demo_leads (email, name, company, code, source, attempts, created_at, expires_at, revoked, notes) VALUES (?,?,?,?,?,?,?,?,0,?)"
      ).bind(email, name || null, company || null, code, "website-rotation", 1, nowIso, expiresIso, `rotated from ${oldCode}`).run();
      leadId = ins.meta.last_row_id;
      isRotation = true;
    } else {
      code = existing.code;
      leadId = existing.id;
      await env.DB.prepare("UPDATE demo_leads SET attempts = attempts + 1 WHERE id = ?").bind(existing.id).run();
    }
  }
  try {
    await env.DEMO_CODES.put(code, JSON.stringify({ leadId, email, expires_at: expiresIso }));
  } catch (e) {
    console.error("KV put failed:", e.message);
  }
  let emailStatus = "sent";
  try {
    await sendDemoAccessEmail(env, email, name, code);
  } catch (e) {
    console.error("Demo email failed:", e.message);
    emailStatus = "failed: " + e.message;
  }
  return Response.json({
    success: true,
    code,
    email,
    expires_at: expiresIso,
    rotated: isRotation,
    fresh: isFresh,
    email_status: emailStatus
  });
}
__name(handleDemoRequest, "handleDemoRequest");
__name2(handleDemoRequest, "handleDemoRequest");
async function handleAdminDemoLeads(request, env) {
  if (!isAuthorized(request, env))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (request.method !== "GET")
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  if (!env.DB)
    return Response.json({ error: "DB not bound" }, { status: 500 });
  const { results } = await env.DB.prepare(
    "SELECT id, email, name, company, code, source, attempts, created_at, expires_at, last_used_at, revoked, notes FROM demo_leads ORDER BY id DESC LIMIT 500"
  ).all();
  return Response.json({ leads: results });
}
__name(handleAdminDemoLeads, "handleAdminDemoLeads");
__name2(handleAdminDemoLeads, "handleAdminDemoLeads");
async function handleAdminDemoRevoke(request, env, path) {
  if (!isAuthorized(request, env))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (request.method !== "POST")
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  if (!env.DB)
    return Response.json({ error: "DB not bound" }, { status: 500 });
  const m = path.match(/^\/api\/admin\/demo-leads\/(\d+)\/revoke\/?$/);
  if (!m)
    return Response.json({ error: "Invalid path" }, { status: 400 });
  const id = parseInt(m[1], 10);
  const row = await env.DB.prepare("SELECT id, code FROM demo_leads WHERE id = ?").bind(id).first();
  if (!row)
    return Response.json({ error: "Not found" }, { status: 404 });
  await env.DB.prepare("UPDATE demo_leads SET revoked = 1 WHERE id = ?").bind(id).run();
  try {
    await env.DEMO_CODES.delete(row.code);
  } catch (e) {
  }
  return Response.json({ success: true, id, code: row.code });
}
__name(handleAdminDemoRevoke, "handleAdminDemoRevoke");
__name2(handleAdminDemoRevoke, "handleAdminDemoRevoke");
function handleNacPropertyPreview() {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NAC Property Demo \u2014 Preview</title><style>:root{--g0:#060606;--g1:#0C0C0C;--g2:#151515;--g3:#1E1E1E;--g4:#2D2D2D;--g5:#3C3C3C;--g6:#666666;--g7:#909090;--g8:#D8D8D8;--g9:#F2F2F2;--green:#00FF41;--green-dim:rgba(0,255,65,.12);--green-subtle:rgba(0,255,65,.04);--orange:#F97316;--orange-dim:rgba(249,115,22,.12);--red:#EF4444;--blue:#3B82F6;--blue-dim:rgba(59,130,246,.12);--border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.10);--border3:rgba(255,255,255,.16)}*{box-sizing:border-box;margin:0;padding:0}html,body{background:var(--g0);color:var(--g9);font-family:'DM Sans',system-ui,sans-serif;font-size:13px;line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100vh}a{color:inherit;text-decoration:none}::selection{background:var(--green);color:#000}.gate{display:none;align-items:center;justify-content:center;min-height:100vh;padding:24px;background:var(--g0)}.gate.on{display:flex}.gate-box{background:linear-gradient(180deg,rgba(21,21,21,.96) 0%,rgba(12,12,12,.96) 100%);border:1px solid var(--border2);border-radius:5px;padding:38px 36px;width:420px;max-width:100%;text-align:center;position:relative;overflow:hidden}.gate-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 0%,var(--green) 50%,transparent 100%)}.gate-tag{font-family:'DM Mono',monospace;font-size:9px;color:var(--green);letter-spacing:.22em;text-transform:uppercase;margin-bottom:14px}.gate-title{font-family:'Oswald',sans-serif;font-size:28px;font-weight:600;color:var(--g9);margin-bottom:8px;letter-spacing:.4px;line-height:1.1}.gate-sub{font-size:12px;color:var(--g6);line-height:1.6;margin-bottom:24px}.gate-input{width:100%;padding:13px 16px;background:var(--g0);border:1px solid var(--border2);border-radius:3px;color:var(--green);font-family:'DM Mono',monospace;font-size:14px;letter-spacing:.08em;text-align:center;outline:none;transition:border-color .15s;margin-bottom:12px}.gate-input:focus{border-color:var(--green)}.gate-input::placeholder{color:var(--g5);letter-spacing:.06em}.gate-err{font-family:'DM Mono',monospace;font-size:10px;color:var(--red);margin-bottom:10px;display:none;min-height:14px;letter-spacing:.06em}.gate-err.on{display:block}.gate-btn{width:100%;padding:13px;background:var(--green);color:#000;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;border:none;border-radius:3px;cursor:pointer;transition:all .2s}.gate-btn:hover{background:#00cc33}.gate-btn:disabled{background:var(--g4);color:var(--g6);cursor:not-allowed}.gate-foot{margin-top:18px;font-size:11px;color:var(--g6)}.gate-foot a{color:var(--green);text-decoration:none}.preview{display:none;min-height:100vh;flex-direction:column}.preview.on{display:flex}.topbar{position:sticky;top:0;z-index:100;background:rgba(6,6,6,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:12px}.brand-mark{width:28px;height:28px;border:1px solid var(--green);background:var(--green-dim);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-weight:700;font-size:13px;color:var(--green);letter-spacing:.5px}.brand-txt{display:flex;flex-direction:column;line-height:1}.brand-name{font-family:'Oswald',sans-serif;font-size:15px;font-weight:700;letter-spacing:1.6px;color:var(--g9)}.brand-sub{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.22em;text-transform:uppercase;margin-top:3px}.tb-meta{display:flex;align-items:center;gap:14px;font-family:'DM Mono',monospace;font-size:9px;color:var(--g7);letter-spacing:.1em;text-transform:uppercase}.tb-meta .demo-pill{padding:5px 11px;background:var(--blue-dim);color:var(--blue);border:1px solid rgba(59,130,246,.3);border-radius:3px;letter-spacing:.18em}.tb-meta a{color:var(--g7);transition:color .15s}.tb-meta a:hover{color:var(--green)}.dash-banner{background:var(--blue-dim);border-bottom:1px solid rgba(59,130,246,.2);padding:9px 28px;text-align:center;font-family:'DM Mono',monospace;font-size:10px;color:var(--blue);letter-spacing:.12em}.dash-banner strong{color:#93c5fd}.main{flex:1;padding:24px 28px 40px;max-width:1320px;margin:0 auto;width:100%}.hero-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:18px}.kpi{background:var(--g1);border:1px solid var(--border);border-radius:4px;padding:14px 16px;position:relative;overflow:hidden}.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}.kpi.green::before{background:var(--green)}.kpi.orange::before{background:var(--orange)}.kpi.blue::before{background:var(--blue)}.kpi.grey::before{background:var(--g4)}.kpi-lbl{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.14em;text-transform:uppercase;margin-bottom:5px}.kpi-val{font-family:'Oswald',sans-serif;font-size:26px;color:var(--g9);font-weight:500;line-height:1}.kpi-val.green{color:var(--green)}.kpi-val.orange{color:var(--orange)}.kpi-val.blue{color:var(--blue)}.kpi-sub{font-size:10px;color:var(--g6);margin-top:4px}.section-title{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--g6);margin:22px 0 10px;display:flex;align-items:center;gap:10px}.section-title::after{content:'';flex:1;height:1px;background:var(--border)}.section-title .badge{background:var(--g3);color:var(--g7);padding:2px 8px;border-radius:2px;font-size:8px;letter-spacing:.1em}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px}.card{background:var(--g1);border:1px solid var(--border);border-radius:4px;padding:18px 20px;position:relative}.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--g4);transition:background .2s}.card:hover::before{background:var(--green)}.card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border)}.card-title{font-family:'Oswald',sans-serif;font-size:14px;color:var(--g9);font-weight:600;letter-spacing:.3px}.card-meta{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.12em;text-transform:uppercase}table{width:100%;border-collapse:collapse;font-size:11px}thead th{font-family:'DM Mono',monospace;font-size:8px;font-weight:500;color:var(--g6);padding:6px 8px;border-bottom:1px solid var(--border);text-align:left;letter-spacing:.12em;text-transform:uppercase}td{padding:7px 8px;border-bottom:1px solid rgba(255,255,255,.03);color:var(--g8)}td.num{font-family:'DM Mono',monospace;text-align:right}td.dim{color:var(--g6);font-family:'DM Mono',monospace;font-size:10px}tr:hover td{background:rgba(255,255,255,.02)}.pill{display:inline-block;font-family:'DM Mono',monospace;font-size:8px;padding:2px 7px;border-radius:2px;letter-spacing:.06em}.pill.green{background:var(--green-dim);color:var(--green)}.pill.orange{background:var(--orange-dim);color:var(--orange)}.pill.red{background:rgba(239,68,68,.12);color:var(--red)}.pill.grey{background:var(--g3);color:var(--g7)}.pill.blue{background:var(--blue-dim);color:var(--blue)}.kanban{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.kanban-col{background:var(--g2);border:1px solid var(--border);border-radius:3px;padding:10px}.kanban-col-head{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}.kanban-col-head .count{color:var(--g8)}.kanban-card{background:var(--g1);border:1px solid var(--border);border-left:2px solid var(--green);border-radius:2px;padding:8px 10px;margin-bottom:6px;font-size:11px;cursor:default}.kanban-card.open{border-left-color:var(--blue)}.kanban-card.prog{border-left-color:var(--orange)}.kanban-card.done{border-left-color:var(--green);opacity:.7}.kc-id{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.08em;margin-bottom:3px}.kc-title{color:var(--g8);margin-bottom:5px;line-height:1.3}.kc-meta{font-size:9px;color:var(--g6);display:flex;justify-content:space-between}.cal-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.03);font-size:11px}.cal-row:last-child{border-bottom:none}.cal-date{font-family:'DM Mono',monospace;font-size:10px;color:var(--g7);min-width:78px}.cal-title{flex:1;color:var(--g8);padding:0 12px}.cal-title .cal-prop{color:var(--g6);font-size:10px;display:block}.cal-status{font-family:'DM Mono',monospace;font-size:8px;color:var(--orange);letter-spacing:.06em;text-transform:uppercase}.cal-status.due-soon{color:var(--red)}.cal-status.scheduled{color:var(--green)}.ai-stream{font-family:'DM Mono',monospace;font-size:11px;color:var(--g7);line-height:1.7}.ai-stream .ai-line{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.03);display:flex;gap:10px;align-items:flex-start}.ai-stream .ai-line:last-child{border-bottom:none}.ai-stream .ai-time{color:var(--g5);font-size:9px;min-width:46px;padding-top:1px}.ai-stream .ai-icon{color:var(--green);font-size:9px;padding-top:1px;width:14px;text-align:center}.ai-stream .ai-text{flex:1;color:var(--g8);font-family:'DM Sans',sans-serif;font-size:11px}.ai-stream .ai-text strong{color:var(--green);font-weight:500}.tenant-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.03);font-size:11px}.tenant-row:last-child{border-bottom:none}.tenant-info{flex:1;min-width:0}.tenant-name{color:var(--g8);font-weight:500;margin-bottom:2px}.tenant-unit{font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.06em}.tenant-bal{font-family:'DM Mono',monospace;font-size:11px;color:var(--g8)}.tenant-bal.owing{color:var(--red)}.tenant-bal.paid{color:var(--green)}.tenant-meta{font-size:9px;color:var(--g6);margin-top:1px}.scan-row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.03);font-size:11px;font-family:'DM Mono',monospace}.scan-row:last-child{border-bottom:none}.scan-time{color:var(--g6);font-size:9px;min-width:90px}.scan-type{font-size:9px;letter-spacing:.06em;text-transform:uppercase;min-width:62px}.scan-type.in{color:var(--green)}.scan-type.out{color:var(--g7)}.scan-job{flex:1;color:var(--g8);font-size:10px}.scan-hrs{color:var(--orange);font-size:10px;min-width:42px;text-align:right}.foot{padding:18px 28px;border-top:1px solid var(--border);background:var(--g0);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.12em;text-transform:uppercase}.foot a{color:var(--g6);transition:color .15s}.foot a:hover{color:var(--green)}@media (max-width:1000px){.hero-row{grid-template-columns:1fr 1fr}.grid-2{grid-template-columns:1fr}.grid-3{grid-template-columns:1fr}.kanban{grid-template-columns:1fr}}@media (max-width:560px){.hero-row{grid-template-columns:1fr}.topbar{padding:12px 18px}.main{padding:18px 18px 30px}}.pmodal{display:none;position:fixed;inset:0;background:rgba(6,6,6,.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:1000;align-items:center;justify-content:center;padding:20px}.pmodal.on{display:flex}.pmodal-box{background:var(--g1);border:1px solid var(--border2);border-radius:5px;max-width:560px;width:100%;position:relative;max-height:88vh;overflow-y:auto}.pmodal-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green)}.pmodal-close{position:absolute;top:12px;right:14px;background:none;border:none;color:var(--g6);font-size:22px;cursor:pointer;line-height:1;padding:4px 10px;z-index:2}.pmodal-close:hover{color:var(--g9)}.pmodal-head{padding:24px 28px 18px;border-bottom:1px solid var(--border)}.pmodal-tag{font-family:'DM Mono',monospace;font-size:9px;color:var(--green);letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px}.pmodal-title{font-family:'Oswald',sans-serif;font-size:22px;color:var(--g9);font-weight:600;letter-spacing:.3px;line-height:1.2;margin-bottom:6px}.pmodal-sub{font-size:12px;color:var(--g6);font-family:'DM Mono',monospace}.pmodal-body{padding:20px 28px 24px}.pm-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 22px;margin-bottom:18px}.pm-grid .k{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.14em;text-transform:uppercase;margin-bottom:3px}.pm-grid .v{font-size:13px;color:var(--g8);font-family:'DM Sans',sans-serif}.pm-grid .v.green{color:var(--green)}.pm-grid .v.orange{color:var(--orange)}.pm-grid .v.red{color:var(--red)}.pm-section{margin-top:18px}.pm-sec-title{font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--border)}.pm-history-row{display:flex;justify-content:space-between;font-size:11px;color:var(--g7);padding:5px 0;border-bottom:1px solid rgba(255,255,255,.03);font-family:'DM Mono',monospace}.pm-history-row:last-child{border-bottom:none}.pm-history-row .date{color:var(--g6);font-size:10px}.pm-history-row .amt.paid{color:var(--green)}.pm-history-row .amt.late{color:var(--red)}.pmodal-actions{display:flex;gap:8px;padding:16px 28px;border-top:1px solid var(--border);background:var(--g0);font-family:'DM Mono',monospace;font-size:9px;color:var(--g5);letter-spacing:.1em;text-transform:uppercase}.pmodal-actions .demo-note{flex:1;text-align:right}.tile-clickable,tr.clickable,.kanban-card{cursor:pointer;transition:all .15s}tr.clickable:hover td{background:rgba(0,255,65,.04)}.kanban-card:hover{transform:translateX(2px);background:var(--g3)}.click-hint{font-family:'DM Mono',monospace;font-size:8px;color:var(--g5);letter-spacing:.16em;text-transform:uppercase;margin-left:8px}.click-hint::before{content:'\u25B8 '}</style></head><body><div class="gate" id="gate"><div class="gate-box"><div class="gate-tag">NAC Property \xB7 Demo Access</div><div class="gate-title">Enter your demo code</div><div class="gate-sub">Paste the access code from your email to preview the NAC Property Management dashboard.</div><input type="text" class="gate-input" id="code-input" placeholder="DEMO-XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" spellcheck="false"><div class="gate-err" id="gate-err"></div><button class="gate-btn" id="gate-btn" onclick="submitCode()">Enter Demo \u2192</button><div class="gate-foot">No code? <a href="/nac/property/demo">Request access</a></div></div></div><div class="preview" id="preview"><header class="topbar"><div class="brand"><div class="brand-mark">N</div><div class="brand-txt"><div class="brand-name">NAC PROPERTY</div><div class="brand-sub">Demo Preview</div></div></div><div class="tb-meta"><span class="demo-pill">\u25CF DEMO MODE</span><a href="/nac/property/demo">Request your own code</a><a href="/">NAC OS Home</a></div></header><div class="dash-banner">\u25CF This is a read-only demo with mock data \u2014 the live product will sync your real properties, work orders, and tenants. <strong>Want a real walkthrough?</strong> Reply to your access email.</div><div class="main"><div class="hero-row"><div class="kpi green"><div class="kpi-lbl">Properties</div><div class="kpi-val green">14</div><div class="kpi-sub">42 units \xB7 6 buildings</div></div><div class="kpi orange"><div class="kpi-lbl">Open Work Orders</div><div class="kpi-val orange">9</div><div class="kpi-sub">3 urgent \xB7 6 routine</div></div><div class="kpi blue"><div class="kpi-lbl">Active Tenants</div><div class="kpi-val blue">38</div><div class="kpi-sub">36 current \xB7 2 owing</div></div><div class="kpi grey"><div class="kpi-lbl">Compliance Items</div><div class="kpi-val">22</div><div class="kpi-sub">3 due in 30 days</div></div></div><div class="section-title">Property Registry <span class="badge">14 PROPERTIES</span></div><div class="card"><div class="card-head"><div class="card-title">Buildings</div><div class="card-meta">SORTED BY LAST ACTIVITY</div></div><table><thead><tr><th>Address</th><th>Units</th><th>Type</th><th>Manager</th><th>Status</th><th>Last activity</th></tr></thead><tbody><tr class="clickable" onclick="openProperty(0)"><td>118 Pitt St \xB7 Cornwall</td><td class="num">8</td><td class="dim">Multi-residential</td><td>Craig N.</td><td><span class="pill green">Active</span></td><td class="dim">2h ago</td></tr><tr class="clickable" onclick="openProperty(1)"><td>4330 Billy Bill Rd \xB7 Cornwall</td><td class="num">1</td><td class="dim">Single \xB7 New build</td><td>Craig N.</td><td><span class="pill orange">Construction</span></td><td class="dim">5h ago</td></tr><tr class="clickable" onclick="openProperty(2)"><td>200 Second St W \xB7 Cornwall</td><td class="num">12</td><td class="dim">Multi-residential</td><td>Sarah K.</td><td><span class="pill green">Active</span></td><td class="dim">1d ago</td></tr><tr class="clickable" onclick="openProperty(3)"><td>56 Marlborough St \xB7 Cornwall</td><td class="num">4</td><td class="dim">Townhouse row</td><td>Sarah K.</td><td><span class="pill green">Active</span></td><td class="dim">2d ago</td></tr><tr class="clickable" onclick="openProperty(4)"><td>15 Sydney St \xB7 Cornwall</td><td class="num">6</td><td class="dim">Multi-residential</td><td>Craig N.</td><td><span class="pill green">Active</span></td><td class="dim">3d ago</td></tr><tr class="clickable" onclick="openProperty(5)"><td>92 Adolphus St \xB7 Cornwall</td><td class="num">3</td><td class="dim">Multi-residential</td><td>Sarah K.</td><td><span class="pill blue">Lease pending</span></td><td class="dim">4d ago</td></tr></tbody></table></div><div class="section-title">Work Orders \xB7 Kanban <span class="badge">9 OPEN</span></div><div class="kanban"><div class="kanban-col"><div class="kanban-col-head"><span>Open</span><span class="count">3</span></div><div onclick="openWorkOrder('WO-1024')" class="kanban-card open"><div class="kc-id">WO-1024</div><div class="kc-title">Furnace not igniting \u2014 Unit 3B</div><div class="kc-meta"><span>118 Pitt St</span><span>URGENT</span></div></div><div onclick="openWorkOrder('WO-1023')" class="kanban-card open"><div class="kc-id">WO-1023</div><div class="kc-title">Leaking faucet, kitchen</div><div class="kc-meta"><span>200 Second St \xB7 #4</span><span>2h</span></div></div><div onclick="openWorkOrder('WO-1021')" class="kanban-card open"><div class="kc-id">WO-1021</div><div class="kc-title">Hallway light replacement</div><div class="kc-meta"><span>15 Sydney St</span><span>1d</span></div></div></div><div class="kanban-col"><div class="kanban-col-head"><span>In Progress</span><span class="count">4</span></div><div onclick="openWorkOrder('WO-1019')" class="kanban-card prog"><div class="kc-id">WO-1019</div><div class="kc-title">Roof inspection \u2014 minor leak</div><div class="kc-meta"><span>92 Adolphus St</span><span>Mike H.</span></div></div><div onclick="openWorkOrder('WO-1018')" class="kanban-card prog"><div class="kc-id">WO-1018</div><div class="kc-title">Replace dishwasher</div><div class="kc-meta"><span>56 Marlborough \xB7 #2</span><span>Mike H.</span></div></div><div onclick="openWorkOrder('WO-1017')" class="kanban-card prog"><div class="kc-id">WO-1017</div><div class="kc-title">Drywall repair, bedroom wall</div><div class="kc-meta"><span>200 Second St \xB7 #9</span><span>RBC Crew</span></div></div><div onclick="openWorkOrder('WO-1015')" class="kanban-card prog"><div class="kc-id">WO-1015</div><div class="kc-title">Annual fire alarm test</div><div class="kc-meta"><span>118 Pitt St</span><span>Pro Fire Co</span></div></div></div><div class="kanban-col"><div class="kanban-col-head"><span>Done (last 7d)</span><span class="count">2</span></div><div onclick="openWorkOrder('WO-1014')" class="kanban-card done"><div class="kc-id">WO-1014</div><div class="kc-title">Clogged drain \u2014 cleared</div><div class="kc-meta"><span>15 Sydney St \xB7 #2</span><span>Mike H.</span></div></div><div onclick="openWorkOrder('WO-1012')" class="kanban-card done"><div class="kc-id">WO-1012</div><div class="kc-title">Snow clearing \xB7 March</div><div class="kc-meta"><span>All properties</span><span>Crew</span></div></div></div></div><div class="grid-2"><div><div class="section-title">QR Job Tracking <span class="badge">LAST 24H</span></div><div class="card"><div class="card-head"><div class="card-title">Recent crew scans</div><div class="card-meta">QR \u2192 GPS \u2192 LOG</div></div><div class="scan-row"><span class="scan-time">14:22 today</span><span class="scan-type out">Out</span><span class="scan-job">Mike H. \xB7 WO-1014 \xB7 15 Sydney St</span><span class="scan-hrs">2.5h</span></div><div class="scan-row"><span class="scan-time">11:48 today</span><span class="scan-type in">In</span><span class="scan-job">Mike H. \xB7 WO-1014 \xB7 15 Sydney St</span><span class="scan-hrs">\u2014</span></div><div class="scan-row"><span class="scan-time">10:30 today</span><span class="scan-type out">Out</span><span class="scan-job">RBC Crew \xB7 WO-1017 \xB7 200 Second St</span><span class="scan-hrs">3.0h</span></div><div class="scan-row"><span class="scan-time">07:30 today</span><span class="scan-type in">In</span><span class="scan-job">RBC Crew \xB7 WO-1017 \xB7 200 Second St</span><span class="scan-hrs">\u2014</span></div><div class="scan-row"><span class="scan-time">16:05 yest.</span><span class="scan-type out">Out</span><span class="scan-job">Mike H. \xB7 WO-1018 \xB7 56 Marlborough</span><span class="scan-hrs">4.5h</span></div><div class="scan-row"><span class="scan-time">11:32 yest.</span><span class="scan-type in">In</span><span class="scan-job">Mike H. \xB7 WO-1018 \xB7 56 Marlborough</span><span class="scan-hrs">\u2014</span></div></div></div><div><div class="section-title">Tenant Portal <span class="badge">38 ACTIVE</span></div><div class="card"><div class="card-head"><div class="card-title">Tenants \xB7 rent status</div><div class="card-meta">CURRENT MONTH</div></div><div class="tenant-row clickable" onclick="openTenant(0)"><div class="tenant-info"><div class="tenant-name">Marie Tremblay</div><div class="tenant-unit">118 Pitt St \xB7 Unit 2A</div></div><div><div class="tenant-bal paid">$1,450</div><div class="tenant-meta">Paid Apr 1</div></div></div><div class="tenant-row clickable" onclick="openTenant(1)"><div class="tenant-info"><div class="tenant-name">James O'Brien</div><div class="tenant-unit">200 Second St \xB7 Unit 4</div></div><div><div class="tenant-bal paid">$1,650</div><div class="tenant-meta">Paid Apr 2</div></div></div><div class="tenant-row clickable" onclick="openTenant(2)"><div class="tenant-info"><div class="tenant-name">Patel Family</div><div class="tenant-unit">56 Marlborough \xB7 #2</div></div><div><div class="tenant-bal owing">$2,200</div><div class="tenant-meta">14 days late</div></div></div><div class="tenant-row clickable" onclick="openTenant(3)"><div class="tenant-info"><div class="tenant-name">Lisa Dumont</div><div class="tenant-unit">15 Sydney St \xB7 Unit 1B</div></div><div><div class="tenant-bal paid">$1,275</div><div class="tenant-meta">Paid Apr 1</div></div></div><div class="tenant-row clickable" onclick="openTenant(4)"><div class="tenant-info"><div class="tenant-name">M. Bolduc</div><div class="tenant-unit">92 Adolphus St \xB7 Unit C</div></div><div><div class="tenant-bal owing">$850</div><div class="tenant-meta">3 days late</div></div></div><div class="tenant-row clickable" onclick="openTenant(5)"><div class="tenant-info"><div class="tenant-name">D. Kowalski</div><div class="tenant-unit">200 Second St \xB7 Unit 11</div></div><div><div class="tenant-bal paid">$1,650</div><div class="tenant-meta">Paid Mar 28</div></div></div></div></div></div><div class="grid-2"><div><div class="section-title">Compliance Calendar <span class="badge">22 ITEMS</span></div><div class="card"><div class="card-head"><div class="card-title">Upcoming inspections \xB7 next 60 days</div><div class="card-meta">AUTO-REMINDED</div></div><div class="cal-row"><span class="cal-date">Apr 18</span><span class="cal-title">Fire alarm \xB7 annual<span class="cal-prop">118 Pitt St</span></span><span class="cal-status due-soon">Due 7d</span></div><div class="cal-row"><span class="cal-date">Apr 25</span><span class="cal-title">HVAC service \xB7 spring<span class="cal-prop">200 Second St</span></span><span class="cal-status due-soon">Due 14d</span></div><div class="cal-row"><span class="cal-date">May 02</span><span class="cal-title">Backflow valve test<span class="cal-prop">15 Sydney St</span></span><span class="cal-status">Due 21d</span></div><div class="cal-row"><span class="cal-date">May 09</span><span class="cal-title">Elevator inspection<span class="cal-prop">200 Second St</span></span><span class="cal-status scheduled">Scheduled</span></div><div class="cal-row"><span class="cal-date">May 16</span><span class="cal-title">Smoke detector audit<span class="cal-prop">All properties</span></span><span class="cal-status">Due 35d</span></div><div class="cal-row"><span class="cal-date">May 30</span><span class="cal-title">Pool opening inspection<span class="cal-prop">200 Second St</span></span><span class="cal-status">Due 49d</span></div></div></div><div><div class="section-title">AI Daily Brief <span class="badge">AUTO-GENERATED</span></div><div class="card"><div class="card-head"><div class="card-title">Today \xB7 morning summary</div><div class="card-meta">07:00 LOCAL</div></div><div class="ai-stream"><div class="ai-line"><span class="ai-time">07:00</span><span class="ai-icon">\u25B8</span><span class="ai-text"><strong>1 urgent work order</strong> needs dispatch: WO-1024 (furnace, 118 Pitt St). Recommend assigning Mike H. \u2014 closest crew, available after 10am.</span></div><div class="ai-line"><span class="ai-time">07:00</span><span class="ai-icon">\u25B8</span><span class="ai-text"><strong>2 tenants owing rent</strong> at &gt;3 days late. Auto-reminder sent to Patel Family (14d) and M. Bolduc (3d). No action needed yet.</span></div><div class="ai-line"><span class="ai-time">07:00</span><span class="ai-icon">\u25B8</span><span class="ai-text"><strong>Fire alarm at 118 Pitt St</strong> due in 7 days \u2014 Pro Fire Co confirmed for Apr 17. Calendar synced.</span></div><div class="ai-line"><span class="ai-time">07:00</span><span class="ai-icon">\u25B8</span><span class="ai-text"><strong>Voice note transcribed</strong> from Mike H. (yesterday 16:08): \u201CDishwasher swap done at Marlborough #2, old unit hauled. Receipts in van.\u201D Filed under WO-1018.</span></div><div class="ai-line"><span class="ai-time">07:00</span><span class="ai-icon">\u25B8</span><span class="ai-text"><strong>Snow clearing closed for season</strong> \u2014 final invoice from crew totals $4,200, allocated across 6 properties pro-rata by frontage.</span></div></div></div></div></div></div><div class="pmodal" id="pmodal" onclick="if(event.target===this)closeP()"><div class="pmodal-box"><button class="pmodal-close" onclick="closeP()">\xD7</button><div class="pmodal-head"><div class="pmodal-tag" id="pm-tag">Demo</div><div class="pmodal-title" id="pm-title">\u2014</div><div class="pmodal-sub" id="pm-sub">\u2014</div></div><div class="pmodal-body" id="pm-body"></div><div class="pmodal-actions"><span>READ-ONLY DEMO</span><span class="demo-note">Live product allows full edit</span></div></div></div><footer class="foot"><span>NAC Property Demo \xB7 Read-only preview \xB7 Mock data</span><div><a href="/nac/property/demo">Request your own demo</a> &nbsp;\xB7&nbsp; <a href="/">NAC OS Home</a> &nbsp;\xB7&nbsp; <a href="https://www.naturalalternatives.ca" target="_blank">naturalalternatives.ca</a></div></footer></div><script>const PROPERTIES_DATA=[{addr:'118 Pitt St',type:'Multi-residential',units:'8 units',mgr:'Craig N.',status:'Active',rent:'$11,600/mo gross',built:'1962',renovated:'2018',insp:'Mar 14',notes:'Built 1962, fully renovated 2018. Annual fire alarm due Apr 18. Pre-shift inspections current.'},{addr:'4330 Billy Bill Rd',type:'Single \xB7 New build',units:'1 unit',mgr:'Craig N.',status:'Construction',rent:'Q4 2026 occupancy',built:'2026',renovated:'\u2014',insp:'\u2014',notes:'Active build. $600k budget. Currently in framing phase. ICF foundation complete. Steel trusses installed.'},{addr:'200 Second St W',type:'Multi-residential',units:'12 units',mgr:'Sarah K.',status:'Active',rent:'$19,800/mo gross',built:'1978',renovated:'2015',insp:'Apr 18',notes:'12-unit walkup with elevator and sprinkler. Annual fire alarm test scheduled Apr 18. Roof replacement done 2021.'},{addr:'56 Marlborough St',type:'Townhouse row',units:'4 units',mgr:'Sarah K.',status:'Active',rent:'$6,200/mo gross',built:'2008',renovated:'\u2014',insp:'May 22',notes:'Modern construction, low maintenance. Recent dishwasher replacement Unit #2. All HVAC under warranty.'},{addr:'15 Sydney St',type:'Multi-residential',units:'6 units',mgr:'Craig N.',status:'Active',rent:'$7,650/mo gross',built:'1955',renovated:'2010',insp:'Jun 03',notes:'Heritage building with original hardwood floors. 1 vacancy on Unit 3 as of Apr 1. Asbestos clearance certificate on file.'},{addr:'92 Adolphus St',type:'Multi-residential',units:'3 units',mgr:'Sarah K.',status:'Lease pending',rent:'$3,650/mo gross',built:'1969',renovated:'2019',insp:'May 15',notes:'Smaller property. Lease negotiations underway on Unit C as of Apr 5. Last roof inspection Mar 2026.'}];const WORK_ORDERS={'WO-1024':{title:'Furnace not igniting \u2014 Unit 3B',prop:'118 Pitt St',unit:'3B',priority:'URGENT',status:'Open',created:'Apr 11 06:20',assigned:'Unassigned',tenant:'Marie Tremblay',cat:'HVAC',notes:'Tenant reports no heat since 6am. Pilot light won't stay lit. Recommend dispatch Mike H. for ignition assembly inspection.',events:[['Apr 11 06:20','Tenant called: no heat'],['Apr 11 06:25','Ticket created']]},'WO-1023':{title:'Leaking faucet, kitchen',prop:'200 Second St W',unit:'4',priority:'Routine',status:'Open',created:'Apr 11 11:00',assigned:'Mike H.',tenant:'James O'Brien',cat:'Plumbing',notes:'Slow drip from kitchen faucet aerator. Likely needs new washer or full faucet replacement.',events:[['Apr 11 11:00','Tenant submitted via portal'],['Apr 11 11:05','Auto-assigned Mike H.']]},'WO-1021':{title:'Hallway light replacement',prop:'15 Sydney St',unit:'Common',priority:'Routine',status:'Open',created:'Apr 10 09:30',assigned:'Mike H.',tenant:'\u2014',cat:'Electrical',notes:'2nd floor hallway light fixture failed. Tenant reported tripping hazard. Bulb replacement attempted, fixture needs replacement.',events:[['Apr 10 09:30','Building inspection found issue'],['Apr 10 10:15','Bulb swap failed']]},'WO-1019':{title:'Roof inspection \u2014 minor leak',prop:'92 Adolphus St',unit:'3rd floor',priority:'Routine',status:'In Progress',created:'Apr 09 14:00',assigned:'Mike H.',tenant:'\u2014',cat:'Roofing',notes:'Stain noted on 3rd floor ceiling after Apr 8 storm. Mike inspecting flashing and shingles. Likely flashing repair, $400 estimate.',events:[['Apr 09 14:00','Stain reported'],['Apr 10 08:00','Mike inspected'],['Apr 11 09:00','Materials ordered']]},'WO-1018':{title:'Replace dishwasher',prop:'56 Marlborough',unit:'#2',priority:'Routine',status:'In Progress',created:'Apr 08 11:00',assigned:'Mike H.',tenant:'A. Lemieux',cat:'Appliance',notes:'Dishwasher pump failure. New unit ordered from appliance supplier. Install scheduled Apr 12. Old unit hauled per voice note.',events:[['Apr 08 11:00','Tenant reported failure'],['Apr 09 14:00','New unit ordered'],['Apr 10 16:08','Voice note: old unit hauled']]},'WO-1017':{title:'Drywall repair, bedroom wall',prop:'200 Second St W',unit:'#9',priority:'Routine',status:'In Progress',created:'Apr 07 13:30',assigned:'RBC Crew',tenant:'D. Kowalski',cat:'Drywall',notes:'Tenant reported small hole from prior occupant move-out. Patch + paint scheduled. Charge to vacancy turnover account.',events:[['Apr 07 13:30','Move-out inspection found hole'],['Apr 08 09:00','Quote approved'],['Apr 11 07:30','Crew scanned in']]},'WO-1015':{title:'Annual fire alarm test',prop:'118 Pitt St',unit:'Building-wide',priority:'Compliance',status:'In Progress',created:'Apr 05 09:00',assigned:'Pro Fire Co',tenant:'\u2014',cat:'Compliance',notes:'Annual fire alarm and sprinkler inspection. Pro Fire Co confirmed for Apr 17. All tenants notified.',events:[['Apr 05 09:00','Scheduled with Pro Fire'],['Apr 06 14:00','Tenant notice sent'],['Apr 11 08:00','Reminder sent to all units']]},'WO-1014':{title:'Clogged drain \u2014 cleared',prop:'15 Sydney St',unit:'#2',priority:'Routine',status:'Done',created:'Apr 09 16:00',assigned:'Mike H.',tenant:'\u2014',cat:'Plumbing',notes:'Hair clog in shower drain. Cleared with snake. 2.5 hours total including travel.',events:[['Apr 09 16:00','Tenant called'],['Apr 10 11:48','Mike scanned in'],['Apr 10 14:22','Mike scanned out \u2014 cleared']]},'WO-1012':{title:'Snow clearing \xB7 March',prop:'All properties',unit:'\u2014',priority:'Routine',status:'Done',created:'Mar 31 23:59',assigned:'Crew',tenant:'\u2014',cat:'Grounds',notes:'Final snow clearing invoice for March. Total $4,200, allocated pro-rata across 6 properties by frontage.',events:[['Mar 31 23:59','Auto-billed'],['Apr 01 09:00','Allocations posted']]}};const TENANTS_DATA=[{name:'Marie Tremblay',unit:'118 Pitt St \xB7 Unit 2A',rent:1450,status:'paid',since:'Mar 2019',phone:'613-555-0142',email:'m.tremblay@example.ca',history:[['Apr 1','$1,450','paid'],['Mar 1','$1,450','paid'],['Feb 1','$1,450','paid'],['Jan 1','$1,450','paid']]},{name:'James O'Brien',unit:'200 Second St \xB7 Unit 4',rent:1650,status:'paid',since:'Aug 2021',phone:'613-555-0177',email:'j.obrien@example.ca',history:[['Apr 2','$1,650','paid'],['Mar 1','$1,650','paid'],['Feb 1','$1,650','paid']]},{name:'Patel Family',unit:'56 Marlborough \xB7 #2',rent:1100,status:'owing',since:'Jun 2020',phone:'613-555-0188',email:'patel.family@example.ca',history:[['Apr 1','$2,200','LATE 14d'],['Mar 1','$1,100','paid'],['Feb 1','$1,100','paid']]},{name:'Lisa Dumont',unit:'15 Sydney St \xB7 Unit 1B',rent:1275,status:'paid',since:'Jan 2023',phone:'613-555-0199',email:'l.dumont@example.ca',history:[['Apr 1','$1,275','paid'],['Mar 1','$1,275','paid'],['Feb 1','$1,275','paid']]},{name:'M. Bolduc',unit:'92 Adolphus St \xB7 Unit C',rent:850,status:'owing',since:'Sep 2024',phone:'613-555-0211',email:'mbolduc@example.ca',history:[['Apr 8','$850','LATE 3d'],['Mar 1','$850','paid'],['Feb 1','$850','paid']]},{name:'D. Kowalski',unit:'200 Second St \xB7 Unit 11',rent:1650,status:'paid',since:'Mar 2017',phone:'613-555-0145',email:'d.kowalski@example.ca',history:[['Mar 28','$1,650','paid'],['Mar 1','$1,650','paid'],['Feb 1','$1,650','paid']]}];function openP(tag,title,sub,bodyHtml){document.getElementById('pm-tag').textContent=tag;document.getElementById('pm-title').textContent=title;document.getElementById('pm-sub').textContent=sub;document.getElementById('pm-body').innerHTML=bodyHtml;document.getElementById('pmodal').classList.add('on');document.body.style.overflow='hidden';}function closeP(){document.getElementById('pmodal').classList.remove('on');document.body.style.overflow='';}function openProperty(i){var p=PROPERTIES_DATA[i];if(!p)return;var html='<div class="pm-grid">'+'<div><div class="k">Type</div><div class="v">'+p.type+'</div></div>'+'<div><div class="k">Units</div><div class="v">'+p.units+'</div></div>'+'<div><div class="k">Manager</div><div class="v">'+p.mgr+'</div></div>'+'<div><div class="k">Status</div><div class="v green">'+p.status+'</div></div>'+'<div><div class="k">Rent roll</div><div class="v">'+p.rent+'</div></div>'+'<div><div class="k">Built</div><div class="v">'+p.built+'</div></div>'+'<div><div class="k">Last reno</div><div class="v">'+p.renovated+'</div></div>'+'<div><div class="k">Next inspection</div><div class="v orange">'+p.insp+'</div></div>'+'</div>'+'<div class="pm-section"><div class="pm-sec-title">Notes</div><div style="font-size:12px;color:var(--g7);line-height:1.6">'+p.notes+'</div></div>';openP('Property \xB7 Demo','\u2014 '+p.addr,p.type+' \xB7 '+p.units,html);document.getElementById('pm-title').textContent=p.addr;}function openWorkOrder(id){var w=WORK_ORDERS[id];if(!w)return;var html='<div class="pm-grid">'+'<div><div class="k">Property</div><div class="v">'+w.prop+'</div></div>'+'<div><div class="k">Unit</div><div class="v">'+w.unit+'</div></div>'+'<div><div class="k">Status</div><div class="v '+(w.status==='Done'?'green':w.status==='In Progress'?'orange':'green')+'">'+w.status+'</div></div>'+'<div><div class="k">Priority</div><div class="v '+(w.priority==='URGENT'?'red':'')+'">'+w.priority+'</div></div>'+'<div><div class="k">Assigned to</div><div class="v">'+w.assigned+'</div></div>'+'<div><div class="k">Category</div><div class="v">'+w.cat+'</div></div>'+'<div><div class="k">Tenant</div><div class="v">'+w.tenant+'</div></div>'+'<div><div class="k">Created</div><div class="v">'+w.created+'</div></div>'+'</div>'+'<div class="pm-section"><div class="pm-sec-title">Notes</div><div style="font-size:12px;color:var(--g7);line-height:1.6">'+w.notes+'</div></div>'+'<div class="pm-section"><div class="pm-sec-title">Activity</div>'+w.events.map(function(e){return '<div class="pm-history-row"><span class="date">'+e[0]+'</span><span>'+e[1]+'</span></div>';}).join('')+'</div>';openP('Work Order \xB7 '+id,w.title,w.prop+' \xB7 '+w.cat,html);}function openTenant(i){var t=TENANTS_DATA[i];if(!t)return;var html='<div class="pm-grid">'+'<div><div class="k">Unit</div><div class="v">'+t.unit+'</div></div>'+'<div><div class="k">Monthly rent</div><div class="v">$'+t.rent.toLocaleString()+'</div></div>'+'<div><div class="k">Status</div><div class="v '+(t.status==='paid'?'green':'red')+'">'+(t.status==='paid'?'Current':'Owing')+'</div></div>'+'<div><div class="k">Tenant since</div><div class="v">'+t.since+'</div></div>'+'<div><div class="k">Phone</div><div class="v">'+t.phone+'</div></div>'+'<div><div class="k">Email</div><div class="v" style="font-size:11px">'+t.email+'</div></div>'+'</div>'+'<div class="pm-section"><div class="pm-sec-title">Payment history</div>'+t.history.map(function(h){return '<div class="pm-history-row"><span class="date">'+h[0]+'</span><span>'+h[1]+'</span><span class="amt '+(h[2]==='paid'?'paid':'late')+'">'+h[2].toUpperCase()+'</span></div>';}).join('')+'</div>';openP('Tenant \xB7 Demo',t.name,t.unit,html);}window.openProperty=openProperty;window.openWorkOrder=openWorkOrder;window.openTenant=openTenant;window.closeP=closeP;document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.getElementById('pmodal').classList.contains('on'))closeP();});function showGate(){document.getElementById('gate').classList.add('on');document.getElementById('preview').classList.remove('on');setTimeout(()=>document.getElementById('code-input').focus(),100);}function showPreview(){document.getElementById('gate').classList.remove('on');document.getElementById('preview').classList.add('on');}function showErr(m){const e=document.getElementById('gate-err');e.textContent=m;e.classList.add('on');}function clearErr(){document.getElementById('gate-err').classList.remove('on');}async function validateCode(code){clearErr();if(!code||code.length<8){showErr('Enter a valid demo code');return false;}const btn=document.getElementById('gate-btn');btn.disabled=true;btn.textContent='Verifying\u2026';try{const r=await fetch('/api/demo/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});const d=await r.json();if(d.valid){try{localStorage.setItem('nac_demo_key',code);}catch(_){}showPreview();return true;}else{showErr('Invalid or expired code');btn.disabled=false;btn.textContent='Enter Demo \u2192';return false;}}catch(e){showErr('Connection error \u2014 try again');btn.disabled=false;btn.textContent='Enter Demo \u2192';return false;}}function submitCode(){const code=document.getElementById('code-input').value.trim().toUpperCase();validateCode(code);}document.getElementById('code-input').addEventListener('keydown',function(e){if(e.key==='Enter')submitCode();});(function(){const params=new URLSearchParams(window.location.search);const urlCode=params.get('code');const hashCode=window.location.hash.startsWith('#code=')?decodeURIComponent(window.location.hash.slice(6)):null;const lsCode=(function(){try{return localStorage.getItem('nac_demo_key');}catch(_){return null;}})();const code=urlCode||hashCode||lsCode;if(code){document.getElementById('code-input').value=code;validateCode(code);}else{showGate();}})();<\/script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store", "cf-edge-cache": "no-store" } });
}
__name(handleNacPropertyPreview, "handleNacPropertyPreview");
__name2(handleNacPropertyPreview, "handleNacPropertyPreview");
function handleHomePage() {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NAC OS \u2014 Operating System for Ontario Contractors</title><meta name="description" content="The operating layer for Ontario contractors. Compliance, finance, fleet, and training \u2014 one console."><style>:root{--g0:#060606;--g1:#0C0C0C;--g2:#151515;--g3:#1E1E1E;--g4:#2D2D2D;--g5:#3C3C3C;--g6:#666666;--g7:#909090;--g8:#D8D8D8;--g9:#F2F2F2;--green:#00FF41;--green-dim:rgba(0,255,65,.12);--green-subtle:rgba(0,255,65,.04);--green-glow:rgba(0,255,65,.25);--orange:#F97316;--red:#EF4444;--blue:#3B82F6;--border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.10);--border3:rgba(255,255,255,.16)}*{box-sizing:border-box;margin:0;padding:0}html,body{background:var(--g0);color:var(--g9);font-family:'DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100vh}body.modal-open{overflow:hidden}a{color:inherit;text-decoration:none}::selection{background:var(--green);color:#000}.wrap{min-height:100vh;display:flex;flex-direction:column}.topbar{position:sticky;top:0;z-index:100;background:rgba(6,6,6,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:14px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:12px}.brand-mark{width:28px;height:28px;border:1px solid var(--green);background:var(--green-dim);border-radius:3px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:var(--green);letter-spacing:.5px}.brand-txt{display:flex;flex-direction:column;line-height:1}.brand-name{font-size:17px;font-weight:700;letter-spacing:1.8px;color:var(--g9)}.brand-sub{font-size:8px;color:var(--g6);letter-spacing:.22em;text-transform:uppercase;margin-top:3px}.tb-right{display:flex;align-items:center;gap:20px}.status-chip{display:flex;align-items:center;gap:8px;padding:6px 12px;background:var(--g2);border:1px solid var(--border2);border-radius:3px;font-size:9px;color:var(--g7);letter-spacing:.1em;text-transform:uppercase}.status-dot{width:6px;height:6px;border-radius:50%;background:var(--g5);box-shadow:0 0 0 currentColor;transition:all .3s}.status-dot.live{background:var(--green);box-shadow:0 0 8px var(--green-glow);animation:pulse 2.5s ease-in-out infinite}.status-dot.err{background:var(--red);box-shadow:0 0 8px rgba(239,68,68,.5)}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.92)}}.signin{padding:8px 18px;background:transparent;border:1px solid var(--border3);border-radius:3px;color:var(--g8);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:.5px;cursor:pointer;transition:all .15s}.signin:hover{background:var(--g2);border-color:var(--green);color:var(--green)}.hero{position:relative;padding:80px 32px 60px;overflow:hidden;flex:1;display:flex;align-items:center;min-height:calc(100vh - 61px)}.hero-bg{position:absolute;inset:0;z-index:0;opacity:.55}.hero-bg canvas{display:block;width:100%;height:100%}.hero-grad{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 40%,rgba(0,255,65,.08) 0%,transparent 55%),radial-gradient(ellipse at 80% 60%,rgba(0,255,65,.03) 0%,transparent 50%);pointer-events:none;z-index:1}.hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.3fr 1fr;gap:60px;align-items:center}.hero-left{min-width:0}.tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:var(--green-subtle);border:1px solid rgba(0,255,65,.18);border-radius:3px;font-size:9px;color:var(--green);letter-spacing:.22em;text-transform:uppercase;margin-bottom:28px}.tag::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2.5s ease-in-out infinite}h1.title{font-size:clamp(42px,6.2vw,82px);font-weight:700;line-height:.96;letter-spacing:-.01em;margin-bottom:18px;color:var(--g9)}h1.title .accent{color:var(--green);text-shadow:0 0 40px rgba(0,255,65,.35)}.subtitle{font-size:17px;color:var(--g7);max-width:540px;line-height:1.55;margin-bottom:14px}.pillars{display:flex;gap:20px;margin-bottom:36px;font-size:10px;color:var(--g6);letter-spacing:.18em;text-transform:uppercase;flex-wrap:wrap}.pillars span{display:flex;align-items:center;gap:6px}.pillars span::before{content:'';width:4px;height:4px;background:var(--green);border-radius:50%;flex-shrink:0}.ctas{display:flex;gap:12px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 26px;font-size:13px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;border-radius:3px;cursor:pointer;transition:all .2s;border:1px solid transparent;text-decoration:none}.btn-primary{background:var(--green);color:#000;border-color:var(--green)}.btn-primary:hover{background:#00cc33;transform:translateY(-1px);box-shadow:0 8px 28px rgba(0,255,65,.25)}.btn-ghost{background:transparent;color:var(--g8);border-color:var(--border3)}.btn-ghost:hover{background:var(--g2);border-color:var(--g6);color:var(--g9)}.btn .arr{transition:transform .2s}.btn:hover .arr{transform:translateX(3px)}.hero-right{min-width:0}.ops-panel{background:linear-gradient(180deg,rgba(21,21,21,.92) 0%,rgba(12,12,12,.92) 100%);border:1px solid var(--border2);border-radius:4px;padding:24px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);position:relative;overflow:hidden}.ops-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 0%,var(--green) 50%,transparent 100%)}.ops-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid var(--border)}.ops-label{font-size:9px;color:var(--g6);letter-spacing:.22em;text-transform:uppercase}.ops-stamp{font-size:9px;color:var(--green)}.ops-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;font-size:11px;border-bottom:1px solid rgba(255,255,255,.03)}.ops-row:last-child{border-bottom:none}.ops-k{color:var(--g7)}.ops-v{color:var(--g9);display:flex;align-items:center;gap:8px}.ops-v .ok{color:var(--green)}.ops-v .warn{color:var(--orange)}.section{padding:70px 32px;border-top:1px solid var(--border);background:linear-gradient(180deg,var(--g0) 0%,var(--g1) 100%)}.section-inner{max-width:1200px;margin:0 auto}.sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;flex-wrap:wrap;gap:16px}.sec-label{font-size:9px;color:var(--g6);letter-spacing:.25em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:10px}.sec-label::before{content:'';width:16px;height:1px;background:var(--green)}.sec-title{font-size:32px;font-weight:600;color:var(--g9);letter-spacing:.5px;line-height:1}.sec-title .accent{color:var(--green)}.sec-meta{font-size:10px;color:var(--g6);letter-spacing:.12em}.tile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.tile{position:relative;background:var(--g1);border:1px solid var(--border);border-radius:4px;padding:24px 22px;cursor:pointer;transition:all .2s;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;min-height:200px;text-align:left;font-family:inherit;font-size:inherit}.tile::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--g4);transition:background .2s}.tile:hover{border-color:rgba(0,255,65,.28);background:var(--g2);transform:translateY(-2px)}.tile:hover::before{background:var(--green)}.tile:hover .tile-arr{color:var(--green);transform:translate(4px,-4px)}.tile-num{position:absolute;top:18px;right:20px;font-size:9px;color:var(--g5);letter-spacing:.12em}.tile-icon{font-size:11px;font-weight:700;color:var(--green);letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px}.tile-title{font-size:22px;font-weight:600;color:var(--g9);letter-spacing:.3px;line-height:1.15;margin-bottom:10px}.tile-desc{font-size:12px;color:var(--g7);line-height:1.55;flex:1;margin-bottom:16px}.tile-foot{display:flex;justify-content:space-between;align-items:center;font-size:9px;color:var(--g6);letter-spacing:.12em;text-transform:uppercase;padding-top:14px;border-top:1px solid rgba(255,255,255,.04)}.tile-arr{font-size:14px;color:var(--g6);transition:all .2s;display:inline-block}.sales-strip{padding:44px 32px;border-top:1px solid var(--border);background:var(--g1);position:relative;overflow:hidden}.sales-strip::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,255,65,.05) 0%,transparent 60%);pointer-events:none}.sales-inner{position:relative;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:auto 1fr auto;gap:28px;align-items:center}.sales-label{display:flex;flex-direction:column;gap:4px}.sales-tag{font-size:9px;color:var(--green);letter-spacing:.22em;text-transform:uppercase}.sales-title{font-size:19px;color:var(--g9);font-weight:500}.launch-btn{padding:12px 22px;background:var(--green);color:#000;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border:none;border-radius:3px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;text-decoration:none}.launch-btn:hover{background:#00cc33;transform:translateY(-1px);box-shadow:0 6px 22px rgba(0,255,65,.3)}footer.foot{padding:24px 32px;border-top:1px solid var(--border);background:var(--g0);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-size:9px;color:var(--g6);letter-spacing:.12em;text-transform:uppercase}.foot-left{display:flex;align-items:center;gap:22px}.foot-dot{width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);display:inline-block;margin-right:6px}.foot-right{display:flex;gap:22px}.foot-right a{color:var(--g6);transition:color .15s}.foot-right a:hover{color:var(--green)}.login-modal,.product-modal{display:none;position:fixed;inset:0;background:rgba(6,6,6,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:1000;align-items:center;justify-content:center;padding:20px;animation:fadeIn .18s ease-out}.login-modal.on,.product-modal.on{display:flex}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.login-box{background:var(--g1);border:1px solid var(--border2);border-radius:4px;padding:36px;max-width:380px;width:100%;position:relative}.login-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green)}.login-title{font-size:22px;font-weight:600;color:var(--g9);margin-bottom:6px;letter-spacing:.5px}.login-sub{font-size:9px;color:var(--g6);letter-spacing:.22em;text-transform:uppercase;margin-bottom:24px}.login-err{font-size:10px;color:var(--red);margin-bottom:10px;display:none;min-height:14px}.login-input{width:100%;padding:12px 14px;background:var(--g2);border:1px solid var(--border2);border-radius:3px;color:var(--g9);font-size:13px;letter-spacing:.06em;margin-bottom:12px;outline:none;transition:border-color .15s}.login-input:focus{border-color:var(--green)}.login-submit{width:100%;padding:13px;background:var(--green);color:#000;font-size:13px;font-weight:700;letter-spacing:2px;border:none;border-radius:3px;cursor:pointer;transition:background .2s}.login-submit:hover{background:#00cc33}.login-close,.pm-close{position:absolute;top:14px;right:16px;background:none;border:none;color:var(--g6);font-size:22px;cursor:pointer;line-height:1;padding:4px 10px;z-index:2}.login-close:hover,.pm-close:hover{color:var(--g9)}.product-box{background:var(--g1);border:1px solid var(--border2);border-radius:5px;max-width:680px;width:100%;position:relative;max-height:90vh;overflow-y:auto;animation:slideUp .22s ease-out}.product-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green)}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}.pm-mock{background:#000;border-bottom:1px solid var(--border);padding:0;height:200px;position:relative;overflow:hidden}.pm-mock canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.pm-mock-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,.55) 100%);pointer-events:none}.pm-mock-label{font-size:10px;color:rgba(0,255,65,.7);letter-spacing:.25em;text-transform:uppercase;text-shadow:0 0 12px rgba(0,255,65,.4)}.pm-body{padding:28px 32px 32px}.pm-tag{display:inline-flex;align-items:center;gap:8px;font-size:9px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:14px}.pm-tag .pm-status{padding:3px 9px;border-radius:2px;font-weight:500}.pm-status.live{background:var(--green-dim);color:var(--green);border:1px solid rgba(0,255,65,.3)}.pm-status.beta{background:rgba(249,115,22,.12);color:var(--orange);border:1px solid rgba(249,115,22,.3)}.pm-status.preview{background:rgba(59,130,246,.12);color:var(--blue);border:1px solid rgba(59,130,246,.3)}.pm-num{color:var(--g6)}.pm-title{font-size:30px;font-weight:600;color:var(--g9);line-height:1.05;margin-bottom:10px;letter-spacing:.3px}.pm-sub{font-size:14px;color:var(--g7);margin-bottom:22px;line-height:1.6}.pm-features{list-style:none;padding:0;margin:0 0 24px;display:grid;grid-template-columns:1fr 1fr;gap:8px 18px}.pm-features li{font-size:12px;color:var(--g8);padding:6px 0;display:flex;align-items:flex-start;gap:8px}.pm-features li::before{content:'\u25B8';color:var(--green);font-size:11px;flex-shrink:0;margin-top:1px}.pm-actions{display:flex;gap:10px;align-items:center;border-top:1px solid var(--border);padding-top:20px;flex-wrap:wrap}.pm-launch{padding:12px 24px;background:var(--green);color:#000;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border:none;border-radius:3px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all .15s}.pm-launch:hover{background:#00cc33;transform:translateY(-1px);box-shadow:0 6px 22px rgba(0,255,65,.3)}.pm-launch.disabled{background:var(--g3);color:var(--g6);cursor:not-allowed}.pm-launch.disabled:hover{background:var(--g3);transform:none;box-shadow:none}.pm-secondary{padding:12px 22px;background:transparent;color:var(--g7);font-family:'DM Sans',sans-serif;font-size:12px;border:1px solid var(--border3);border-radius:3px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all .15s}.pm-secondary:hover{color:var(--g9);border-color:var(--g6);background:var(--g2)}@media (max-width:900px){.hero{padding:50px 20px 40px}.hero-inner{grid-template-columns:1fr;gap:36px}.hero-right{order:-1;max-width:340px;margin:0 auto;width:100%}.section{padding:50px 20px}.tile-grid{grid-template-columns:repeat(2,1fr);gap:10px}.tile{min-height:170px;padding:20px 18px}.tile-title{font-size:19px}.topbar{padding:12px 20px}.status-chip{display:none}.sales-inner{grid-template-columns:1fr;gap:18px}.sales-strip{padding:32px 20px}.foot{padding:20px;font-size:8px}.foot-left,.foot-right{gap:14px}.product-box{max-height:100vh;border-radius:0}.pm-features{grid-template-columns:1fr}.pm-mock{height:140px}.pm-title{font-size:24px}}@media (max-width:560px){h1.title{font-size:44px}.tile-grid{grid-template-columns:1fr}.brand-sub{display:none}.pillars{gap:12px;font-size:9px}}</style></head><body><div class="wrap"><header class="topbar"><div class="brand"><div class="brand-mark">N</div><div class="brand-txt"><div class="brand-name">NAC OS</div><div class="brand-sub">Ontario Contractors</div></div></div><div class="tb-right"><div class="status-chip"><span class="status-dot" id="stat-dot"></span><span id="stat-txt">checking...</span></div><button class="signin" onclick="openLogin()">Sign in</button></div></header><section class="hero"><div class="hero-bg"><canvas id="gridCanvas"></canvas></div><div class="hero-grad"></div><div class="hero-inner"><div class="hero-left"><div class="tag">Cornwall \xB7 Ontario \xB7 Live</div><h1 class="title">The operating<br>system for <span class="accent">Ontario<br>contractors</span>.</h1><p class="subtitle">A premium, Ontario-aligned operating layer designed for contractors who want inspection-ready structure without rebuilding from scratch.</p><div class="pillars"><span>Compliance</span><span>Finance</span><span>Fleet</span><span>Training</span></div><div class="ctas"><a class="btn btn-primary" href="/nac-os/command-centre">Enter Command Centre <span class="arr">\u2192</span></a><a class="btn btn-ghost" href="/nac/property/demo">Preview Property Demo</a></div></div><div class="hero-right"><div class="ops-panel"><div class="ops-head"><span class="ops-label">System Status</span><span class="ops-stamp" id="ops-stamp">\u2014</span></div><div class="ops-row"><span class="ops-k">Worker</span><span class="ops-v"><span class="ok">nacosapp</span></span></div><div class="ops-row"><span class="ops-k">Version</span><span class="ops-v" id="ops-version">\u2014</span></div><div class="ops-row"><span class="ops-k">Stack</span><span class="ops-v">CF Workers + D1</span></div><div class="ops-row"><span class="ops-k">Region</span><span class="ops-v">Global edge</span></div><div class="ops-row"><span class="ops-k">Health</span><span class="ops-v" id="ops-health"><span class="ok">\u25CF OK</span></span></div><div class="ops-row"><span class="ops-k">Last check</span><span class="ops-v" id="ops-last">\u2014</span></div></div></div></div></section><section class="section"><div class="section-inner"><div class="sec-head"><div><div class="sec-label">The Stack</div><div class="sec-title">Six systems. <span class="accent">One console.</span></div></div><div class="sec-meta">CLICK ANY TILE FOR DETAILS</div></div><div class="tile-grid"><button class="tile" onclick="openProduct('cmd')"><span class="tile-num">01 / CMD</span><div class="tile-icon">Command</div><div class="tile-title">Command Centre</div><div class="tile-desc">Site summary, draw tracker, mortgage calculator, field command. Construction ops in a single terminal.</div><div class="tile-foot"><span>MASTER DASHBOARD</span><span class="tile-arr">\u2197</span></div></button><button class="tile" onclick="openProduct('billfold')"><span class="tile-num">02 / BF</span><div class="tile-icon">Finance</div><div class="tile-title">Billfold Ledger</div><div class="tile-desc">License keys, Stripe orders, revenue dashboard, lead pipeline, email sequences, and admin tools.</div><div class="tile-foot"><span>REVENUE \xB7 ADMIN</span><span class="tile-arr">\u2197</span></div></button><button class="tile" onclick="openProduct('ocos')"><span class="tile-num">03 / OCOS</span><div class="tile-icon">Compliance</div><div class="tile-title">OCOS T1 \u2013 T3</div><div class="tile-desc">Ontario Compliance Operating System\u2122. Inspection-ready documentation. AI-driven generation. Legal-aligned.</div><div class="tile-foot"><span>OHSA \xB7 WSIB</span><span class="tile-arr">\u2197</span></div></button><button class="tile" onclick="openProduct('learning')"><span class="tile-num">04 / LRN</span><div class="tile-icon">Training</div><div class="tile-title">Learning Academy</div><div class="tile-desc">Contractor training aligned with Ontario OHSA and WSIB. Structured lessons, progress tracking, audit-ready.</div><div class="tile-foot"><span>ACADEMY</span><span class="tile-arr">\u2197</span></div></button><button class="tile" onclick="openProduct('npd')"><span class="tile-num">05 / NPD</span><div class="tile-icon">Property</div><div class="tile-title">NAC Property Demo</div><div class="tile-desc">Work orders, tenant management, compliance tracking, QR job scanning. Property management built for site.</div><div class="tile-foot"><span>PREVIEW AVAILABLE</span><span class="tile-arr">\u2197</span></div></button><button class="tile" onclick="openProduct('admin')"><span class="tile-num">06 / ADM</span><div class="tile-icon">Admin</div><div class="tile-title">Order Admin</div><div class="tile-desc">Review Stripe orders, approve licenses, manage customer records, audit webhooks, and dispatch access emails.</div><div class="tile-foot"><span>OPERATOR ONLY</span><span class="tile-arr">\u2197</span></div></button></div></div></section><section class="sales-strip"><div class="sales-inner"><div class="sales-label"><div class="sales-tag">Sales \xB7 Demo Access</div><div class="sales-title">Preview the NAC Property Demo</div></div><div></div><a class="launch-btn" href="/nac/property/demo">Request Demo Access \u2192</a></div></section><footer class="foot"><div class="foot-left"><span><span class="foot-dot"></span><span id="foot-ver">nacosapp \xB7 v3.0.0</span></span><span>Cloudflare Workers \xB7 D1 \xB7 KV \xB7 Resend</span><span>Natural Alternatives \xB7 Cornwall ON</span></div><div class="foot-right"><a href="/api/health">/api/health</a><a href="https://www.naturalalternatives.ca" target="_blank">naturalalternatives.ca</a></div></footer></div><div class="login-modal" id="login-modal"><div class="login-box"><button class="login-close" onclick="closeLogin()">\xD7</button><div class="login-title">Operator Sign In</div><div class="login-sub">Access the NAC OS console</div><div class="login-err" id="login-err"></div><input class="login-input" type="password" id="login-pw" placeholder="admin password" autocomplete="current-password"><button class="login-submit" onclick="doLogin()">Enter</button></div></div><div class="product-modal" id="product-modal"><div class="product-box" id="product-box"><button class="pm-close" onclick="closeProduct()">\xD7</button><div class="pm-mock"><canvas id="pmCanvas"></canvas><div class="pm-mock-overlay"><div class="pm-mock-label" id="pm-mock-label">\u2014</div></div></div><div class="pm-body"><div class="pm-tag"><span class="pm-num" id="pm-num">\u2014</span><span class="pm-status" id="pm-status">live</span></div><div class="pm-title" id="pm-title">\u2014</div><div class="pm-sub" id="pm-sub">\u2014</div><ul class="pm-features" id="pm-features"></ul><div class="pm-actions"><a class="pm-launch" id="pm-launch" href="#">Launch \u2192</a><button class="pm-secondary" onclick="closeProduct()">Close</button></div></div></div></div><script>const PRODUCTS={cmd:{num:'01 / CMD',title:'Command Centre',status:'live',mockLabel:'CMD \xB7 SITE SUMMARY',sub:'Real-time construction operations terminal. Reads live from D1 with audit-logged edits, auto-lock after idle, and operator sign-off on every cell.',features:['Live D1 sync \u2014 6 endpoints','Draw tracker \u2014 4 draws \xB7 64 line items','Editable budget \u2014 audit logged','10-min auto-lock','Site summary \xB7 mortgage calc','Mobile-friendly inputs'],launch:'/nac-os/command-centre',launchLabel:'Enter Command Centre \u2192'},billfold:{num:'02 / BF',title:'Billfold Ledger',status:'live',mockLabel:'BF \xB7 REVENUE OPS',sub:'Revenue dashboard for license keys, Stripe orders, and lead pipeline. Track every customer from first form fill to active license, with admin tools and email automation.',features:['Stripe webhook \u2014 paid sessions only','Order approval \u2014 manual + auto','License key generation','Day 0/1/3/7 nurture sequences','Revenue \u2014 30-day + all-time','OCOS product routing'],launch:'/dashboard',launchLabel:'Open Billfold \u2192'},ocos:{num:'03 / OCOS',title:'OCOS T1 \u2013 T3',status:'live',mockLabel:'OCOS \xB7 ONTARIO COMPLIANCE',sub:'The Ontario Compliance Operating System\u2122. Inspection-ready documentation system aligned with OHSA and WSIB requirements. Three tiers: Foundation, Generation, Operations.',features:['Tier 1 \u2014 Foundation Guide ($397)','Tier 2 \u2014 AI-Driven Generation ($697)','Tier 3 \u2014 Operations System ($597)','Full bundle \u2014 $1,297','Notion workspace delivery','Document Control Register'],launch:'https://www.naturalalternatives.ca/ontario-compliance-operating-system-/',launchLabel:'Visit OCOS \u2197'},learning:{num:'04 / LRN',title:'Learning Academy',status:'live',mockLabel:'LRN \xB7 CONTRACTOR TRAINING',sub:'Structured contractor training aligned with Ontario OHSA, WSIB, and MOL requirements. Lessons, progress tracking, and audit-ready completion records.',features:['Module-based progression','XP \xB7 streak tracking','Compliance audit trail','Mobile-first delivery','Fleet Logbook integration','Owner + crew dashboards'],launch:'/learning',launchLabel:'Open Learning \u2192'},npd:{num:'05 / NPD',title:'NAC Property Demo',status:'preview',mockLabel:'NPD \xB7 PROPERTY MANAGEMENT',sub:'Property management platform built for managers who work on site. Work orders, tenant management, QR job scanning, AI-powered maintenance \u2014 entire workflow from a phone.',features:['Property registry \u2014 buildings, units','Work orders \u2014 audit trail','QR job tracking \u2014 arrival/departure','Tenant portal \u2014 leases, charges','Compliance \u2014 fire, HVAC, certs','AI \u2014 voice notes, summaries'],launch:'/nac/property/demo',launchLabel:'Request Demo Access \u2192'},admin:{num:'06 / ADM',title:'Order Admin',status:'live',mockLabel:'ADM \xB7 OPERATOR CONSOLE',sub:'Review and dispatch every Stripe order. Approve licenses, audit webhooks, manage customer records, and resend access emails. Operator-only.',features:['Pending order review','One-click approve / reject','License key generation','Auto-approve toggle','Email resend','Admin password gated'],launch:'/admin',launchLabel:'Open Admin \u2192'}};function openProduct(key){const p=PRODUCTS[key];if(!p)return;document.getElementById('pm-num').textContent=p.num;document.getElementById('pm-title').textContent=p.title;document.getElementById('pm-sub').textContent=p.sub;document.getElementById('pm-mock-label').textContent=p.mockLabel;const stEl=document.getElementById('pm-status');stEl.textContent=p.status;stEl.className='pm-status '+p.status;document.getElementById('pm-features').innerHTML=p.features.map(f=>'<li>'+f+'</li>').join('');const launchEl=document.getElementById('pm-launch');launchEl.href=p.launch;launchEl.textContent=p.launchLabel;document.getElementById('product-modal').classList.add('on');document.body.classList.add('modal-open');startMockAnim();}function closeProduct(){document.getElementById('product-modal').classList.remove('on');document.body.classList.remove('modal-open');stopMockAnim();}document.getElementById('product-modal').addEventListener('click',function(e){if(e.target===this)closeProduct();});let mockAnimId=null;function startMockAnim(){const c=document.getElementById('pmCanvas');if(!c)return;const ctx=c.getContext('2d');function size(){const r=c.parentElement.getBoundingClientRect();c.width=r.width*devicePixelRatio;c.height=r.height*devicePixelRatio;c.style.width=r.width+'px';c.style.height=r.height+'px';}size();let t=0;const G=24*devicePixelRatio;function draw(){const w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle='rgba(0,255,65,0.06)';ctx.beginPath();for(let x=(t*0.4)%G;x<w;x+=G){ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let y=(t*0.2)%G;y<h;y+=G){ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();const sy=((t*1.2)%(h+100))-50;const grad=ctx.createLinearGradient(0,sy-40,0,sy+40);grad.addColorStop(0,'rgba(0,255,65,0)');grad.addColorStop(0.5,'rgba(0,255,65,0.18)');grad.addColorStop(1,'rgba(0,255,65,0)');ctx.fillStyle=grad;ctx.fillRect(0,sy-40,w,80);for(let i=0;i<5;i++){const px=((t*0.5+i*180)%(w+50))-25;const py=((i*97+t*0.1)%h);ctx.fillStyle='rgba(0,255,65,'+(0.3+0.2*Math.sin(t*0.05+i))+')';ctx.fillRect(px,py,2,2);}t+=1;mockAnimId=requestAnimationFrame(draw);}draw();}function stopMockAnim(){if(mockAnimId){cancelAnimationFrame(mockAnimId);mockAnimId=null;}}(function(){const c=document.getElementById('gridCanvas');if(!c)return;const ctx=c.getContext('2d');let w,h,t=0;function size(){const r=c.parentElement.getBoundingClientRect();w=c.width=r.width*devicePixelRatio;h=c.height=r.height*devicePixelRatio;c.style.width=r.width+'px';c.style.height=r.height+'px';}size();window.addEventListener('resize',size);const G=48*devicePixelRatio;function draw(){ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle='rgba(0,255,65,0.05)';ctx.beginPath();for(let x=0;x<w;x+=G){ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let y=0;y<h;y+=G){ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();const scanY=((t*0.5)%(h+200))-100;const grad=ctx.createLinearGradient(0,scanY-80,0,scanY+80);grad.addColorStop(0,'rgba(0,255,65,0)');grad.addColorStop(0.5,'rgba(0,255,65,0.12)');grad.addColorStop(1,'rgba(0,255,65,0)');ctx.fillStyle=grad;ctx.fillRect(0,scanY-80,w,160);ctx.strokeStyle='rgba(0,255,65,0.22)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,scanY);ctx.lineTo(w,scanY);ctx.stroke();for(let i=0;i<3;i++){const bx=((t*0.3+i*300)%(w+100))-50;const by=((i*137)%h);ctx.fillStyle='rgba(0,255,65,0.35)';ctx.fillRect(bx,by,2,2);}t+=1;requestAnimationFrame(draw);}draw();})();function updateStatus(){fetch('/api/health').then(r=>r.ok?r.json():Promise.reject()).then(d=>{const dot=document.getElementById('stat-dot'),tx=document.getElementById('stat-txt'),h=document.getElementById('ops-health'),v=document.getElementById('ops-version'),fv=document.getElementById('foot-ver'),st=document.getElementById('ops-stamp'),la=document.getElementById('ops-last');if(dot)dot.className='status-dot live';if(tx)tx.textContent='System Live';if(h)h.innerHTML='<span class="ok">\u25CF '+(d.status||'ok').toUpperCase()+'</span>';if(v)v.textContent=d.version||'\u2014';if(fv)fv.textContent='nacosapp \xB7 v'+(d.version||'3.0.0');const now=new Date(d.timestamp||Date.now());if(st)st.textContent=now.toISOString().slice(11,19)+' UTC';if(la)la.textContent='just now';}).catch(()=>{const dot=document.getElementById('stat-dot'),tx=document.getElementById('stat-txt'),h=document.getElementById('ops-health');if(dot)dot.className='status-dot err';if(tx)tx.textContent='System Down';if(h)h.innerHTML='<span style="color:var(--red)">\u25CF ERROR</span>';});}updateStatus();setInterval(updateStatus,30000);function openLogin(){document.getElementById('login-modal').classList.add('on');document.body.classList.add('modal-open');setTimeout(()=>document.getElementById('login-pw').focus(),50);}function closeLogin(){document.getElementById('login-modal').classList.remove('on');document.body.classList.remove('modal-open');document.getElementById('login-err').style.display='none';document.getElementById('login-pw').value='';}document.getElementById('login-modal').addEventListener('click',function(e){if(e.target===this)closeLogin();});document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(document.getElementById('login-modal').classList.contains('on'))closeLogin();if(document.getElementById('product-modal').classList.contains('on'))closeProduct();}});document.getElementById('login-pw').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});function doLogin(){const pw=document.getElementById('login-pw').value;const err=document.getElementById('login-err');err.style.display='none';fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}).then(r=>{if(r.ok){try{localStorage.setItem('nac_pw',pw);localStorage.setItem('nac_cmd_pw',pw);}catch(_){}window.location.href='/dashboard';}else{err.textContent='Access denied';err.style.display='block';}}).catch(()=>{err.textContent='Connection error';err.style.display='block';});}<\/script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store", "cf-edge-cache": "no-store" } });
}
__name(handleHomePage, "handleHomePage");
__name2(handleHomePage, "handleHomePage");
function handleCommandCentre() {
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NAC OS - Command Centre</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#060606;color:#F2F2F2;font-family:system-ui,-apple-system,sans-serif;font-size:13px}
.gate{display:flex;align-items:center;justify-content:center;height:100vh}
.gate-box{background:#111;border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:40px;width:360px;text-align:center}
.gate-logo{font-size:28px;font-weight:700;color:#00FF41;letter-spacing:3px;margin-bottom:4px}
.gate-sub{font-size:10px;color:#666;letter-spacing:.2em;text-transform:uppercase;margin-bottom:24px}
input[type=password]{width:100%;padding:10px 14px;background:#1E1E1E;border:1px solid rgba(255,255,255,.12);border-radius:4px;color:#F2F2F2;font-size:13px;margin-bottom:10px;outline:none;text-align:center}
input:focus{border-color:#00FF41}
.gate-btn{width:100%;padding:11px;background:#00FF41;color:#000;font-size:14px;font-weight:700;letter-spacing:2px;border:none;border-radius:4px;cursor:pointer}
.gate-btn:hover{background:#00cc33}
.gate-err{color:#EF4444;font-size:11px;margin-bottom:8px;display:none}
.app{display:none;height:100vh;overflow:auto;padding:20px;max-width:1200px;margin:0 auto}
.tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.tab{padding:8px 16px;background:#1E1E1E;border:1px solid rgba(255,255,255,.1);border-radius:4px;color:#909090;cursor:pointer;font-size:12px}
.tab.on{background:rgba(0,255,65,.1);color:#00FF41;border-color:rgba(0,255,65,.2)}
.panel{display:none}.panel.on{display:block}
.card{background:#111;border:1px solid rgba(255,255,255,.06);border-radius:4px;padding:14px;margin-bottom:10px}
.card-title{font-size:10px;color:#666;letter-spacing:.15em;text-transform:uppercase;margin-bottom:8px}
.metrics{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.mc{background:#1E1E1E;border:1px solid rgba(255,255,255,.06);border-radius:4px;padding:10px 14px;min-width:130px}
.mc .lbl{font-size:9px;color:#666;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.mc .val{font-size:20px;font-weight:500}
.green{color:#00FF41}.orange{color:#F97316}.red{color:#EF4444}
table{width:100%;border-collapse:collapse;font-size:11px;margin-top:6px}
th{font-size:9px;color:#666;padding:6px 8px;text-align:left;border-bottom:1px solid rgba(255,255,255,.06);letter-spacing:.1em;text-transform:uppercase}
td{padding:6px 8px;border-bottom:1px solid rgba(255,255,255,.03);color:#D8D8D8}
.badge{font-size:9px;padding:2px 6px;border-radius:2px;display:inline-block}
.Paid,.advanced{background:rgba(0,255,65,.1);color:#00FF41}
.Partial{background:rgba(249,115,22,.12);color:#F97316}
.Pending,.pending{background:#2D2D2D;color:#909090}
.Owing{background:rgba(239,68,68,.1);color:#EF4444}
.requested{background:rgba(249,115,22,.12);color:#F97316}
.Receivable{background:#2D2D2D;color:#909090}
.Reserve,.Future,.DIY{background:#2D2D2D;color:#666}
details{margin-bottom:4px}
summary{cursor:pointer;padding:8px 12px;background:#1E1E1E;border-radius:3px;font-size:12px;color:#D8D8D8;display:flex;justify-content:space-between;list-style:none}
summary::-webkit-details-marker{display:none}
summary::before{content:"\\25B8 ";color:#666;margin-right:6px}
details[open] summary::before{content:"\\25BE ";color:#00FF41}
.status-bar{font-size:10px;color:#666;margin-bottom:12px;padding:8px 12px;background:#111;border-radius:4px;border:1px solid rgba(255,255,255,.06)}
.slider-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px 10px;background:#1E1E1E;border-radius:3px}
.slider-row label{font-size:10px;color:#666;width:140px;flex-shrink:0}
.slider-row input[type=range]{flex:1}
.slider-row .sv{font-size:13px;color:#F2F2F2;min-width:60px;text-align:right}
.search-box{margin-bottom:12px;display:flex;gap:8px}
.search-box input{flex:1;padding:8px 12px;background:#1E1E1E;border:1px solid rgba(255,255,255,.1);border-radius:4px;color:#F2F2F2;font-size:12px;outline:none}
.search-box input:focus{border-color:#00FF41}
.search-box input::placeholder{color:#555}
</style></head><body>
<div class="gate" id="gate">
<div class="gate-box">
<div class="gate-logo">NAC OS</div>
<div class="gate-sub">Command Centre</div>
<div class="gate-err" id="gate-err">Access denied</div>
<input type="password" id="gate-pw" placeholder="password" autocomplete="off" autofocus>
<button class="gate-btn" id="gate-btn">ENTER</button>
</div>
</div>
<div class="app" id="app">
<div class="tabs" id="tabs"></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;font-size:11px"><a href="/" target="_blank" style="color:#909090;text-decoration:none;padding:5px 10px;background:#1E1E1E;border:1px solid rgba(255,255,255,.08);border-radius:3px">NAC OS Home</a><a href="/dashboard" target="_blank" style="color:#909090;text-decoration:none;padding:5px 10px;background:#1E1E1E;border:1px solid rgba(255,255,255,.08);border-radius:3px">Billfold</a><a href="/admin" target="_blank" style="color:#909090;text-decoration:none;padding:5px 10px;background:#1E1E1E;border:1px solid rgba(255,255,255,.08);border-radius:3px">Order Admin</a><a href="/learning" target="_blank" style="color:#909090;text-decoration:none;padding:5px 10px;background:#1E1E1E;border:1px solid rgba(255,255,255,.08);border-radius:3px">Learning</a><a href="/nac/property/demo" target="_blank" style="color:#909090;text-decoration:none;padding:5px 10px;background:#1E1E1E;border:1px solid rgba(255,255,255,.08);border-radius:3px">Property Demo</a></div><div class="status-bar" id="status">Loading...</div>
<div class="panel on" id="panel-build">
<div class="card"><div class="card-title">Budget Overview</div><div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap"><canvas id="budgetRing" width="120" height="120" style="flex-shrink:0"></canvas><div class="metrics" id="build-metrics" style="flex:1"></div></div></div>
<div class="search-box"><input type="text" id="build-search" placeholder="Search items..."></div>
<div id="build-cats"></div>
</div>
<div class="panel" id="panel-draws">
<div class="card"><div class="card-title">Draws Overview</div><div class="metrics" id="draw-metrics"></div></div>
<div class="card"><div class="card-title">Running Balance</div><canvas id="balanceChart" height="160" style="width:100%"></canvas></div><div class="card"><div class="card-title">Phase 1 Interest (11.5%/yr)</div><canvas id="interestChart" height="160" style="width:100%"></canvas></div><div class="card"><div class="card-title">Cumulative Gross vs Spent</div><canvas id="cashflowChart" height="160" style="width:100%"></canvas></div><div class="search-box"><input type="text" id="draws-search" placeholder="Search draws..."></div>
<div class="card"><div id="draws-table"></div></div>
</div>
<div class="panel" id="panel-mortgage">
<div class="card"><div class="card-title">Mortgage Calculator</div>
<div class="slider-row"><label>Phase 1 rate</label><input type="range" min="8" max="20" step="0.25" value="11.5" id="mr1"><span class="sv" id="mr1v">11.5%</span></div>
<div class="slider-row"><label>Phase 2 rate</label><input type="range" min="6" max="15" step="0.25" value="10" id="mr2"><span class="sv" id="mr2v">10.0%</span></div>
<div class="slider-row"><label>Take-out rate</label><input type="range" min="3" max="8" step="0.05" value="4.25" id="mr3"><span class="sv" id="mr3v">4.25%</span></div>
<div class="slider-row"><label>Cash injection</label><input type="range" min="0" max="200000" step="1000" value="70810" id="mci"><span class="sv" id="mciv">$70,810</span></div>
<div class="slider-row"><label>HST rebates</label><input type="range" min="0" max="50000" step="500" value="40080" id="mreb"><span class="sv" id="mrebv">$40,080</span></div>
<div class="metrics" id="mort-out"></div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px" id="mort-scenarios"></div>
<div class="metrics" style="margin-top:12px" id="mort-break"></div>
</div>
</div>
<div class="panel" id="panel-field">
<div class="card"><div class="card-title">Field Command</div>
<div class="metrics" id="field-metrics"></div>
<div id="field-content" style="margin-top:12px"></div>
</div>
</div>
</div>
<script>
var pw="";var CATS=[];var DRAWS=[];var SETTINGS={};
var fmt=function(v){return(v<0?"-$":"$")+Math.abs(v).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2});};
var fmtK=function(v){return(v<0?"-$":"$")+Math.round(Math.abs(v)/1000)+"k";};
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

// TABS
var TABS=[
  {id:"build",label:"Site Summary"},
  {id:"draws",label:"Draw Tracker"},
  {id:"mortgage",label:"Mortgage Calc"},
  {id:"field",label:"Field Command"}
];
function renderTabs(){
  var el=document.getElementById("tabs");
  el.innerHTML="";
  TABS.forEach(function(t,i){
    var d=document.createElement("div");
    d.className="tab"+(i===0?" on":"");
    d.textContent=t.label;
    d.addEventListener("click",function(){
      document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("on");});
      d.classList.add("on");
      document.querySelectorAll(".panel").forEach(function(x){x.classList.remove("on");});
      document.getElementById("panel-"+t.id).classList.add("on");
      if(t.id==="mortgage")calcMort();
      if(t.id==="field")renderField();
    });
    el.appendChild(d);
  });
}
renderTabs();

// AUTH
document.getElementById("gate-btn").addEventListener("click",auth);
document.getElementById("gate-pw").addEventListener("keydown",function(ev){if(ev.key==="Enter")auth();});
async function auth(){
  var p=document.getElementById("gate-pw").value;
  var e=document.getElementById("gate-err");
  e.style.display="none";
  if(!p){e.textContent="Enter password";e.style.display="block";return;}
  try{
    var r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p})});
    if(r.ok){
      pw=p;try{localStorage.setItem("nac_cmd_pw",p);localStorage.setItem("nac_pw",p);}catch(x){}
      document.getElementById("gate").style.display="none";
      document.getElementById("app").style.display="block";
      initAll();
    }else{e.textContent="Wrong password";e.style.display="block";}
  }catch(err){e.textContent="Connection error: "+err.message;e.style.display="block";}
}
(async function(){
  var s;try{s=localStorage.getItem("nac_cmd_pw")||localStorage.getItem("nac_pw");}catch(x){}
  if(!s)return;
  try{
    var r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:s})});
    if(r.ok){pw=s;document.getElementById("gate").style.display="none";document.getElementById("app").style.display="block";initAll();}
    else{try{localStorage.removeItem("nac_cmd_pw");}catch(x){}}
  }catch(x){}
})();

// D1 LOAD
async function initAll(){
  document.getElementById("status").textContent="Loading from D1...";
  try{
    var resp=await Promise.all([
      fetch("/api/command-centre/draws").then(function(r){return r.json();}),
      fetch("/api/command-centre/budget").then(function(r){return r.json();}),
      fetch("/api/command-centre/settings").then(function(r){return r.json();})
    ]);
    DRAWS=(resp[0]&&resp[0].draws)||[];
    var d1Cats=(resp[1]&&resp[1].categories)||[];
    CATS=[];
    for(var c=0;c<d1Cats.length;c++){
      var cat=d1Cats[c];var items=[];
      for(var ii=0;ii<cat.items.length;ii++){
        var it=cat.items[ii];
        items.push({n:it.n,ex:it.ex||0,act:it.act||0,st:it.st||"Pending",dr:it.dr||""});
      }
      CATS.push({id:cat.id,label:cat.label,items:items});
    }
    SETTINGS=(resp[2]&&resp[2].settings)||{};
    var ls=SETTINGS.last_sync||"never";
    var src=SETTINGS.last_sync_source||"";
    document.getElementById("status").textContent="Loaded "+CATS.length+" categories, "+DRAWS.length+" draws | Last sync: "+ls+(src?" ("+src+")":"");
    renderBuild();renderDraws();calcMort();renderField();renderCharts();
  }catch(e){
    document.getElementById("status").textContent="Error loading D1: "+e.message;
  }
}

// SITE SUMMARY
function renderBuild(){
  var totAct=0;var totEst=0;
  CATS.forEach(function(c){c.items.forEach(function(i){totAct+=(i.act||0);totEst+=(i.ex||0);});});
  var rem=600000-totAct;var pct=Math.round(totAct/600000*100);
  document.getElementById("build-metrics").innerHTML=[
    {l:"Budget",v:fmt(600000),cls:""},{l:"Paid ("+pct+"%)",v:fmt(Math.round(totAct)),cls:"green"},
    {l:"Remaining",v:fmt(Math.round(rem)),cls:rem<0?"red":"orange"},{l:"Est. ex-HST",v:fmt(Math.round(totEst)),cls:""}
  ].map(function(m){return '<div class="mc"><div class="lbl">'+m.l+'</div><div class="val '+m.cls+'">'+m.v+'</div></div>';}).join("");
  var bc=document.getElementById("build-cats");
  bc.innerHTML="";
  CATS.forEach(function(cat){
    var paid=cat.items.reduce(function(s,i){return s+(i.act||0);},0);
    var det=document.createElement("details");
    var sum=document.createElement("summary");
    sum.innerHTML="<span>"+esc(cat.label)+"</span><span style='color:#666'>"+fmt(paid)+" paid</span>";
    det.appendChild(sum);
    var tbl=document.createElement("div");
    tbl.innerHTML='<table><thead><tr><th>Item</th><th>Est.</th><th>Actual</th><th>Status</th><th>Draw</th></tr></thead><tbody>'+
      cat.items.map(function(item){
        return "<tr><td>"+esc(item.n)+"</td><td>"+fmt(item.ex)+"</td><td>"+fmt(item.act)+"</td><td><span class='badge "+esc(item.st)+"'>"+esc(item.st)+"</span></td><td>"+esc(item.dr)+"</td></tr>";
      }).join("")+'</tbody></table>';
    det.appendChild(tbl);
    det.setAttribute("data-search",(cat.label+" "+cat.items.map(function(i){return i.n+" "+i.st+" "+i.dr;}).join(" ")).toLowerCase());
    bc.appendChild(det);
  });
}
document.getElementById("build-search").addEventListener("input",function(){
  var q=this.value.toLowerCase().trim();
  document.querySelectorAll("#build-cats details").forEach(function(d){
    var hay=d.getAttribute("data-search")||"";
    d.style.display=(q===""||hay.indexOf(q)!==-1)?"":"none";
    if(q&&hay.indexOf(q)!==-1)d.open=true;
  });
});

// DRAW TRACKER
function renderDraws(){
  var totAdv=0;var totFees=0;var totNet=0;
  DRAWS.forEach(function(d){totAdv+=(d.gross||0);totFees+=(d.lender_fee||0)+(d.legal_fee||0);totNet+=(d.net||0);});
  document.getElementById("draw-metrics").innerHTML=[
    {l:"Total Advanced",v:fmt(totAdv),cls:"green"},{l:"Total Fees",v:fmt(totFees),cls:"orange"},
    {l:"Net Deposited",v:fmt(totNet),cls:""},{l:"Budget Ceiling",v:fmt(600000),cls:""}
  ].map(function(m){return '<div class="mc"><div class="lbl">'+m.l+'</div><div class="val '+m.cls+'">'+m.v+'</div></div>';}).join("");
  document.getElementById("draws-table").innerHTML='<table><thead><tr><th>ID</th><th>Label</th><th>Date</th><th>Gross</th><th>Net</th><th>Lender</th><th>Legal</th><th>Status</th></tr></thead><tbody>'+
    DRAWS.map(function(d){
      return "<tr data-search='"+esc((d.id+" "+d.label+" "+d.date+" "+(d.status||"")).toLowerCase())+"'><td>"+esc(d.id)+"</td><td>"+esc(d.label)+"</td><td>"+esc(d.date)+"</td><td>"+fmt(d.gross||0)+"</td><td>"+fmt(d.net||0)+"</td><td>"+fmt(d.lender_fee||0)+"</td><td>"+fmt(d.legal_fee||0)+"</td><td><span class='badge "+(d.status||"pending")+"'>"+esc(d.status||"pending")+"</span></td></tr>";
    }).join("")+'</tbody></table>';
}
document.getElementById("draws-search").addEventListener("input",function(){
  var q=this.value.toLowerCase().trim();
  document.querySelectorAll("#draws-table tbody tr").forEach(function(r){
    var hay=r.getAttribute("data-search")||"";
    r.style.display=(q===""||hay.indexOf(q)!==-1)?"":"none";
  });
});

// MORTGAGE CALC
["mr1","mr2","mr3","mci","mreb"].forEach(function(id){
  document.getElementById(id).addEventListener("input",calcMort);
});
function calcMort(){
  var r1=parseFloat(document.getElementById("mr1").value)/100;
  var r2=parseFloat(document.getElementById("mr2").value)/100;
  var r3=parseFloat(document.getElementById("mr3").value)/100;
  var ci=parseFloat(document.getElementById("mci").value);
  var reb=parseFloat(document.getElementById("mreb").value);
  document.getElementById("mr1v").textContent=(r1*100).toFixed(2)+"%";
  document.getElementById("mr2v").textContent=(r2*100).toFixed(2)+"%";
  document.getElementById("mr3v").textContent=(r3*100).toFixed(2)+"%";
  document.getElementById("mciv").textContent=fmt(ci);
  document.getElementById("mrebv").textContent=fmt(reb);
  var da={0:100000,3:117261,6:75000,9:69000};
  if(DRAWS.length>=4){da={0:DRAWS[0].gross||100000,3:DRAWS[1].gross||117261,6:DRAWS[2].gross||75000,9:DRAWS[3].gross||69000};}
  var bal=0;var cumInt=0;
  for(var mo=0;mo<12;mo++){bal+=(da[mo]||0);var mInt=bal*(r1/12);bal+=mInt;cumInt+=mInt;}
  var np=Math.max(0,bal-ci-reb);
  document.getElementById("mort-out").innerHTML=[
    {l:"Balance at month 13",v:fmt(Math.round(bal)),cls:"orange"},
    {l:"Capitalized interest",v:fmt(Math.round(cumInt)),cls:"red"},
    {l:"Net take-out principal",v:fmt(Math.round(np)),cls:"green"}
  ].map(function(m){return '<div class="mc"><div class="lbl">'+m.l+'</div><div class="val '+m.cls+'">'+m.v+'</div></div>';}).join("");
  document.getElementById("mort-scenarios").innerHTML=[10,15,20,25,30].map(function(yr){
    var n=yr*12;var rMo=r3/12;
    var pmt=np>0?np*rMo*Math.pow(1+rMo,n)/(Math.pow(1+rMo,n)-1):0;
    return '<div class="mc"><div class="lbl">'+yr+' yr</div><div class="val">'+fmt(Math.round(pmt))+'<span style="font-size:10px;color:#666">/mo</span></div></div>';
  }).join("");
  var pen=np*(r2/12)*3;
  document.getElementById("mort-break").innerHTML=[
    {l:"Break penalty",v:fmt(Math.round(pen)),cls:"red"},
    {l:"Closing costs",v:fmt(2700),cls:""},
    {l:"Total to convert",v:fmt(Math.round(pen+2700)),cls:"orange"},
    {l:"Net principal",v:fmt(Math.round(np)),cls:"green"}
  ].map(function(m){return '<div class="mc"><div class="lbl">'+m.l+'</div><div class="val '+m.cls+'">'+m.v+'</div></div>';}).join("");
}

// FIELD COMMAND
function renderField(){
  document.getElementById("field-metrics").innerHTML=[
    {l:"Active Jobs",v:"1",cls:"green"},{l:"Scan Events",v:"2",cls:""},
    {l:"Hours Logged",v:"8.3",cls:"orange"},{l:"Cost Tracked",v:fmt(1240),cls:""}
  ].map(function(m){return '<div class="mc"><div class="lbl">'+m.l+'</div><div class="val '+m.cls+'">'+m.v+'</div></div>';}).join("");
  document.getElementById("field-content").innerHTML=
    '<div style="background:#1E1E1E;padding:10px 14px;border-radius:4px;margin-bottom:8px"><div style="font-size:9px;color:#666">NAC-LS-001</div><div style="font-size:12px">4330 Billy Bill Rd \\u2014 Hydro-One ROW Clearing</div></div>'+
    '<table><thead><tr><th>Time</th><th>Type</th><th>Crew</th><th>Hrs</th><th>Cost</th></tr></thead><tbody>'+
    '<tr><td>2026-04-02 07:58</td><td style="color:#00FF41">Arrival</td><td>Owner</td><td>\\u2014</td><td>\\u2014</td></tr>'+
    '<tr><td>2026-04-02 16:15</td><td>Departure</td><td>Owner</td><td>8.3</td><td>'+fmt(1240)+'</td></tr></tbody></table>';
}
function drawDoughnut(id,segs,txt){var c=document.getElementById(id);if(!c)return;var ctx=c.getContext("2d");var w=c.width;var h=c.height;var cx=w/2;var cy=h/2;var r=Math.min(cx,cy)-4;var inner=r*0.65;ctx.clearRect(0,0,w,h);var total=segs.reduce(function(s,x){return s+x.v;},0);if(total<=0)return;var a=-Math.PI/2;segs.forEach(function(seg){var sl=seg.v/total*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,a,a+sl);ctx.closePath();ctx.fillStyle=seg.c;ctx.fill();a+=sl;});ctx.beginPath();ctx.arc(cx,cy,inner,0,Math.PI*2);ctx.fillStyle="#060606";ctx.fill();if(txt){ctx.fillStyle="#F2F2F2";ctx.font="bold 18px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(txt,cx,cy);}}
function drawLine(id,datasets,labels,legend){var c=document.getElementById(id);if(!c)return;c.width=c.parentElement.clientWidth||600;var ctx=c.getContext("2d");var w=c.width;var h=c.height;var pl=60,pr=12,pt=22,pb=28,pw2=w-pl-pr,ph=h-pt-pb;ctx.clearRect(0,0,w,h);if(!datasets||!datasets.length||!labels||!labels.length)return;var all=[];datasets.forEach(function(ds){ds.d.forEach(function(v){all.push(v);});});var yMin=Math.min.apply(null,all);var yMax=Math.max.apply(null,all);if(yMin===yMax){yMin=0;yMax=yMax*1.1||100;}var yr=yMax-yMin;yMin-=yr*0.05;yMax+=yr*0.05;yr=yMax-yMin;function tx(i){return pl+i/(labels.length-1)*pw2;}function ty(v){return pt+ph-(v-yMin)/yr*ph;}ctx.strokeStyle="rgba(255,255,255,0.06)";ctx.lineWidth=1;for(var g=0;g<=4;g++){var gy=pt+ph*g/4;ctx.beginPath();ctx.moveTo(pl,gy);ctx.lineTo(w-pr,gy);ctx.stroke();ctx.fillStyle="#666";ctx.font="9px system-ui";ctx.textAlign="right";ctx.textBaseline="middle";ctx.fillText(fmtK(Math.round(yMax-(yMax-yMin)*g/4)),pl-6,gy);}ctx.fillStyle="#666";ctx.font="9px system-ui";ctx.textAlign="center";ctx.textBaseline="top";var step=Math.ceil(labels.length/8);labels.forEach(function(lbl,i){if(i%step===0)ctx.fillText(lbl,tx(i),h-pb+6);});datasets.forEach(function(ds){ctx.strokeStyle=ds.c||"#00FF41";ctx.lineWidth=ds.w||2;if(ds.da){ctx.setLineDash(ds.da);}else{ctx.setLineDash([]);}ctx.beginPath();ds.d.forEach(function(v,i){var x=tx(i);var y=ty(v);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();ctx.setLineDash([]);if(ds.f){ctx.globalAlpha=0.08;ctx.fillStyle=ds.c||"#00FF41";ctx.lineTo(tx(ds.d.length-1),pt+ph);ctx.lineTo(tx(0),pt+ph);ctx.closePath();ctx.fill();ctx.globalAlpha=1;}ds.d.forEach(function(v,i){ctx.beginPath();ctx.arc(tx(i),ty(v),3,0,Math.PI*2);ctx.fillStyle=ds.c||"#00FF41";ctx.fill();});});if(legend){var lx=pl,ly=4;legend.forEach(function(lg){ctx.fillStyle=lg.c;ctx.fillRect(lx,ly,12,3);lx+=16;ctx.font="10px system-ui";ctx.textAlign="left";ctx.textBaseline="top";ctx.fillText(lg.l,lx,ly-1);lx+=ctx.measureText(lg.l).width+16;});}}
function renderCharts(){if(!CATS||!CATS.length)return;var totAct=0;CATS.forEach(function(ca){ca.items.forEach(function(i){totAct+=(i.act||0);});});var rem=Math.max(0,600000-totAct-30000);drawDoughnut("budgetRing",[{v:totAct,c:"#00FF41"},{v:30000,c:"#F97316"},{v:rem,c:"#2D2D2D"}],Math.round(totAct/600000*100)+"%");if(!DRAWS||!DRAWS.length)return;var rl=[],rd=[],rc=[],bal=0;DRAWS.forEach(function(d){bal+=(d.gross||0);rl.push((d.label||d.id)+" in");rd.push(Math.round(bal));rc.push(600000);bal-=(d.lender_fee||0)+(d.legal_fee||0);rl.push((d.label||d.id)+" net");rd.push(Math.round(bal));rc.push(600000);});drawLine("balanceChart",[{d:rd,c:"#00FF41",f:true},{d:rc,c:"#F97316",da:[4,3],w:1}],rl,[{l:"Balance",c:"#00FF41"},{l:"$600k ceiling",c:"#F97316"}]);var gbi={};DRAWS.forEach(function(d){gbi[(d.id||"").toLowerCase()]=(d.gross||0);});var sch=[{m:"Jul-25",a:gbi.d1||0},{m:"Aug-25",a:0},{m:"Sep-25",a:0},{m:"Oct-25",a:gbi.d2||0},{m:"Nov-25",a:0},{m:"Dec-25",a:0},{m:"Jan-26",a:gbi.d3||0},{m:"Feb-26",a:0},{m:"Mar-26",a:0},{m:"Apr-26",a:gbi.d4||0},{m:"May-26",a:0},{m:"Jun-26",a:0}];var ib=0,ic=0,il=[],ibd=[],icd=[];sch.forEach(function(row){ib+=row.a;var mi=ib*(0.115/12);ib+=mi;ic+=mi;il.push(row.m);ibd.push(Math.round(ib));icd.push(Math.round(ic));});drawLine("interestChart",[{d:ibd,c:"#00FF41",f:true},{d:icd,c:"#F97316",da:[4,3]}],il,[{l:"Balance",c:"#00FF41"},{l:"Cum. interest",c:"#F97316"}]);var drf={};CATS.forEach(function(cat){cat.items.forEach(function(it){var ref=(it.dr||"").toString().toUpperCase().trim();if(ref==="D1"||ref==="D2"||ref==="D3"||ref==="D4"){drf[ref.toLowerCase()]=(drf[ref.toLowerCase()]||0)+(it.act||0);}else if(ref==="D2/3"){drf.d2=(drf.d2||0)+(it.act||0)/2;drf.d3=(drf.d3||0)+(it.act||0)/2;}});});var cl=[],cg=[],cs=[],gr=0,sr=0;DRAWS.forEach(function(d){cl.push(d.label||d.id);gr+=(d.gross||0);sr+=(drf[(d.id||"").toLowerCase()]||0);cg.push(Math.round(gr));cs.push(Math.round(sr));});drawLine("cashflowChart",[{d:cg,c:"#00FF41",f:true},{d:cs,c:"#F97316",da:[4,3]}],cl,[{l:"Cum. gross",c:"#00FF41"},{l:"Cum. spent",c:"#F97316"}]);}
window.addEventListener("resize",function(){renderCharts();});
<\/script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store", "cf-edge-cache": "no-store" } });
}
__name(handleCommandCentre, "handleCommandCentre");
__name2(handleCommandCentre, "handleCommandCentre");
function handleNacPropertyDemoGate() {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NAC Property Demo \u2014 Property Management for Site Operators</title><meta name="description" content="Manage properties, not paperwork. Work orders, tenant management, QR job tracking, AI-powered maintenance \u2014 built for property managers who work on site."><style>:root{--g0:#060606;--g1:#0C0C0C;--g2:#151515;--g3:#1E1E1E;--g4:#2D2D2D;--g5:#3C3C3C;--g6:#666666;--g7:#909090;--g8:#D8D8D8;--g9:#F2F2F2;--green:#00FF41;--green-dim:rgba(0,255,65,.12);--green-subtle:rgba(0,255,65,.04);--green-glow:rgba(0,255,65,.25);--orange:#F97316;--red:#EF4444;--blue:#3B82F6;--border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.10);--border3:rgba(255,255,255,.16)}*{box-sizing:border-box;margin:0;padding:0}html,body{background:var(--g0);color:var(--g9);font-family:'DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100vh}a{color:inherit;text-decoration:none}::selection{background:var(--green);color:#000}.wrap{min-height:100vh;display:flex;flex-direction:column}.topbar{position:sticky;top:0;z-index:100;background:rgba(6,6,6,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:14px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:12px}.brand-mark{width:28px;height:28px;border:1px solid var(--green);background:var(--green-dim);border-radius:3px;display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-weight:700;font-size:13px;color:var(--green);letter-spacing:.5px}.brand-txt{display:flex;flex-direction:column;line-height:1}.brand-name{font-family:'Oswald',sans-serif;font-size:17px;font-weight:700;letter-spacing:1.8px;color:var(--g9)}.brand-sub{font-family:'DM Mono',monospace;font-size:8px;color:var(--g6);letter-spacing:.22em;text-transform:uppercase;margin-top:3px}.tb-right{display:flex;align-items:center;gap:14px;font-family:'DM Mono',monospace;font-size:10px;color:var(--g7);letter-spacing:.1em}.tb-right a{color:var(--g7);transition:color .15s}.tb-right a:hover{color:var(--green)}.hero{position:relative;padding:60px 32px 40px;overflow:hidden;flex:1;display:flex;align-items:center;min-height:calc(100vh - 61px)}.hero-bg{position:absolute;inset:0;z-index:0;opacity:.45}.hero-bg canvas{display:block;width:100%;height:100%}.hero-grad{position:absolute;inset:0;background:radial-gradient(ellipse at 25% 50%,rgba(0,255,65,.07) 0%,transparent 55%);pointer-events:none;z-index:1}.hero-inner{position:relative;z-index:2;max-width:1180px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.15fr 1fr;gap:50px;align-items:start}.hero-left{min-width:0}.tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:var(--green-subtle);border:1px solid rgba(0,255,65,.18);border-radius:3px;font-family:'DM Mono',monospace;font-size:9px;color:var(--green);letter-spacing:.22em;text-transform:uppercase;margin-bottom:24px}.tag::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2.5s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.92)}}h1.title{font-family:'Oswald',sans-serif;font-size:clamp(40px,5.6vw,68px);font-weight:700;line-height:1;letter-spacing:-.005em;margin-bottom:18px;color:var(--g9)}h1.title .accent{color:var(--green);text-shadow:0 0 36px rgba(0,255,65,.3)}.subtitle{font-size:16px;color:var(--g7);max-width:520px;line-height:1.6;margin-bottom:30px}.feats{display:grid;grid-template-columns:1fr 1fr;gap:14px 26px;margin-bottom:8px;max-width:540px}.feat{display:flex;gap:12px;align-items:flex-start}.feat-dot{width:18px;height:18px;border:1px solid var(--green);border-radius:3px;display:flex;align-items:center;justify-content:center;color:var(--green);font-size:11px;flex-shrink:0;margin-top:2px;background:var(--green-subtle)}.feat-txt{flex:1;min-width:0}.feat-title{font-size:12px;font-weight:500;color:var(--g8);margin-bottom:2px}.feat-desc{font-size:11px;color:var(--g6);line-height:1.5}.hero-right{min-width:0}.form-card{background:linear-gradient(180deg,rgba(21,21,21,.95) 0%,rgba(12,12,12,.95) 100%);border:1px solid var(--border2);border-radius:5px;padding:32px 30px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);position:relative;overflow:hidden}.form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 0%,var(--green) 50%,transparent 100%)}.form-tag{font-family:'DM Mono',monospace;font-size:9px;color:var(--green);letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px}.form-title{font-family:'Oswald',sans-serif;font-size:24px;font-weight:600;color:var(--g9);line-height:1.1;margin-bottom:6px;letter-spacing:.3px}.form-sub{font-size:12px;color:var(--g6);margin-bottom:22px;line-height:1.55}.field{margin-bottom:14px}.field label{display:block;font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.18em;text-transform:uppercase;margin-bottom:5px}.field label .req{color:var(--green);margin-left:3px}.field input{width:100%;padding:11px 14px;background:var(--g2);border:1px solid var(--border2);border-radius:3px;color:var(--g9);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .15s}.field input:focus{border-color:var(--green)}.field input::placeholder{color:var(--g5)}.honey{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}.form-err{font-family:'DM Mono',monospace;font-size:10px;color:var(--red);margin:4px 0 10px;display:none;letter-spacing:.06em}.form-err.on{display:block}.form-submit{width:100%;padding:14px;background:var(--green);color:#000;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;border:none;border-radius:3px;cursor:pointer;transition:all .2s;margin-top:6px}.form-submit:hover:not(:disabled){background:#00cc33;transform:translateY(-1px);box-shadow:0 6px 22px rgba(0,255,65,.3)}.form-submit:disabled{background:var(--g4);color:var(--g6);cursor:not-allowed}.form-fine{margin-top:14px;font-size:10px;color:var(--g6);text-align:center;line-height:1.5}.granted{display:none;text-align:center;padding:8px 0}.granted.on{display:block}.granted-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--green);margin-bottom:10px}.granted-msg{font-family:'Oswald',sans-serif;font-size:24px;color:var(--g9);margin-bottom:6px;letter-spacing:.4px}.granted-sub{font-size:12px;color:var(--g6);margin-bottom:22px;line-height:1.55}.code-reveal{background:#000;border:1px dashed rgba(0,255,65,.4);border-radius:4px;padding:18px;margin-bottom:16px}.code-lbl{font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px}.code-val{font-family:'DM Mono',monospace;font-size:18px;color:var(--green);font-weight:600;letter-spacing:.05em;user-select:all;word-break:break-all}.code-actions{display:flex;gap:10px;margin-top:12px}.copy-btn{flex:1;padding:9px;background:var(--g3);color:var(--g8);font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--border2);border-radius:3px;cursor:pointer;transition:all .15s}.copy-btn:hover{background:var(--g4);border-color:var(--g6)}.copy-btn.ok{background:var(--green);color:#000;border-color:var(--green)}.launch-link{flex:1;padding:9px;background:var(--green);color:#000;font-family:'Oswald',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:3px;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;text-align:center}.granted-meta{font-size:11px;color:var(--g6);line-height:1.6}.granted-meta strong{color:var(--g8)}.section{padding:60px 32px;border-top:1px solid var(--border);background:linear-gradient(180deg,var(--g0) 0%,var(--g1) 100%)}.section-inner{max-width:1180px;margin:0 auto}.sec-head{margin-bottom:30px}.sec-label{font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.25em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:10px}.sec-label::before{content:'';width:16px;height:1px;background:var(--green)}.sec-title{font-family:'Oswald',sans-serif;font-size:30px;font-weight:600;color:var(--g9);letter-spacing:.5px;line-height:1.05;max-width:680px}.sec-title .accent{color:var(--green)}.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px}.feat-card{background:var(--g1);border:1px solid var(--border);border-radius:4px;padding:22px 22px 24px;position:relative;transition:all .2s}.feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--g4)}.feat-card:hover{border-color:rgba(0,255,65,.22);background:var(--g2)}.feat-card:hover::before{background:var(--green)}.feat-num{font-family:'DM Mono',monospace;font-size:9px;color:var(--g5);letter-spacing:.12em;margin-bottom:12px}.feat-name{font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:var(--g9);margin-bottom:8px;letter-spacing:.3px}.feat-desc-2{font-size:12px;color:var(--g7);line-height:1.6}footer.foot{padding:24px 32px;border-top:1px solid var(--border);background:var(--g0);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-family:'DM Mono',monospace;font-size:9px;color:var(--g6);letter-spacing:.12em;text-transform:uppercase}.foot-left{display:flex;align-items:center;gap:22px}.foot-dot{width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);display:inline-block;margin-right:6px}.foot-right{display:flex;gap:22px}.foot-right a{color:var(--g6);transition:color .15s}.foot-right a:hover{color:var(--green)}@media (max-width:900px){.hero{padding:40px 20px}.hero-inner{grid-template-columns:1fr;gap:36px}.hero-right{order:-1;max-width:480px;margin:0 auto;width:100%}.section{padding:50px 20px}.feats{grid-template-columns:1fr;max-width:100%}.feat-grid{grid-template-columns:1fr 1fr}.topbar{padding:12px 20px}.foot{padding:20px;font-size:8px}.foot-left,.foot-right{gap:14px}}@media (max-width:560px){.feat-grid{grid-template-columns:1fr}h1.title{font-size:42px}}</style></head><body><div class="wrap"><header class="topbar"><div class="brand"><div class="brand-mark">N</div><div class="brand-txt"><div class="brand-name">NAC PROPERTY DEMO</div><div class="brand-sub">Powered by NAC OS</div></div></div><div class="tb-right"><a href="/">\u2190 NAC OS Home</a></div></header><section class="hero"><div class="hero-bg"><canvas id="gridCanvas"></canvas></div><div class="hero-grad"></div><div class="hero-inner"><div class="hero-left"><div class="tag">NAC \xB7 Property Management Suite</div><h1 class="title">Manage properties.<br><span class="accent">Not paperwork.</span></h1><p class="subtitle">Work orders, tenant management, compliance tracking, QR job scanning, and AI-powered maintenance \u2014 built for property managers who work on site.</p><div class="feats"><div class="feat"><div class="feat-dot">\u2713</div><div class="feat-txt"><div class="feat-title">Property Registry</div><div class="feat-desc">Buildings, units, appliances, photos, docs.</div></div></div><div class="feat"><div class="feat-dot">\u2713</div><div class="feat-txt"><div class="feat-title">Work Orders</div><div class="feat-desc">Create, assign, track with audit trail.</div></div></div><div class="feat"><div class="feat-dot">\u2713</div><div class="feat-txt"><div class="feat-title">QR Job Tracking</div><div class="feat-desc">Crew scans on arrival/departure.</div></div></div><div class="feat"><div class="feat-dot">\u2713</div><div class="feat-txt"><div class="feat-title">Tenant Portal</div><div class="feat-desc">Leases, charges, requests in one place.</div></div></div><div class="feat"><div class="feat-dot">\u2713</div><div class="feat-txt"><div class="feat-title">Compliance</div><div class="feat-desc">Fire, HVAC, certs \u2014 never miss a date.</div></div></div><div class="feat"><div class="feat-dot">\u2713</div><div class="feat-txt"><div class="feat-title">AI-Powered</div><div class="feat-desc">Voice notes, call logs, summaries.</div></div></div></div></div><div class="hero-right"><div class="form-card"><div id="form-state"><div class="form-tag">Demo Access</div><div class="form-title">Get instant access</div><div class="form-sub">Drop your email and we'll generate a unique demo code instantly. The code is also sent to your inbox so you don't lose it.</div><form id="demo-form" autocomplete="off" novalidate><div class="field"><label>Name <span class="req"></span></label><input type="text" id="d-name" placeholder="Your name (optional)" autocomplete="name"></div><div class="field"><label>Email <span class="req">*</span></label><input type="email" id="d-email" placeholder="you@company.com" required autocomplete="email"></div><div class="field"><label>Company</label><input type="text" id="d-company" placeholder="Your company (optional)" autocomplete="organization"></div><input class="honey" type="text" id="d-website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="form-err" id="d-err"></div><button type="submit" class="form-submit" id="d-submit">Get Instant Demo Access \u2192</button></form><div class="form-fine">By requesting access you agree to receive a demo access email. Codes are valid for 14 days. Privacy respected \u2014 no spam.</div></div><div class="granted" id="granted-state"><div class="granted-tag">\u2713 Access Granted</div><div class="granted-msg">You're in.</div><div class="granted-sub">Your demo code is below. We've also emailed it to <strong id="granted-email" style="color:var(--g8)">\u2014</strong>.</div><div class="code-reveal"><div class="code-lbl">Your Demo Code</div><div class="code-val" id="granted-code">DEMO-XXXX-XXXX-XXXX</div><div class="code-actions"><button class="copy-btn" id="copy-btn" onclick="copyCode()">Copy Code</button><a class="launch-link" id="launch-link" href="#">Launch Demo \u2192</a></div></div><div class="granted-meta">Valid until <strong id="granted-expires">\u2014</strong>. Bookmark this page or check your email \u2014 your code is also there.<br><br>Need a fresh code? <a href="#" onclick="resetForm();return false;" style="color:var(--green);text-decoration:none">Request again \u2192</a></div></div></div></div></div></section><section class="section"><div class="section-inner"><div class="sec-head"><div class="sec-label">What's inside</div><div class="sec-title">Six tools. <span class="accent">One workflow.</span></div></div><div class="feat-grid"><div class="feat-card"><div class="feat-num">01 / REG</div><div class="feat-name">Property Registry</div><div class="feat-desc-2">Buildings, units, appliances, photos, documents \u2014 every asset in one searchable database. Track warranties, service history, and replacement dates.</div></div><div class="feat-card"><div class="feat-num">02 / WO</div><div class="feat-name">Work Orders</div><div class="feat-desc-2">Create, assign, and track maintenance with full audit trail. Photos, time stamps, signatures, and crew accountability on every job.</div></div><div class="feat-card"><div class="feat-num">03 / QR</div><div class="feat-name">QR Job Tracking</div><div class="feat-desc-2">Crew scans on arrival and departure. Every job logged, costed, and time-stamped. No paperwork, no spreadsheets, no excuses.</div></div><div class="feat-card"><div class="feat-num">04 / TEN</div><div class="feat-name">Tenant Portal</div><div class="feat-desc-2">Leases, charges, inspection records, and tenant requests \u2014 all in one branded portal. Reduce phone calls, document everything.</div></div><div class="feat-card"><div class="feat-num">05 / CMP</div><div class="feat-name">Compliance</div><div class="feat-desc-2">Fire inspection, HVAC service, electrical certs, elevator records \u2014 never miss a deadline. Auto-reminders, document storage, audit-ready.</div></div><div class="feat-card"><div class="feat-num">06 / AI</div><div class="feat-name">AI-Powered</div><div class="feat-desc-2">Voice notes auto-transcribed. Call logs summarized. Maintenance reports drafted from photos. Admin time cut in half.</div></div></div></div></section><footer class="foot"><div class="foot-left"><span><span class="foot-dot"></span>NAC Property Demo \xB7 Powered by NAC OS</span><span>Natural Alternatives \xB7 Cornwall ON</span></div><div class="foot-right"><a href="/">NAC OS Home</a><a href="https://www.naturalalternatives.ca" target="_blank">naturalalternatives.ca</a></div></footer></div><script>(function(){const c=document.getElementById('gridCanvas');if(!c)return;const ctx=c.getContext('2d');let w,h,t=0;function size(){const r=c.parentElement.getBoundingClientRect();w=c.width=r.width*devicePixelRatio;h=c.height=r.height*devicePixelRatio;c.style.width=r.width+'px';c.style.height=r.height+'px';}size();window.addEventListener('resize',size);const G=48*devicePixelRatio;function draw(){ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle='rgba(0,255,65,0.05)';ctx.beginPath();for(let x=0;x<w;x+=G){ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let y=0;y<h;y+=G){ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();const sy=((t*0.5)%(h+200))-100;const grad=ctx.createLinearGradient(0,sy-80,0,sy+80);grad.addColorStop(0,'rgba(0,255,65,0)');grad.addColorStop(0.5,'rgba(0,255,65,0.10)');grad.addColorStop(1,'rgba(0,255,65,0)');ctx.fillStyle=grad;ctx.fillRect(0,sy-80,w,160);t+=1;requestAnimationFrame(draw);}draw();})();const form=document.getElementById('demo-form');const errEl=document.getElementById('d-err');const submitBtn=document.getElementById('d-submit');function showErr(m){errEl.textContent=m;errEl.classList.add('on');}function clearErr(){errEl.textContent='';errEl.classList.remove('on');}form.addEventListener('submit',function(e){e.preventDefault();clearErr();const email=document.getElementById('d-email').value.trim().toLowerCase();const name=document.getElementById('d-name').value.trim();const company=document.getElementById('d-company').value.trim();const honey=document.getElementById('d-website').value.trim();if(!email||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){showErr('Please enter a valid email');return;}submitBtn.disabled=true;submitBtn.textContent='Generating code\u2026';fetch('/api/demo/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,company,website:honey})}).then(r=>r.json().then(d=>({ok:r.ok,d}))).then(({ok,d})=>{if(!ok||!d.success){showErr(d.error||'Request failed');submitBtn.disabled=false;submitBtn.textContent='Get Instant Demo Access \u2192';return;}document.getElementById('granted-email').textContent=d.email;document.getElementById('granted-code').textContent=d.code;document.getElementById('granted-expires').textContent=(d.expires_at||'\u2014').replace('T',' ').slice(0,10);document.getElementById('launch-link').href='/nac/property/demo#code='+encodeURIComponent(d.code);document.getElementById('form-state').style.display='none';document.getElementById('granted-state').classList.add('on');try{localStorage.setItem('nac_demo_email',d.email);localStorage.setItem('nac_demo_key',d.code);}catch(_){}}).catch(e=>{showErr('Connection error \u2014 try again');submitBtn.disabled=false;submitBtn.textContent='Get Instant Demo Access \u2192';});});function copyCode(){const code=document.getElementById('granted-code').textContent.trim();const btn=document.getElementById('copy-btn');function done(){btn.textContent='Copied \u2713';btn.classList.add('ok');setTimeout(()=>{btn.textContent='Copy Code';btn.classList.remove('ok');},1800);}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(code).then(done).catch(()=>{const ta=document.createElement('textarea');ta.value=code;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done();}catch(_){}document.body.removeChild(ta);});}else{const ta=document.createElement('textarea');ta.value=code;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done();}catch(_){}document.body.removeChild(ta);}}window.copyCode=copyCode;function resetForm(){document.getElementById('granted-state').classList.remove('on');document.getElementById('form-state').style.display='block';submitBtn.disabled=false;submitBtn.textContent='Get Instant Demo Access \u2192';clearErr();}window.resetForm=resetForm;<\/script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store", "cf-edge-cache": "no-store" } });
}
__name(handleNacPropertyDemoGate, "handleNacPropertyDemoGate");
__name2(handleNacPropertyDemoGate, "handleNacPropertyDemoGate");
async function handleDemoValidate(request, env) {
  try {
    if (!env.DEMO_CODES)
      return Response.json({ valid: false, reason: "kv-not-bound" });
    const { code } = await request.json();
    if (!code || typeof code !== "string")
      return Response.json({ valid: false });
    const val = await env.DEMO_CODES.get(code.toUpperCase().trim());
    return Response.json({ valid: val !== null });
  } catch {
    return Response.json({ valid: false });
  }
}
__name(handleDemoValidate, "handleDemoValidate");
__name2(handleDemoValidate, "handleDemoValidate");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, request) });
    }
    try {
      let response;
      if (path === "/api/license/validate" && request.method === "POST")
        response = await handleLicenseValidation(request, env);
      else if (path === "/api/stripe/webhook" && request.method === "POST")
        response = await handleStripeWebhook(request, env);
      else if (path === "/dashboard" || path === "/dashboard/")
        response = handleDashboard();
      else if (path === "/learning" || path === "/learning/")
        response = handleLearningDashboard();
      else if (path === "/api/dashboard/stats")
        response = await handleDashboardStats(request, env);
      else if (path === "/admin" || path === "/admin/")
        response = handleAdminPanel();
      else if (path === "/api/leads/submit")
        response = await handleLeadSubmit(request, env);
      else if (path === "/unsubscribe")
        response = await handleUnsubscribe(request, env);
      else if (path === "/api/support" && request.method === "POST")
        response = await handleSupport(request, env);
      else if (path === "/api/support/widget.js")
        response = handleSupportWidget(request, env);
      else if (path === "/api/download/playbook")
        response = await handlePlaybookDownload(request, env);
      else if (path === "/api/admin/leads")
        response = await handleLeadsAdmin(request, env);
      else if (path.startsWith("/api/admin/"))
        response = await handleAdminRoutes(request, env, path);
      else if (path === "/api/health")
        response = Response.json({ status: "ok", version: "3.0.0", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
      else if (path === "/api/info")
        response = Response.json({ service: "NAC OS Fleet Logbook\u2122", version: "3.0.0", stack: "Cloudflare Workers + D1 + Resend" });
      else if (path === "/api/command-centre/draws")
        response = await handleCmdDraws(request, env);
      else if (path === "/api/command-centre/budget")
        response = await handleCmdBudget(request, env);
      else if (path === "/api/command-centre/settings")
        response = await handleCmdSettings(request, env);
      else if (path === "/api/command-centre/lock" && request.method === "POST")
        response = await handleCmdLock(request, env);
      else if (path === "/api/command-centre/sync" && request.method === "POST")
        response = await handleCmdSync(request, env);
      else if (path === "/api/field/jobs")
        response = await handleFieldJobs(request, env);
      else if (path === "/api/field/scans")
        response = await handleFieldScans(request, env);
      else if (path === "/")
        response = handleHomePage();
      else if (path === "/test-login")
        response = new Response('<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>Login Test</title>\n<style>body{background:#111;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}\n.box{background:#222;padding:40px;border-radius:8px;width:340px;text-align:center}\ninput{width:100%;padding:10px;margin:10px 0;background:#333;border:1px solid #555;color:#eee;font-size:14px;border-radius:4px}\nbutton{width:100%;padding:12px;background:#00FF41;color:#000;font-size:14px;font-weight:bold;border:none;border-radius:4px;cursor:pointer}\n#msg{margin-top:10px;font-size:13px;min-height:20px}\n.ok{color:#00FF41}.err{color:#EF4444}.info{color:#F97316}\n</style></head><body>\n<div class="box">\n<h2>NAC OS - Login Test</h2>\n<p style="color:#666;font-size:12px">Minimal test page. No Chart.js, no D1, no CSS framework.</p>\n<input type="password" id="pw" placeholder="Type password here" autofocus>\n<button onclick="go()">TEST LOGIN</button>\n<div id="msg"></div>\n</div>\n<script>\nvar msg=document.getElementById("msg");\ndocument.getElementById("pw").addEventListener("keydown",function(e){if(e.key==="Enter")go();});\n\nasync function go(){\n  var p=document.getElementById("pw").value;\n  msg.className="info";msg.textContent="Sending...";\n  if(!p){msg.className="err";msg.textContent="Type a password first";return;}\n  try{\n    var r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p})});\n    var d=await r.json();\n    if(r.ok&&d.success){\n      msg.className="ok";msg.textContent="SUCCESS - status "+r.status+" - password works!";\n      // Now test if we can reach the D1 endpoints\n      var r2=await fetch("/api/command-centre/draws");\n      var d2=await r2.json();\n      msg.textContent+=" | D1 draws: "+(d2.draws?d2.draws.length:"error");\n    }else{\n      msg.className="err";msg.textContent="REJECTED - status "+r.status+" - "+JSON.stringify(d);\n    }\n  }catch(e){\n    msg.className="err";msg.textContent="FETCH ERROR: "+e.message;\n  }\n}\n<\/script></body></html>', { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      else if (path === "/nac-os/command-centre" || path === "/nac-os/command-centre/")
        response = handleCommandCentre();
      else if (path === "/nac-os/billfold" || path === "/nac-os/billfold/")
        response = new Response(null, { status: 302, headers: { Location: "/dashboard" } });
      else if (path === "/nac/property/demo" || path === "/nac/property/demo/")
        response = handleNacPropertyDemoGate();
      else if (path === "/nac/property/preview" || path === "/nac/property/preview/")
        response = handleNacPropertyPreview();
      else if (path === "/api/demo/validate" && request.method === "POST")
        response = await handleDemoValidate(request, env);
      else if (path === "/api/demo/request" && request.method === "POST")
        response = await handleDemoRequest(request, env);
      else if (path === "/api/admin/demo-leads" && request.method === "GET")
        response = await handleAdminDemoLeads(request, env);
      else if (path.match(/^\/api\/admin\/demo-leads\/\d+\/revoke\/?$/) && request.method === "POST")
        response = await handleAdminDemoRevoke(request, env, path);
      else
        response = Response.json({ error: "Not found", path }, { status: 404 });
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(corsHeaders(env, request)))
        headers.set(k, v);
      const ct = response.headers.get("Content-Type") || "";
      if (ct.includes("text/html")) {
        headers.set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; object-src 'none';");
      }
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    } catch (error) {
      console.error("Worker error:", error);
      return Response.json({ error: "Internal server error", message: error.message }, { status: 500, headers: corsHeaders(env, request) });
    }
  },
  // ── Cron — daily 8:00 AM ET (13:00 UTC) ────────────────────────────────────
  // wrangler.toml: [triggers] crons = ["0 13 * * *"]
  async scheduled(event, env, ctx) {
    console.log("\u23F0 Cron fired:", event.cron);
    ctx.waitUntil(handleNurtureCron(env));
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map

--add78fe8eb355024ba9f101653a7673fc8398ce473093155e86e471217b4--
