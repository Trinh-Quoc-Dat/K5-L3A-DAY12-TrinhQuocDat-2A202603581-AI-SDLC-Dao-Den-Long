export const TUNING = {
  player_speed: 6, carry_capacity: 5, lantern_cost: 3, lantern_count_night1: 5,
  pickup_radius: 1.5, interact_radius: 2.5, pulse_cost: 1, pulse_radius: 8,
  night1_duration_s: 300, flames: 3, invuln_s: 1.5, hit_drop_ratio: 0.5,
  pulse_stun_s: 3, pulse_push_m: 5, pulse_cooldown_s: 1, safe_radius: 5,
  shade_speed: 2.4, shade_hit_radius: 1.2, fall_enabled: false,
  score: { per_mote: 10, per_lantern: 100, per_stun: 25, per_second_left: 1, per_flame_left: 50 }
};
const DT = 1 / 60, clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const dist2 = (a,b) => Math.hypot(a[0]-b[0],a[2]-b[2]);
const rnd = seed => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; };
const defaultLanterns = () => Array.from({length:5},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/5;return{id:`L${i+1}`,pos:[Math.round(Math.cos(a)*22*1000)/1000,0,Math.round(Math.sin(a)*22*1000)/1000],lit:false,deposited:0};});
export function createGame(seed=1, scenario={}) {
  const random=rnd(seed), lanterns=defaultLanterns();
  for (const patch of scenario.lanterns||[]) { const l=lanterns.find(x=>x.id===patch.id); if(l){if(patch.pos)l.pos=[...patch.pos];if(Number.isFinite(patch.deposited))l.deposited=patch.deposited;if(patch.lit===true)l.lit=true;} }
  let motes=scenario.motes ? scenario.motes.map((pos,i)=>({id:`M${i+1}`,pos:[...pos]})) : [];
  if(scenario.random_motes!==false && !scenario.motes) for(let i=0;i<28;i++){const a=random()*Math.PI*2,r=4+random()*29;motes.push({id:`M${i+1}`,pos:[Math.cos(a)*r,0,Math.sin(a)*r]});}
  let shades=scenario.shades ? scenario.shades.map((s,i)=>({id:s.id||`S${i+1}`,pos:[...s.pos],state:'chase',stunUntil:0})) : [];
  if(scenario.random_shades!==false && !scenario.shades) for(let i=0;i<3;i++){const a=random()*Math.PI*2;shades.push({id:`S${i+1}`,pos:[Math.cos(a)*28,1,Math.sin(a)*28],state:'chase',stunUntil:0});}
  const p=scenario.player||{};
  return {tick:0,state:'playing',time_left_s:scenario.time_left_s??TUNING.night1_duration_s,score:0,player:{pos:[...(p.pos||[0,0,0])],flames:p.flames??TUNING.flames,carried:p.carried??0,vy:0,invulnUntil:0,pulseReady:0},lanterns,motes,shades,events:[],_input:{move:[0,0],yaw:0,jump:false,interact:false,pulse:false},_prev:{jump:false,interact:false,pulse:false},_random:random};
}
function emit(g,name,data){g.events.push({type:'event',tick:g.tick,name,data});}
export function step(g,input={}) {
  if(g.state!=='playing')return g;
  const frame={...g._input,...input}; g._input=frame; g.tick++; g.time_left_s=Math.max(0,(g.time_left_s??300)-DT);
  const pressed=k=>!!frame[k]&&!g._prev[k];
  const [mx,mz]=frame.move||[0,0], mag=Math.hypot(mx,mz), nx=mag>1?mx/mag:mx,nz=mag>1?mz/mag:mz, yaw=(frame.cam_yaw_deg||0)*Math.PI/180;
  const wx=nx*Math.cos(yaw)+nz*Math.sin(yaw), wz=-nx*Math.sin(yaw)+nz*Math.cos(yaw);
  g.player.pos[0]+=wx*TUNING.player_speed*DT; g.player.pos[2]+=wz*TUNING.player_speed*DT;
  // The island is circular and gently domed; the visual client renders this same walkable radius.
  const radius=Math.hypot(g.player.pos[0],g.player.pos[2]); if(radius>34){g.player.pos[0]*=34/radius;g.player.pos[2]*=34/radius;}
  if(pressed('jump')&&g.player.pos[1]<=0.001)g.player.vy=7.2;
  g.player.pos[1]=Math.max(0,g.player.pos[1]+g.player.vy*DT); if(g.player.pos[1]===0)g.player.vy=0;else g.player.vy-=18*DT;
  for(let i=g.motes.length-1;i>=0;i--) if(g.player.carried<TUNING.carry_capacity&&dist2(g.player.pos,g.motes[i].pos)<=TUNING.pickup_radius){g.motes.splice(i,1);g.player.carried++;g.score+=TUNING.score.per_mote;emit(g,'mote_picked',{carried:g.player.carried});}
  if(pressed('interact')){const l=g.lanterns.filter(x=>!x.lit&&dist2(g.player.pos,x.pos)<=TUNING.interact_radius).sort((a,b)=>dist2(g.player.pos,a.pos)-dist2(g.player.pos,b.pos))[0];if(l&&g.player.carried>0){const amount=Math.min(g.player.carried,TUNING.lantern_cost-l.deposited);l.deposited+=amount;g.player.carried-=amount;emit(g,'deposit',{lantern_id:l.id,amount,deposited:l.deposited});if(l.deposited>=TUNING.lantern_cost){l.lit=true;g.score+=TUNING.score.per_lantern;emit(g,'lantern_lit',{lantern_id:l.id});}}}
  if(pressed('pulse')&&g.player.flames>=TUNING.pulse_cost&&g.tick>=g.player.pulseReady){g.player.flames-=TUNING.pulse_cost;g.player.pulseReady=g.tick+TUNING.pulse_cooldown_s*60;const stunned=[];for(const s of g.shades){if(s.state!=='stunned'&&dist2(g.player.pos,s.pos)<=TUNING.pulse_radius){s.state='stunned';s.stunUntil=g.tick+TUNING.pulse_stun_s*60;let dx=s.pos[0]-g.player.pos[0],dz=s.pos[2]-g.player.pos[2],d=Math.hypot(dx,dz)||1;s.pos[0]+=dx/d*TUNING.pulse_push_m;s.pos[2]+=dz/d*TUNING.pulse_push_m;stunned.push(s.id);g.score+=TUNING.score.per_stun;}}emit(g,'pulse',{stunned_ids:stunned});}
  for(const s of g.shades){if(s.state==='stunned'){if(g.tick>=s.stunUntil)s.state='chase';else continue;}const l=g.lanterns.find(x=>x.lit&&dist2(s.pos,x.pos)<=TUNING.safe_radius);if(l)continue;const dx=g.player.pos[0]-s.pos[0],dz=g.player.pos[2]-s.pos[2],d=Math.hypot(dx,dz);if(d>0.0001){s.pos[0]+=dx/d*TUNING.shade_speed*DT;s.pos[2]+=dz/d*TUNING.shade_speed*DT;for(const lamp of g.lanterns.filter(x=>x.lit)){const lx=s.pos[0]-lamp.pos[0],lz=s.pos[2]-lamp.pos[2],ld=Math.hypot(lx,lz);if(ld<TUNING.safe_radius){if(ld<1e-9){s.pos[0]=lamp.pos[0]+TUNING.safe_radius;s.pos[2]=lamp.pos[2];}else{const inv=TUNING.safe_radius/ld;s.pos[0]=lamp.pos[0]+lx*inv;s.pos[2]=lamp.pos[2]+lz*inv;}}}}if(d<=TUNING.shade_hit_radius&&g.tick>=g.player.invulnUntil){g.player.flames=Math.max(0,g.player.flames-1);g.player.invulnUntil=g.tick+TUNING.invuln_s*60;const dropped=Math.min(g.player.carried,Math.floor(g.player.carried*TUNING.hit_drop_ratio));g.player.carried-=dropped;for(let i=0;i<dropped;i++)g.motes.push({id:`M${g.tick}-${i}`,pos:[g.player.pos[0]+(i%2?1:-1),0,g.player.pos[2]+(i%3-1)]});emit(g,'player_hit',{by:'shade',flames:g.player.flames,dropped});}}
  if(g.lanterns.every(x=>x.lit)){g.state='won';g.score+=Math.floor(g.time_left_s)*TUNING.score.per_second_left+g.player.flames*TUNING.score.per_flame_left;emit(g,'game_over',{result:'won',reason:'all_lit'});}else if(g.player.flames<=0){g.state='lost';emit(g,'game_over',{result:'lost',reason:'no_flames'});}else if(g.time_left_s<=0){g.state='lost';emit(g,'game_over',{result:'lost',reason:'dawn'});}
  g._prev={jump:!!frame.jump,interact:!!frame.interact,pulse:!!frame.pulse}; return g;
}
export function snapshot(g){const round=n=>Math.round(n*1000)/1000;return {type:'snapshot',tick:g.tick,sim_tick:g.tick,state:g.state,time_left_s:round(g.time_left_s),score:g.score,player:{pos:g.player.pos.map(round),flames:g.player.flames,carried:g.player.carried},lanterns:g.lanterns.map(l=>({id:l.id,pos:l.pos.map(round),lit:l.lit,deposited:l.deposited})),shades:g.shades.map(s=>({id:s.id,pos:s.pos.map(round),state:s.state})),motes_active:g.motes.length,motes:g.motes.map(m=>({id:m.id,pos:m.pos.map(round)}))};}
