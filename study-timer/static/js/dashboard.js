const WD=['일','월','화','수','목','금','토'];
let DATA=null, CX={}, curSubj='all', curPeriod=7, curStackPeriod=7;
let studentId = localStorage.getItem('student_id') || '';

async function loadDashStudents() {
    const res = await fetch('/api/students');
    const list = await res.json();
    const sel = document.getElementById('studentSelect');
    if (sel) {
        sel.innerHTML = '<option value="">-- 선택 --</option>' +
            list.map(s => `<option value="${s.id}" ${s.id===studentId?'selected':''}>${s.name}</option>`).join('');
        document.getElementById('stuCount').textContent = `(${list.length}명)`;
    }
}
function switchDashStudent() {
    studentId = document.getElementById('studentSelect').value;
    if (studentId) localStorage.setItem('student_id', studentId);
    else localStorage.removeItem('student_id');
    init();
}

function fmt(s){const m=Math.round(s/60);return m>=60?`${Math.floor(m/60)}시간 ${m%60}분`:`${m}분`}
function fmtM(m){return m>=60?`${Math.floor(m/60)}h ${m%60>0?m%60+'m':''}`:`${m}m`}
function pct(a,b){return b>0?Math.round(a/b*100):0}
function dl(ds){const d=new Date(ds+'T00:00:00');return `${d.getMonth()+1}/${d.getDate()}`}
function kill(k){if(CX[k]){CX[k].destroy();CX[k]=null}}

function getClassAvg(dates,subjName){
    const ca=DATA.class_avg;
    if(!ca||!ca.daily) return dates.map(()=>0);
    if(subjName==='all') return dates.map(d=>ca.daily[d]?.avg_study_minutes||0);
    return dates.map(d=>ca.subject_daily?.[subjName]?.[d]?.avg_study_minutes||0);
}
function getClassTop(dates,subjName){
    const ca=DATA.class_avg;
    if(!ca||!ca.daily) return dates.map(()=>0);
    if(subjName==='all') return dates.map(d=>ca.daily[d]?.top_study_minutes||0);
    return dates.map(d=>ca.subject_daily?.[subjName]?.[d]?.top_study_minutes||0);
}

async function init(){
    await loadDashStudents();
    DATA=await(await fetch('/api/dashboard?days=90&student_id='+studentId)).json();
    buildTabs();
    render();
}

function buildTabs(){
    const el=document.getElementById('subjTabs');
    let html=`<button class="subj-tab all active" onclick="selSubj('all',this)">전체</button>`;
    DATA.subjects.forEach(s=>{
        html+=`<button class="subj-tab" style="--sc:${s.color}" onclick="selSubj('${s.name}',this)">${s.name}</button>`;
    });
    el.innerHTML=html;
}

