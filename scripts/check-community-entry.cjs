const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('packages/client/components/common/communityEntry.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const main='01M82F90WS722TDMWWYRMJHCPE',region='01M82M30BMB73YMB7ZGF9BE7CD',key='peakcut.requested-public-community.v1';
async function run({pathname='/',saved,existing=[],deny,wrong=false}={}){
 const storage=new Map(saved?[[key,JSON.stringify(saved)]]:[]),calls=[],cache=new Set(existing),paths=[];
 const brand={communityServer:main,communityPath:'/server/'+main+'/channel/welcome',regionalServers:[region]};
 const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,require:n=>n==='solid-js'?{batch:fn=>fn()}:{brand},location:{pathname},Date,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}});
 const client={user:{id:'fixture'},servers:{has:id=>cache.has(id),getOrCreate:id=>cache.add(id)},channels:{getOrCreate(){}},api:{post:async(...args)=>{calls.push(args);const id=args[0].split('/').at(-1);if(id===deny)throw Error('Native join denied');return {type:'Server',server:{_id:wrong?'WRONG':id},channels:[{_id:'fixture-channel'}]};}}};
 let result,error;try{result=await module.exports.prepareCommunityEntry(client,{setLastActivePath:p=>paths.push(p)});}catch(e){error=e;}
 assert(calls.every(args=>args.length===1),'no role data or privileged bypass');return {result,error,calls,storage,cache,paths,brand};
}
(async()=>{
 let r=await run();assert.equal(r.result,r.brand.communityPath);assert.equal(r.calls.length,1);
 r=await run({pathname:'/invite/'+region});assert.equal(r.result,'/server/'+region);assert.equal(r.calls.length,2);assert(r.cache.has(main)&&r.cache.has(region));assert(!r.storage.has(key));
 r=await run({pathname:'/login',saved:{server:region,expires:Date.now()+60000}});assert.equal(r.result,'/server/'+region);
 r=await run({saved:{server:'01AAAAAAAAAAAAAAAAAAAAAAAA',expires:Date.now()+60000}});assert.equal(r.calls.length,1);
 r=await run({saved:{server:region,expires:Date.now()-1}});assert.equal(r.calls.length,1);
 r=await run({pathname:'/invite/'+region,existing:[main,region]});assert.equal(r.calls.length,0);assert.equal(r.result,'/server/'+region);
 r=await run({pathname:'/invite/'+region,deny:region});assert(r.error);assert(!r.cache.has(region));assert(!r.storage.has(key));
 r=await run({wrong:true});assert(r.error);assert.equal(r.cache.size,0);
 console.log('PASS: explicit region entry, cross-tab verification intent, allowlist/expiry, existing membership, native denial and no role grants');
})().catch(e=>{console.error(e);process.exitCode=1;});
