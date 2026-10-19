import test from 'node:test';
import assert from 'node:assert/strict';
import {recentRpcHistory,yieldMetrics} from '../src/history.mjs';
const manager='0x03a520b32c04bf3beef7beb72e919cf822ed34f1',collect='0x40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f01';
const word=n=>BigInt(n).toString(16).padStart(64,'0');
const p={chain:'base',id:'42',block:9000,checkedAt:new Date(172800000).toISOString(),tokens:[{decimals:6,price:1},{decimals:18,price:2}],feesValue:100,value:10000,status:'in'};
const log={address:manager,topics:[collect,'0x'+word(42)],blockNumber:'0x1388',logIndex:'0x0',transactionHash:'0x'+'a'.repeat(64),data:'0x'+word(0)+word(50000000)+word(25n*10n**18n)};
test('RPC fallback finds latest claim after empty batches, timestamps it and calculates yields',async()=>{
 let calls=0;const h=await recentRpcHistory(p,{},async(method,params)=>{if(method==='eth_getBlockByNumber')return {number:params[0],timestamp:'0x15180'};const q=params[0];if(typeof q.topics[0]==='string')return [];calls++;assert(Number(BigInt(q.toBlock))-Number(BigInt(q.fromBlock))<=999);return Number(BigInt(q.fromBlock))<=5000&&Number(BigInt(q.toBlock))>=5000?[log]:[]});
 assert.equal(calls,5);assert.equal(h.partial,true);assert.equal(h.rows.length,1);assert.deepEqual(h.rows[0].amounts,[50,25]);assert.equal(yieldMetrics(p,h).daily,100);
});
test('RPC failure or wrong token logs cannot produce a verified history',async()=>{
 await assert.rejects(recentRpcHistory(p,{},async()=>{throw Error('offline')}));
 await assert.rejects(recentRpcHistory(p,{},async()=>[{...log,topics:[collect,'0x'+word(99)]}]));
});

test('Ethereum opening event anchors earnings before the first claim',async()=>{
 const transfer='0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
 const h=await recentRpcHistory({...p,chain:'ethereum',block:5500},{},async(method,params)=>{if(method==='eth_getBlockByNumber')return {number:params[0],timestamp:'0x15180'};const q=params[0];return q.topics[0]===transfer?[{address:'0xc36442b4a4522e871399cd717abdd847ab11fe88',topics:[transfer,'0x'+word(0),'0x'+word(1),'0x'+word(42)],blockNumber:'0x1388'}]:[]});
 assert.equal(h.rows.length,0);assert.equal(h.openedAt,86400);assert.equal(yieldMetrics(p,h).daily,100);assert.equal(yieldMetrics(p,h).sinceOpened,true);
});