function selSubj(name,btn){
    curSubj=name;
    document.querySelectorAll('.subj-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render();
}
function selPeriod(days,btn){
    curPeriod=days;
    document.querySelectorAll('.period-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function render(){
    const {overview:ov,subjects,daily}=DATA;
    const ca=DATA.class_avg||{};
    const sliced=daily.slice(-curPeriod);
    const dates=sliced.map(d=>d.date);
    const isAll=curSubj==='all';

    let myPeriodMin,avgPeriodMin;
    if(isAll) myPeriodMin=Math.round(sliced.reduce((a,d)=>a+d.total_study_seconds,0)/60);
    else myPeriodMin=Math.round(sliced.reduce((a,d)=>a+(d.by_subject[curSubj]?.study_seconds||0),0)/60);
    const classAvgArr=getClassAvg(dates,curSubj);
    avgPeriodMin=Math.round(classAvgArr.reduce((a,b)=>a+b,0));
    const diff=myPeriodMin-avgPeriodMin;
    const diffPct=avgPeriodMin>0?Math.round(diff/avgPeriodMin*100):0;

    const todayMin=Math.round(ov.today_study_seconds/60);
    const todayAvg=ca.daily?.[dates[dates.length-1]]?.avg_study_minutes||0;
    const todayDiff=todayMin-todayAvg;

    document.getElementById('ovRow').innerHTML=`
        <div class="ov"><div class="v" style="color:#22c55e">${fmt(ov.today_study_seconds)}</div><div class="l">오늘 순공</div><div class="sub" style="color:${todayDiff>=0?'#22c55e':'#ef4444'}">${todayDiff>=0?'+':''}${todayDiff}분 vs 반평균</div></div>
        <div class="ov"><div class="v" style="color:#f59e0b">${ov.today_focus_rate}%</div><div class="l">집중률</div></div>
        <div class="ov"><div class="v" style="color:#8b5cf6">${ov.subjects_done}/${ov.subjects_total}</div><div class="l">목표달성</div></div>
        <div class="ov"><div class="v" style="color:#e94560">${fmtM(myPeriodMin)}</div><div class="l">기간 합계</div><div class="sub" style="color:${diff>=0?'#22c55e':'#ef4444'}">${diff>=0?'+':''}${diff}분 (${diffPct>=0?'+':''}${diffPct}%)</div></div>
        <div class="ov"><div class="v" style="color:#3b82f6">${fmtM(avgPeriodMin)}</div><div class="l">반 평균 합계</div></div>`;

    document.getElementById('periodTabs').innerHTML=[
        {d:1,l:'1일'},{d:7,l:'1주'},{d:30,l:'1달'},{d:90,l:'3달'}
    ].map(p=>`<button class="period-tab${curPeriod===p.d?' active':''}" onclick="selPeriod(${p.d},this)">${p.l}</button>`).join('');

    renderCompareChart(sliced,dates);
    renderSubjBar(sliced,dates);
    renderRadar(subjects,sliced,dates);
    renderRanks(subjects,sliced,dates);
    renderStackedChart();
    renderGap(ov,subjects,daily);
    renderReport(ov,subjects,daily,dates,sliced);
}

function renderCompareChart(sliced,dates){
    kill('compare');
    const isAll=curSubj==='all';
    const myData=sliced.map(d=>isAll?Math.round(d.total_study_seconds/60):Math.round((d.by_subject[curSubj]?.study_seconds||0)/60));
    const avgData=getClassAvg(dates,curSubj);
    const labels=dates.map(dl);
    const useBar=curPeriod<=7;
    CX.compare=new Chart(document.getElementById('compareChart'),{
        type:useBar?'bar':'line',
        data:{labels,datasets:[
            {label:'나',data:myData,backgroundColor:'#e9456099',borderColor:'#e94560',borderWidth:useBar?0:2,borderRadius:useBar?4:0,fill:!useBar&&'origin',tension:.3,pointRadius:useBar?0:(curPeriod<=30?3:0),pointBackgroundColor:'#e94560',order:1},
            {label:'반 평균',data:avgData,backgroundColor:'#3b82f655',borderColor:'#3b82f6',borderWidth:useBar?0:2,borderRadius:useBar?4:0,fill:!useBar&&'origin',tension:.3,pointRadius:useBar?0:(curPeriod<=30?3:0),pointBackgroundColor:'#3b82f6',borderDash:useBar?[]:[5,5],order:2},
        ]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'분'}}},scales:{x:{ticks:{color:'#475569',maxRotation:0,autoSkip:true,maxTicksLimit:curPeriod<=7?7:10},grid:{display:false}},y:{beginAtZero:true,ticks:{color:'#475569',callback:v=>v+'분'},grid:{color:'rgba(255,255,255,.04)'}}}}
    });
}

function renderSubjBar(sliced,dates){
    kill('subjBar');
    const subjects=DATA.subjects;
    const myMins=subjects.map(s=>Math.round(sliced.reduce((a,d)=>a+(d.by_subject[s.name]?.study_seconds||0),0)/60));
    const avgMins=subjects.map(s=>Math.round(getClassAvg(dates,s.name).reduce((a,b)=>a+b,0)));
    CX.subjBar=new Chart(document.getElementById('subjBar'),{
        type:'bar',data:{labels:subjects.map(s=>s.name),datasets:[
            {label:'나',data:myMins,backgroundColor:subjects.map(s=>s.color+'cc'),borderRadius:4},
            {label:'반 평균',data:avgMins,backgroundColor:'#3b82f666',borderRadius:4},
        ]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:11}}},tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'분'}}},scales:{x:{beginAtZero:true,ticks:{color:'#475569',callback:v=>v+'분'},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'#cbd5e1'},grid:{display:false}}}}
    });
}

