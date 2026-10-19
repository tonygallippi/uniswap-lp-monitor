const COLLECT='0x40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f01',DECREASE='0x26f6a048ee9138f2c0ce266f322cb99228e8d619ae2bff30c67f8dcf9d2377b4';
const EXPLORERS={base:'https://base.blockscout.com',ethereum:'https://eth.blockscout.com',optimism:'https://optimism.blockscout.com',arbitrum:'https://arbitrum.blockscout.com',polygon:'https://polygon.blockscout.com'};
export function yieldMetrics(position,history,now=Date.parse(position.checkedAt)){
 const rows=history.rows||[],last=rows[0]||null,days=last?(now-last.timestamp*1000)/86400000:null,prices=position.tokens.map(t=>t.price),value=amounts=>amounts?.length===2&&prices.every(Number.isFinite)?amounts.reduce((s,a,i)=>s+Number(a)*prices[i],0):null;
 const usable=history.status==='current'&&!history.principalWarning&&position.status!=='closed';
 const daily=usable&&position.feesValue!=null&&days>0?position.feesValue/days:null;
 const apy=daily!=null&&position.value>0?Math.expm1(365*Math.log1p(daily/position.value)):null;
 // Matches DeFi claim-interval backfill: first claim is only an anchor.
 const start=now-30*86400000,ordered=[...rows].sort((a,b)=>a.timestamp-b.timestamp),intervals=[];
 for(let i=1;i<ordered.length;i++)intervals.push({start:ordered[i-1].timestamp*1000,end:ordered[i].timestamp*1000,value:value(ordered[i].amounts)});
 if(usable&&last&&position.feesValue!=null)intervals.push({start:last.timestamp*1000,end:now,value:position.feesValue});
 const dailyEstimates=[];let earned=0,covered=0;
 if(!history.principalWarning)for(let day=Math.floor(start/86400000)*86400000;day<now;day+=86400000){let amount=0,duration=0;for(const x of intervals){const overlap=Math.max(0,Math.min(x.end,day+86400000,now)-Math.max(x.start,day,start));if(overlap&&x.value!=null&&x.end>x.start){amount+=x.value*overlap/(x.end-x.start);duration+=overlap}}if(duration){dailyEstimates.push({day:new Date(day).toISOString().slice(0,10),earnings_usd:amount,covered_days:duration/86400000});earned+=amount;covered+=duration}}
 const windowDays=covered/86400000,trailing=windowDays>=1&&position.value>0?Math.expm1(Math.log1p(earned/position.value)*365/windowDays):null;
 return {lastClaim:last,daily,apy:Number.isFinite(apy)?apy:null,trailingApy:Number.isFinite(trailing)?trailing:null,windowDays,dailyEstimates,earningsUsd:earned,method:'Daily estimate = current unclaimed fees ÷ days since the latest recorded claim. APY = (1 + daily estimate ÷ current deposited liquidity)^365 − 1. Assumes daily reinvestment and constant current liquidity; uses current token prices, excludes gas, and is not a forecast.',trailingMethod:'30-day estimate allocates claimed fees evenly between consecutive claims, plus current unclaimed fees since the latest claim, prorated to the window. First claim is only an anchor. Assumes full claims and constant current principal; deposits, withdrawals and partial claims can distort results. UTC day buckets; current token prices; excludes gas.'};
}
async function explorerLogs(p,topic){const c=CHAINS[p.chain],q=new URLSearchParams({module:'logs',action:'getLogs',address:c.manager,fromBlock:'0',toBlock:'latest',topic0:topic,topic1:'0x'+word(p.id),topic0_1_opr:'and'});const r=await fetch(EXPLORERS[p.chain]+'/api?'+q,{signal:AbortSignal.timeout(16000)});const d=await r.json();if(!r.ok||!Array.isArray(d.result)||d.result.length>=1000||!['0','1'].includes(d.status))throw Error('History source unavailable');for(const l of d.result)if(l.address?.toLowerCase()!==c.manager||l.topics?.[0]?.toLowerCase()!==topic||l.topics?.[1]?.toLowerCase()!=='0x'+word(p.id)||l.removed)throw Error('Invalid history log');return d.result}
export async function positionHistory(position){
 const p=position;
 try{const [logs,withdrawals]=await Promise.all([explorerLogs(p,COLLECT),explorerLogs(p,DECREASE)]);
 const rows=logs.map(l=>{const w=words(l.data);return {hash:l.transactionHash,index:Number(l.logIndex),timestamp:Number(l.timeStamp),amounts:[Number(uint(w[1]))/10**p.tokens[0].decimals,Number(uint(w[2]))/10**p.tokens[1].decimals]}});
 if(rows.some(r=>!/^0x[0-9a-f]{64}$/i.test(r.hash)||!(r.timestamp>0)||!r.amounts.every(a=>Number.isFinite(a)&&a>=0)))throw Error('Invalid history');
 const h={status:'current',source:'On-chain events',checkedAt:new Date().toISOString(),rows:[...new Map(rows.map(r=>[r.hash+':'+r.index,r])).values()].sort((a,b)=>b.timestamp-a.timestamp),principalWarning:withdrawals.length>0};h.metrics=yieldMetrics(position,h);return h;
 }catch{return {status:'unavailable',rows:[],checkedAt:null,error:'Claim history temporarily unavailable from the public explorer. Refresh to retry.'}}
}
