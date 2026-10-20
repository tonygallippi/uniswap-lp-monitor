import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/app.html',import.meta.url),'utf8');
test('list and cards share native snap slides and preserve position selection',()=>{
 const elements={},calls=[],stored={};
 const element=()=>({hidden:false,style:{},setAttribute(){},classList:{toggle(){}},children:[],innerHTML:''});
 const track=elements.track=element();track.children=[0,1,2].map(i=>({offsetLeft:14+i*400,offsetHeight:i===0?450:600}));track.clientWidth=400;track.scrollLeft=400;track.scrollTo=options=>{calls.push(options);track.scrollLeft=options.left};
 const context=vm.createContext({view:'card',index:0,list:['first','second'],$:id=>elements[id]??=element(),document:{querySelectorAll:()=>[]},localStorage:{setItem:(k,v)=>stored[k]=v},setTimeout:()=>1,clearTimeout(){},matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>fn(),summary:url=>'<summary>'+url+'</summary>',card:url=>'<card>'+url+'</card>',esc:s=>s});
 vm.runInContext(source.slice(source.indexOf('let carouselMoving='),source.indexOf('async function api')),context);
 vm.runInContext('render()',context);
 assert(track.innerHTML.indexOf('overview-slide')<track.innerHTML.indexOf('data-url="first"'));
 vm.runInContext("setView('list')",context);assert.equal(calls.at(-1).left,0);assert.equal(calls.at(-1).behavior,'smooth');
 vm.runInContext('settleCarousel()',context);assert.equal(context.view,'list');assert.equal(stored['lp-monitor:view'],'list');
 track.scrollLeft=800;vm.runInContext('settleCarousel()',context);assert.equal(context.view,'card');assert.equal(context.index,1);
 track.scrollLeft=400;vm.runInContext('settleCarousel()',context);assert.equal(context.index,0);
 vm.runInContext("setView('list');settleCarousel();setView('card')",context);assert.equal(calls.at(-1).left,400);
});