function renderRadar(subjects,sliced,dates){
    kill('radar');
    if(subjects.length<3) return;
    const myPct=subjects.map(s=>{const t=Math.round(sliced.reduce((a,d)=>a+(d.by_subject[s.name]?.study_seconds||0),0)/60);return Math.min(Math.round(t/(s.goal_minutes*curPeriod)*100),100)});
    const avgPct=subjects.map(s=>{const t=Math.round(getClassAvg(dates,s.name).reduce((a,b)=>a+b,0));return Math.min(Math.round(t/(s.goal_minutes*curPeriod)*100),100)});
    CX.radar=new Chart(document.getElementById('radarCompare'),{
        type:'radar',data:{labels:subjects.map(s=>s.name),datasets:[
            {label:'나',data:myPct,backgroundColor:'rgba(233,69,96,.15)',borderColor:'#e94560',pointBackgroundColor:'#e94560',borderWidth:2},
            {label:'반 평균',data:avgPct,backgroundColor:'rgba(59,130,246,.1)',borderColor:'#3b82f6',pointBackgroundColor:'#3b82f6',borderWidth:2,borderDash:[4,4]},
        ]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,.06)'},angleLines:{color:'rgba(255,255,255,.06)'},pointLabels:{color:'#cbd5e1',font:{size:11}},ticks:{display:false}}},plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:11}}}}}
    });
}

function renderRanks(subjects,sliced,dates){
    const ca=DATA.class_avg||{};
    const cs=ca.class_size||20;
    const el=document.getElementById('rankBars');
    const items=[{name:'전체',color:'#e94560'},...subjects.map(s=>({name:s.name,color:s.color}))];
    el.innerHTML=items.map(item=>{
        const isAll=item.name==='전체';
        let myMin,avgMin,topMin;
        if(isAll){myMin=Math.round(sliced.reduce((a,d)=>a+d.total_study_seconds,0)/60);avgMin=Math.round(dates.reduce((a,d)=>a+(ca.daily?.[d]?.avg_study_minutes||0),0));topMin=Math.round(dates.reduce((a,d)=>a+(ca.daily?.[d]?.top_study_minutes||0),0))}
        else{myMin=Math.round(sliced.reduce((a,d)=>a+(d.by_subject[item.name]?.study_seconds||0),0)/60);avgMin=Math.round(getClassAvg(dates,item.name).reduce((a,b)=>a+b,0));topMin=Math.round(getClassTop(dates,item.name).reduce((a,b)=>a+b,0))}
        const rank=myMin>=topMin?1:myMin>=avgMin?Math.round(cs*0.4):Math.min(Math.round(cs*(1-myMin/Math.max(avgMin,1)*0.5)),cs);
        const pos=Math.round((rank-1)/(cs-1)*100);
        const mePct=100-pos;
        const avgPos=Math.round((Math.round(cs*0.5)-1)/(cs-1)*100);
        const avgPct=100-avgPos;
        const diff=myMin-avgMin;
        const diffSign=diff>=0?'+':'';
        const diffColor=diff>=0?'#22c55e':'#ef4444';
        const topZoneW=Math.round(100*5/cs);
        const midZoneW=Math.round(100*10/cs);
        return `<div class="rank-bar">
            <div class="rb-label" style="color:${item.color}">${item.name}</div>
            <div class="rb-track">
                <div class="rb-fill" style="width:100%;background:linear-gradient(90deg,#22c55e22 0%,#22c55e22 ${topZoneW}%,#3b82f622 ${topZoneW}%,#3b82f622 ${topZoneW+midZoneW}%,#f59e0b15 ${topZoneW+midZoneW}%,#f59e0b15 70%,#ef444422 70%,#ef444422 100%)"></div>
                <div class="rb-avg-line" style="left:${avgPct}%"></div>
                <div class="rb-avg-label" style="left:${avgPct}%">평균</div>
                <div class="rb-me" style="left:calc(${mePct}% - 15px)" title="${rank}등/${cs}명 | 나: ${myMin}분 | 평균: ${avgMin}분">${rank}</div>
            </div>
            <div class="rb-diff" style="color:${diffColor}">${diffSign}${diff}분</div>
        </div>`;
    }).join('');
}

