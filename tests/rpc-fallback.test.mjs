import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=(await readFile(new URL('../src/rpc.mjs',import.meta.url),'utf8')).replaceAll('export ','');
test('provider rejecting batches falls back to individual pinned contract reads',async()=>{
 const requests=[];const ctx=vm.createContext({AbortSignal,console,fetch:async(url,options)=>{const payload=JSON.parse(options.body);requests.push(payload);if(Array.isArray(payload))return {ok:false,status:400,json:async()=>({error:{message:'Batch disabled'}})};if(payload.params[0].data==='optional')return {ok:true,json:async()=>({error:{message:'reverted'}})};return {ok:true,json:async()=>({result:'0x1234'})}}});
 vm.runInContext(source,ctx);const result=await vm.runInContext("batchCalls('https://example.invalid',[{to:'0x1',data:'required'},{to:'0x2',data:'optional',optional:true}],'0x100')",ctx);
 assert.deepEqual(Array.from(result),['0x1234',null]);assert.equal(requests.length,3);assert(requests.slice(1).every(r=>r.params[1]==='0x100'));
});
