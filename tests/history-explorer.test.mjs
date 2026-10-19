import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../docs/data.js',import.meta.url),'utf8');
const {positionHistory,yieldMetrics}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('Ethereum explorer retries a transient failure and calculates from the mint without claims',async()=>{
 const original=globalThis.fetch;let mintCalls=0;
 globalThis.fetch=async url=>{const q=new URL(url).searchParams;const mint=q.has('topic3');if(mint&&++mintCalls===1)throw Error('Failed to fetch');return {ok:true,json:async()=>({status:mint?'1':'0',result:mint?[{address:q.get('address'),topics:[q.get('topic0'),'0x'+'0'.repeat(64),'0x'+'1'.repeat(64),q.get('topic3')],timeStamp:'0x15180'}]:[]})}};
 try{const p={chain:'ethereum',id:'42',checkedAt:new Date(172800000).toISOString(),tokens:[{price:1,decimals:6},{price:2,decimals:18}],feesValue:100,value:10000,status:'out'};const h=await positionHistory(p);assert.equal(mintCalls,2);assert.equal(h.openedAt,86400);assert.equal(h.rows.length,0);assert.equal(yieldMetrics(p,h).daily,100);assert(yieldMetrics(p,h).apy>0);h.status='saved';assert.equal(yieldMetrics(p,h).daily,100)}finally{globalThis.fetch=original}
});
test('a saved opening time survives an empty explorer refresh',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>({ok:true,json:async()=>({status:'0',result:[]})});
 try{const p={chain:'ethereum',id:'42',checkedAt:new Date(172800000).toISOString(),tokens:[{price:1,decimals:6},{price:2,decimals:18}],feesValue:100,value:10000,status:'out'};const h=await positionHistory(p,{openedAt:86400});assert.equal(h.openedAt,86400);assert.equal(yieldMetrics(p,h).daily,100)}finally{globalThis.fetch=original}
});
test('NFT transfer endpoint recovers an opening missing from legacy logs',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async url=>({ok:true,json:async()=>String(url).includes('/api/v2/')?{items:[{from:{hash:'0x'+'0'.repeat(40)},token:{address_hash:'0xc36442b4a4522e871399cd717abdd847ab11fe88'},total:{token_id:'42'},timestamp:new Date(86400000).toISOString()}],next_page_params:null}:{status:'0',result:[]}});
 try{const p={chain:'ethereum',id:'42',checkedAt:new Date(172800000).toISOString(),tokens:[{price:1,decimals:6},{price:2,decimals:18}],feesValue:100,value:10000,status:'out'};const h=await positionHistory(p);assert.equal(h.openedAt,86400);assert.equal(yieldMetrics(p,h).daily,100);assert(yieldMetrics(p,h).apy>0)}finally{globalThis.fetch=original}
});