function renderGap(ov,subjects,daily){
    const study=ov.today_study_seconds,pause=ov.today_pause_seconds,total=study+pause;
    const sp=pct(study,total),pp=100-sp;
    const subjSegs=subjects.filter(s=>s.today_study_minutes>0).map(s=>{const w=pct(s.today_study_minutes*60,study);return `<div class="seg" style="width:${w}%;background:${s.color}">${w>8?s.name:''}</div>`}).join('');
    const week7=daily.slice(-8,-1);
    const avg7Study=week7.length?Math.round(week7.reduce((a,d)=>a+d.total_study_seconds,0)/week7.length):0;
    const avg7Pause=week7.length?Math.round(week7.reduce((a,d)=>a+(d.total_pause_seconds||0),0)/week7.length):0;
    const avg7Total=avg7Study+avg7Pause;
    const avg7Sp=pct(avg7Study,avg7Total),avg7Pp=100-avg7Sp;
    const studyDiff=Math.round(study/60)-Math.round(avg7Study/60);
    const diffColor=studyDiff>=0?'#22c55e':'#ef4444';
    const diffSign=studyDiff>=0?'+':'';
    document.getElementById('gapSection').innerHTML=`
        <div style="font-size:.8rem;color:#94a3b8;margin-bottom:8px">오늘 순공 vs 비공부 시간</div>
        <div class="gap-bar"><div class="seg" style="width:${sp}%;background:#22c55e">${sp}% 순공</div><div class="seg" style="width:${pp}%;background:#334155">${pp>5?pp+'% 갭':''}</div></div>
        <div class="gap-legend"><div class="gl"><span class="gd" style="background:#22c55e"></span>순공 ${fmt(study)}</div><div class="gl"><span class="gd" style="background:#334155"></span>쉬는시간 ${fmt(pause)}</div></div>
        <div style="font-size:.8rem;color:#94a3b8;margin:14px 0 8px">최근 7일 평균</div>
        <div class="gap-bar"><div class="seg" style="width:${avg7Sp}%;background:#22c55e88">${avg7Sp}% 순공</div><div class="seg" style="width:${avg7Pp}%;background:#334155">${avg7Pp>5?avg7Pp+'% 갭':''}</div></div>
        <div class="gap-legend"><div class="gl"><span class="gd" style="background:#22c55e88"></span>순공 ${fmt(avg7Study)}</div><div class="gl"><span class="gd" style="background:#334155"></span>쉬는시간 ${fmt(avg7Pause)}</div><div class="gl" style="color:${diffColor};font-weight:600">오늘 ${diffSign}${studyDiff}분</div></div>
        <div style="font-size:.8rem;color:#94a3b8;margin:14px 0 8px">오늘 과목별 순공시간 구성</div>
        <div class="gap-bar">${subjSegs||'<div class="seg" style="width:100%;background:#1e293b;color:#475569">기록 없음</div>'}</div>
        <div class="gap-legend">${subjects.filter(s=>s.today_study_minutes>0).map(s=>`<div class="gl"><span class="gd" style="background:${s.color}"></span>${s.name} ${s.today_study_minutes}분</div>`).join('')}</div>`;
}

function renderReport(ov,subjects,daily,dates,sliced){
    const el=document.getElementById('reportSection');
    const ca=DATA.class_avg||{};
    const cs=ca.class_size||20;
    const studyMin=Math.round(ov.today_study_seconds/60);
    const pauseMin=Math.round(ov.today_pause_seconds/60);
    const focus=ov.today_focus_rate;
    const done=ov.subjects_done;
    const todayAvg=ca.daily?.[dates[dates.length-1]]?.avg_study_minutes||0;
    const todayDiff=studyMin-todayAvg;

    const periodMyMin=Math.round(sliced.reduce((a,d)=>a+d.total_study_seconds,0)/60);
    const periodAvgMin=Math.round(dates.reduce((a,d)=>a+(ca.daily?.[d]?.avg_study_minutes||0),0));
    const periodTopMin=Math.round(dates.reduce((a,d)=>a+(ca.daily?.[d]?.top_study_minutes||0),0));
    const rank=periodMyMin>=periodTopMin?1:periodMyMin>=periodAvgMin?Math.round(cs*0.35):Math.round(cs*0.65);
    const topPct=Math.round(rank/cs*100);

    let grade,gradeColor,gradeEmoji;
    if(rank<=3){grade='A+';gradeColor='#22c55e';gradeEmoji='\u{1F929}'}
    else if(rank<=cs*0.3){grade='A';gradeColor='#22c55e';gradeEmoji='\u{1F60E}'}
    else if(rank<=cs*0.5){grade='B';gradeColor='#3b82f6';gradeEmoji='\u{1F4AA}'}
    else if(rank<=cs*0.7){grade='C';gradeColor='#f59e0b';gradeEmoji='\u{1F914}'}
    else{grade='D';gradeColor='#ef4444';gradeEmoji='\u{1F622}'}

    const subjData=subjects.map(s=>{
        const myM=Math.round(sliced.reduce((a,d)=>a+(d.by_subject[s.name]?.study_seconds||0),0)/60);
        const avgM=Math.round(getClassAvg(dates,s.name).reduce((a,b)=>a+b,0));
        const diff=myM-avgM;
        const ratio=avgM>0?Math.round(myM/avgM*100):0;
        const goalT=s.goal_minutes*curPeriod;
        const achv=goalT>0?Math.round(myM/goalT*100):0;
        let status,sColor;
        if(ratio>=150){status='최상';sColor='#22c55e'}
        else if(ratio>=100){status='양호';sColor='#22c55e'}
        else if(ratio>=70){status='부족';sColor='#f59e0b'}
        else{status='위험';sColor='#ef4444'}
        return {name:s.name,color:s.color,myM,avgM,diff,ratio,achv,goalT,status,sColor,goal_minutes:s.goal_minutes};
    });

    const weakSubjs=subjData.filter(s=>s.ratio<100);
    const strongSubjs=subjData.filter(s=>s.ratio>=120);

    const week7=sliced.slice(-7);
    const trend3=week7.slice(-3).map(d=>Math.round(d.total_study_seconds/60));
    const isUp=trend3.length>=3&&trend3[2]>=trend3[0];
    const weekAvg=Math.round(week7.reduce((a,d)=>a+d.total_study_seconds,0)/7/60);

    const today=new Date();
    const dateStr=`${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일 (${WD[today.getDay()]})`;

    kill('rpt_trend');kill('rpt_achieve');kill('rpt_compare');kill('rpt_subj_trend');

    el.innerHTML=`
        <div class="rpt-hdr">
            <div class="rh-row"><div class="rh-title">AI 학습 분석 보고서</div><div class="rh-date">${dateStr}</div></div>
            <div class="rh-sub">반 ${cs}명 기준 | 분석 기간: ${curPeriod}일</div>
        </div>
        <div class="rpt-body">

            <!-- 1. Grade -->
            <div class="rpt-sec">
                <div class="rpt-sec-title">1. 종합 평가</div>
                <div class="grade-banner">
                    <div class="gb-left">
                        <span class="gb-char tw-target">${gradeEmoji}</span>
                        <div class="gb-grade" style="color:${gradeColor}">${grade}</div>
                        <div class="gb-title">${cs}명 중 ${rank}등 (상위 ${topPct}%)</div>
                    </div>
                    <div class="gb-right">
                        <div class="gb-rank" style="color:${gradeColor}">
                            ${grade==='A+'||grade==='A'?'우수한 학습 성과':grade==='B'?'평균 이상, 상위권 도전 가능':grade==='C'?'분발이 필요한 시기':'즉각적인 학습량 개선 필요'}
                        </div>
                        <div class="gb-msg">
                            ${curPeriod}일간 총 <strong>${periodMyMin}분</strong> 공부 (일 평균 ${Math.round(periodMyMin/curPeriod)}분).
                            반 평균 ${periodAvgMin}분 대비 <strong style="color:${periodMyMin>=periodAvgMin?'#22c55e':'#ef4444'}">${periodMyMin>=periodAvgMin?'+':''}${periodMyMin-periodAvgMin}분 (${periodAvgMin>0?(periodMyMin>=periodAvgMin?'+':'')+Math.round((periodMyMin-periodAvgMin)/periodAvgMin*100)+'%':'--'})</strong>.
                            ${isUp?'최근 학습량 상승 추세로 긍정적입니다.':'최근 학습량이 감소 추세이므로 학습 루틴 점검이 필요합니다.'}
                        </div>
                    </div>
                </div>
                <div class="kpi-row">
                    <div class="kpi"><div class="kv" style="color:#22c55e">${studyMin}분</div><div class="kl">오늘 순공</div><div class="kb"><div class="kf" style="width:${Math.min(studyMin/180*100,100)}%;background:#22c55e"></div></div></div>
                    <div class="kpi"><div class="kv" style="color:#ef4444">${pauseMin}분</div><div class="kl">비공부 시간</div><div class="kb"><div class="kf" style="width:${Math.min(pauseMin/60*100,100)}%;background:#ef4444"></div></div></div>
                    <div class="kpi"><div class="kv" style="color:#f59e0b">${focus}%</div><div class="kl">집중률</div><div class="kb"><div class="kf" style="width:${focus}%;background:#f59e0b"></div></div></div>
                    <div class="kpi"><div class="kv" style="color:#8b5cf6">${done}/${ov.subjects_total}</div><div class="kl">목표 달성</div><div class="kb"><div class="kf" style="width:${pct(done,ov.subjects_total)}%;background:#8b5cf6"></div></div></div>
                    <div class="kpi"><div class="kv" style="color:#06b6d4">${weekAvg}분</div><div class="kl">주간 일평균</div><div class="kb"><div class="kf" style="width:${Math.min(weekAvg/120*100,100)}%;background:#06b6d4"></div></div></div>
                </div>
            </div>

            <!-- 2. Charts -->
            <div class="rpt-sec">
                <div class="rpt-sec-title">2. 학습 추이 그래프</div>
                <div class="rpt-charts">
                    <div class="rpt-chart-card">
                        <div class="rcc-title">일별 나 vs 반 평균 추이 (최근 7일)</div>
                        <div class="rpt-chart-area"><canvas id="rptTrend"></canvas></div>
                    </div>
                    <div class="rpt-chart-card">
                        <div class="rcc-title">과목별 나 vs 반 평균 비교</div>
                        <div class="rpt-chart-area"><canvas id="rptCompare"></canvas></div>
                    </div>
                    <div class="rpt-chart-card">
                        <div class="rcc-title">과목별 목표 달성률</div>
                        <div class="rpt-chart-area"><canvas id="rptAchieve"></canvas></div>
                    </div>
                    <div class="rpt-chart-card">
                        <div class="rcc-title">과목별 학습 추이 (최근 7일)</div>
                        <div class="rpt-chart-area"><canvas id="rptSubjTrend"></canvas></div>
                    </div>
                </div>
            </div>

            <!-- 3. Subject table -->
            <div class="rpt-sec">
                <div class="rpt-sec-title">3. 과목별 상세 분석</div>
                <table class="rpt-table">
                    <thead><tr><th>과목</th><th>나</th><th>반 평균</th><th>차이</th><th>달성률</th><th class="prog">대비</th><th>상태</th></tr></thead>
                    <tbody>${subjData.map(s=>`<tr>
                        <td><span class="sd" style="background:${s.color}"></span>${s.name}</td>
                        <td><strong>${s.myM}분</strong></td>
                        <td>${s.avgM}분</td>
                        <td style="color:${s.diff>=0?'#22c55e':'#ef4444'}">${s.diff>=0?'+':''}${s.diff}분</td>
                        <td>${s.achv}%</td>
                        <td class="prog"><div class="prog-bg"><div class="prog-fill" style="width:${Math.min(s.ratio,100)}%;background:${s.ratio>=100?'#22c55e':'#ef4444'}"></div></div><div style="font-size:.6rem;color:#64748b;margin-top:2px">${s.ratio}%</div></td>
                        <td><span class="status-pill" style="background:${s.sColor}22;color:${s.sColor}">${s.status}</span></td>
                    </tr>`).join('')}</tbody>
                </table>
            </div>

            <!-- 4. AI Comment -->
            <div class="rpt-sec">
                <div class="rpt-sec-title">4. AI 종합 코멘트</div>
                <div class="ai-box">
                    <div class="ai-title"><span style="font-size:.9rem">AI 학습 코치</span></div>
                    <div class="ai-p">
                        <strong>종합 성적:</strong> 반 ${cs}명 중 <strong style="color:${gradeColor}">${rank}등 (${grade})</strong>.
                        ${curPeriod}일간 총 <strong>${periodMyMin}분</strong> 공부하여 반 평균(${periodAvgMin}분) 대비
                        <span class="${periodMyMin>=periodAvgMin?'up':'dn'}">${periodMyMin>=periodAvgMin?'+':''}${periodMyMin-periodAvgMin}분</span>.
                    </div>
                    ${strongSubjs.length?`<div class="ai-p"><strong>강점 과목:</strong> ${strongSubjs.map(s=>`<strong style="color:${s.color}">${s.name}</strong>(반 평균의 ${s.ratio}%)`).join(', ')}. 해당 과목의 학습 방법을 약한 과목에도 적용하면 효과적입니다.</div>`:''}
                    ${weakSubjs.length?`<div class="ai-p"><strong>보강 과목:</strong> ${weakSubjs.map(s=>`<strong style="color:${s.color}">${s.name}</strong>(${Math.abs(s.diff)}분 부족)`).join(', ')}. ${weakSubjs.length===1?'해당 과목에':'이 과목들에'} 하루 평균 <strong>${Math.round(weakSubjs.reduce((a,s)=>a+Math.abs(s.diff),0)/weakSubjs.length/Math.max(curPeriod,1))}분</strong>씩 추가 투자하면 반 평균에 도달할 수 있습니다.</div>`:''}
                    <div class="ai-p">
                        <strong>집중력:</strong> ${focus>=90?`집중률 <span class="up">${focus}%</span>로 매우 우수합니다.`:focus>=70?`집중률 ${focus}%로 양호합니다. 휴식 관리를 개선하면 더 효율적인 학습이 가능합니다.`:`집중률 <span class="warn">${focus}%</span>로 개선이 필요합니다. 포모도로 기법(25분 공부 + 5분 휴식)을 권장합니다.`}
                    </div>
                    <div class="ai-p">
                        <strong>추세:</strong> ${isUp?`최근 학습량이 <span class="up">상승 추세</span>입니다. 현재 페이스를 유지하면 순위 상승이 기대됩니다.`:`최근 학습량이 <span class="dn">감소 추세</span>입니다. 고정된 학습 시간대를 설정하여 루틴을 만들어보세요.`}
                    </div>
                    <div class="ai-hr"></div>
                    <div class="ai-p" style="font-style:italic;color:#94a3b8">
                        "${grade==='A+'||grade==='A'?'꾸준한 노력이 빛나고 있습니다. 약한 과목 보완에 집중하세요.':grade==='B'?'평균 이상의 학습량입니다. 약한 과목에 10~15분만 더 투자하면 상위권 진입이 가능합니다.':grade==='C'?'반 평균과의 격차를 좁히는 것이 우선입니다. 매일 꾸준히 하는 습관부터 만들어보세요.':'작은 목표부터 달성하며 자신감을 쌓아가세요. 하루 30분부터 시작해봅시다.'}"
                    </div>
                </div>
            </div>

            <!-- 5. Tips -->
            <div class="rpt-sec">
                <div class="rpt-sec-title">5. 맞춤 학습 제안</div>
                <div class="tip-grid">
                    ${weakSubjs.map(s=>`<div class="tip-card">
                        <div class="tc-head" style="color:${s.sColor}">${s.name} 보강 필요</div>
                        <div class="tc-body">반 평균 대비 <strong>${Math.abs(s.diff)}분</strong> 부족. 매일 <strong>${Math.round(Math.abs(s.diff)/Math.max(curPeriod,1))}분</strong> 추가하면 평균에 도달합니다.</div>
                    </div>`).join('')}
                    ${strongSubjs.map(s=>`<div class="tip-card">
                        <div class="tc-head" style="color:#22c55e">${s.name} 우수</div>
                        <div class="tc-body">반 평균의 <strong>${s.ratio}%</strong> 달성. 이 과목의 학습법을 다른 과목에 적용해보세요.</div>
                    </div>`).join('')}
                    ${!isUp?`<div class="tip-card">
                        <div class="tc-head" style="color:#f59e0b">학습량 추세 관리</div>
                        <div class="tc-body">최근 3일 학습량 감소. 고정 시간대를 정하고 루틴을 만들어보세요.</div>
                    </div>`:''}
                    ${pauseMin>studyMin*0.15?`<div class="tip-card">
                        <div class="tc-head" style="color:#f59e0b">휴식 관리</div>
                        <div class="tc-body">비공부 시간 비율이 높습니다. 포모도로 기법(25분 공부 + 5분 휴식)을 추천합니다.</div>
                    </div>`:''}
                    ${weakSubjs.length===0&&isUp?`<div class="tip-card">
                        <div class="tc-head" style="color:#22c55e">우수한 학습 패턴</div>
                        <div class="tc-body">모든 과목이 반 평균 이상이며 학습량도 상승 중입니다. 현재 페이스를 유지하세요.</div>
                    </div>`:''}
                </div>
            </div>
        </div>`;

    const twTarget=el.querySelector('.tw-target');
    if(twTarget&&window.twemoji) twemoji.parse(twTarget,{folder:'svg',ext:'.svg'});

    const w7=sliced.slice(-7);
    const w7dates=w7.map(d=>d.date);
    const w7labels=w7dates.map(dl);
    const w7my=w7.map(d=>Math.round(d.total_study_seconds/60));
    const w7avg=getClassAvg(w7dates,'all');

    CX.rpt_trend=new Chart(document.getElementById('rptTrend'),{
        type:'line',data:{labels:w7labels,datasets:[
            {label:'나',data:w7my,borderColor:'#e94560',backgroundColor:'rgba(233,69,96,.1)',borderWidth:2,fill:true,tension:.3,pointRadius:3,pointBackgroundColor:'#e94560'},
            {label:'반 평균',data:w7avg,borderColor:'#3b82f6',borderWidth:2,borderDash:[5,5],fill:false,tension:.3,pointRadius:3,pointBackgroundColor:'#3b82f6'},
        ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:10},padding:8}},tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'분'}}},scales:{x:{ticks:{color:'#475569',font:{size:9}},grid:{display:false}},y:{beginAtZero:true,ticks:{color:'#475569',callback:v=>v+'분',font:{size:9}},grid:{color:'rgba(255,255,255,.04)'}}}}
    });

    CX.rpt_compare=new Chart(document.getElementById('rptCompare'),{
        type:'bar',data:{labels:subjData.map(s=>s.name),datasets:[
            {label:'나',data:subjData.map(s=>s.myM),backgroundColor:subjData.map(s=>s.color+'cc'),borderRadius:4},
            {label:'반 평균',data:subjData.map(s=>s.avgM),backgroundColor:'#3b82f666',borderRadius:4},
        ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:10},padding:8}},tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'분'}}},scales:{x:{ticks:{color:'#64748b',font:{size:10}},grid:{display:false}},y:{beginAtZero:true,ticks:{color:'#475569',callback:v=>v+'분',font:{size:9}},grid:{color:'rgba(255,255,255,.04)'}}}}
    });

    CX.rpt_achieve=new Chart(document.getElementById('rptAchieve'),{
        type:'bar',data:{labels:subjData.map(s=>s.name),datasets:[{
            data:subjData.map(s=>Math.min(s.achv,150)),
            backgroundColor:subjData.map(s=>s.achv>=100?'#22c55ecc':s.achv>=70?'#f59e0bcc':'#ef4444cc'),
            borderRadius:4,
        }]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.raw+'% 달성'}}},scales:{x:{beginAtZero:true,max:150,ticks:{color:'#475569',callback:v=>v+'%',font:{size:9}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'#cbd5e1',font:{size:10}},grid:{display:false}}}}
    });

    const subjColors=subjects.map(s=>s.color);
    CX.rpt_subj_trend=new Chart(document.getElementById('rptSubjTrend'),{
        type:'line',data:{labels:w7labels,datasets:subjects.map((s,i)=>({
            label:s.name,data:w7.map(d=>Math.round((d.by_subject[s.name]?.study_seconds||0)/60)),
            borderColor:s.color,borderWidth:2,fill:false,tension:.3,pointRadius:2,pointBackgroundColor:s.color,
        }))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:10},padding:8}},tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'분'}}},scales:{x:{ticks:{color:'#475569',font:{size:9}},grid:{display:false}},y:{beginAtZero:true,ticks:{color:'#475569',callback:v=>v+'분',font:{size:9}},grid:{color:'rgba(255,255,255,.04)'}}}}
    });
}

function selStackPeriod(days,btn){
    curStackPeriod=days;
    document.querySelectorAll('#stackPeriodTabs .period-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderStackedChart();
}

function renderStackedChart(){
    kill('stacked');
    const {subjects,daily}=DATA;
    let sliced,labels;
    if(curStackPeriod===1){
        sliced=daily.slice(-1);
        labels=sliced.map(d=>dl(d.date));
    } else if(curStackPeriod===7){
        sliced=daily.slice(-7);
        labels=sliced.map(d=>{const dt=new Date(d.date+'T00:00:00');return `${dt.getMonth()+1}/${dt.getDate()}(${WD[dt.getDay()]})`;});
    } else {
        sliced=daily.slice(-30);
        labels=sliced.map(d=>dl(d.date));
    }
    const datasets=subjects.map(s=>({
        label:s.name,
        data:sliced.map(d=>Math.round((d.by_subject[s.name]?.study_seconds||0)/60)),
        backgroundColor:s.color+'cc',
        borderRadius:2,
    }));
    document.getElementById('stackLegend').innerHTML=subjects.map(s=>`<div class="legend-item"><div class="legend-dot" style="background:${s.color}"></div>${s.name}</div>`).join('');
    document.getElementById('stackPeriodTabs').innerHTML=[
        {d:1,l:'일별'},{d:7,l:'주별'},{d:30,l:'월별'}
    ].map(p=>`<button class="period-tab${curStackPeriod===p.d?' active':''}" onclick="selStackPeriod(${p.d},this)">${p.l}</button>`).join('');
    CX.stacked=new Chart(document.getElementById('stackedChart'),{
        type:'bar',data:{labels,datasets},
        options:{responsive:true,maintainAspectRatio:false,
            plugins:{legend:{display:false},tooltip:{mode:'index',callbacks:{label:c=>c.dataset.label+': '+c.raw+'분',footer:items=>'합계: '+items.reduce((a,i)=>a+i.raw,0)+'분'}}},
            scales:{x:{stacked:true,ticks:{color:'#475569',maxRotation:45,font:{size:curStackPeriod===30?8:10}},grid:{display:false}},
                    y:{stacked:true,beginAtZero:true,ticks:{color:'#475569',callback:v=>v+'분'},grid:{color:'rgba(255,255,255,.04)'}}}}
    });
}

init();
