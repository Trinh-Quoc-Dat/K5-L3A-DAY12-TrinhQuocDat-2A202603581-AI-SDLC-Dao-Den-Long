export const TUNING = {
  player_speed: 6, carry_capacity: 10, lantern_cost: 10, lantern_count_night1: 5,
  lantern_count_night2: 6, lantern_count_night3: 7, pickup_radius: 1.5,
  interact_radius: 2.5, pulse_cost: 1, pulse_radius: 8, night1_duration_s: 300,
  night2_duration_s: 300, night3_duration_s: 300, flames: 3, invuln_s: 1.5,
  hit_drop_ratio: 0.5, pulse_stun_s: 3, pulse_push_m: 5, pulse_cooldown_s: 1,
  safe_radius: 5, shade_speed: 2.4, shade_hit_radius: 1.2, fall_enabled: true,
  dash_speed: 14, dash_duration_s: 0.2, dash_cooldown_s: 1.5,
  charm_duration_s: 10, charm_respawn_s: 45, drifter_speed: 7,
  score: { per_mote: 10, per_lantern: 100, per_pulse_hit: 5, per_second_left: 2, per_flame_left: 50 }
};
export const DT=1/60;
const GRAVITY=20, SHADE_WARNING_TICKS=30, DROPPED_TTL_TICKS=900;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const isNight=n=>Number.isInteger(n)&&n>=1&&n<=3;
const dist2=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
const round=n=>Math.round(n*1000)/1000;
const pos2=(r,deg,cx=0,cz=0)=>[cx+r*Math.cos(deg*Math.PI/180),0,cz+r*Math.sin(deg*Math.PI/180)];
const rngFor=seed=>{let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};};
function lanternPoints(night){
  if(night===1)return [[0,0,25],[23.8,0,7.7],[14.7,0,-20.2],[-14.7,0,-20.2],[-23.8,0,7.7]];
  if(night===2)return [[0,0,20],[17,0,-10],[-17,0,-10],[70,0,20],[87,0,-10],[53,0,-10]];
  return [[0,6,6],[18,3,10],[-18,3,10],[35,0,-10],[-35,0,-10],[20,0,-35],[-20,0,-35]];
}
function motePoints(night){
  if(night===1)return [...Array.from({length:8},(_,i)=>pos2(12,i*45)),...Array.from({length:16},(_,i)=>pos2(33,i*22.5))];
  if(night===2)return [...[0,70].flatMap(cx=>[...Array.from({length:4},(_,i)=>pos2(10,i*90,cx)),...Array.from({length:8},(_,i)=>pos2(22,i*45,cx))])];
  return [...Array.from({length:18},(_,i)=>pos2(34,i*20)),...Array.from({length:8},(_,i)=>pos2(18,20+i*20)),...Array.from({length:4},(_,i)=>pos2(5,45+i*90))];
}
function shadePoints(night){
  if(night===1)return Array.from({length:12},(_,i)=>pos2(37,15+i*30));
  if(night===2)return [0,70].flatMap(cx=>Array.from({length:8},(_,i)=>pos2(26,22.5+i*45,cx)));
  return Array.from({length:16},(_,i)=>pos2(43,i*22.5));
}
function lanternsFor(night,scenario={}){
  const lamps=lanternPoints(night).map((pos,i)=>({id:`L${i+1}`,pos:[...pos],lit:false,deposited:0}));
  for(const patch of scenario.lanterns||[]){const l=lamps.find(x=>x.id===patch.id);if(l){if(patch.pos)l.pos=[...patch.pos];if(Number.isFinite(patch.deposited))l.deposited=patch.deposited;if(patch.lit===true)l.lit=true;}}
  return lamps;
}
function nightDuration(n){return TUNING[`night${n}_duration_s`];}
function defaultCharms(night){const locations=night===2?[[35,0,0]]:night===3?[[30,0,25],[-30,0,25]]:[];return locations.map((pos,i)=>({id:`C${i+1}`,pos:[...pos],available:true,respawnTick:0}));}
function makeMotes(positions,kind='random'){return positions.map((pos,i)=>({id:`M${String(i+1).padStart(3,'0')}`,pos:[...pos],kind,ttlTicks:null}));}
function shadeIdCompare(a,b){const an=Number(String(a.id).replace(/^\D+/,'')),bn=Number(String(b.id).replace(/^\D+/,''));return Number.isFinite(an)&&Number.isFinite(bn)?an-bn:String(a.id).localeCompare(String(b.id));}

export function createGame(seed=1,scenario={},night=1,totalScore=0){
  if(!isNight(night))throw new Error('night must be 1, 2, or 3');
  const random=rngFor(seed),lamps=lanternsFor(night,scenario),points=motePoints(night),spawnPoints=shadePoints(night);
  let motes=scenario.motes?scenario.motes.map((pos,i)=>({id:`M${i+1}`,pos:[...pos],kind:'random',ttlTicks:null})):
    (scenario.random_motes===false?[]:makeMotes(points));
  let shades=scenario.shades?scenario.shades.map((s,i)=>({id:s.id||`S${i+1}`,pos:[...s.pos],state:s.state||'chase',stateTicksLeft:s.state_ticks_left??0,stunUntil:0})):
    (scenario.random_shades===false?[]:[]);
  let drifters=scenario.drifters?scenario.drifters.map((d,i)=>({id:d.id||`D${i+1}`,pos:[...d.pos],state:d.state||'idle',stateTicksLeft:d.state_ticks_left??0,stolen:d.stolen??0,stolenAt:Array.from({length:d.stolen??0},()=>[...d.pos]),stoleOnce:d.stoleOnce??false})):
    (scenario.random_drifters===false?[]:[]);
  const charms=(scenario.charms?scenario.charms.map(c=>({id:c.id,pos:[...c.pos],available:c.available!==false,respawnTick:c.respawn_ticks??0})):defaultCharms(night));
  const p=scenario.player||{};
  const game={night,seed,tick:0,sim_tick:0,state:'playing',paused:false,time_left_s:scenario.time_left_s??nightDuration(night),score:0,totalScore,wonScore:0,
    player:{pos:[...(p.pos||(night===3?[0,0,-30]:[0,0,0]))],vel:[0,0,0],facing:[0,1],grounded:true,flames:p.flames??TUNING.flames,carried:p.carried??0,
      invulnTicks:p.invuln_ticks??0,dashCdTicks:p.dash_cd_ticks??0,pulseCdTicks:p.pulse_cd_ticks??0,charmTicks:p.charm_ticks??0,dashTicks:0,dashVel:[0,0],vy:0,fallCounted:false,padFlightTicks:0},
    lanterns:lamps,motes,shades,drifters,charms,wind:{active:false,dir_deg:0},windEnabled:scenario.wind_enabled!==false,
    randomMotes:scenario.random_motes!==false,randomShades:scenario.random_shades!==false,randomDrifters:scenario.random_drifters!==false,
    events:[],_random:random,_spawnShadeIndex:Math.max(0,...shades.map(x=>Number(String(x.id).replace(/^\D+/,''))||0)),_spawnDrifterIndex:Math.max(0,...drifters.map(x=>Number(String(x.id).replace(/^\D+/,''))||0)),_nextMoteId:motes.length+1,
    _input:{move:[0,0],cam_yaw_deg:0,jump:false,interact:false,pulse:false,dash:false,pause:false},_prev:{jump:false,interact:false,pulse:false,dash:false,pause:false},_windWarning:false};
  if(night===3)game.windEnabled=scenario.wind_enabled!==false;
  game._initialEvents=[{type:'event',tick:0,name:'night_start',data:{night}}];
  return game;
}
function emit(g,name,data){g.events.push({type:'event',tick:g.tick,name,data});}
function currentTerrain(night,x,z){
  const r=Math.hypot(x,z);
  if(night===1)return r<=40?0:null;
  if(night===2){if(Math.hypot(x,z)<=28||Math.hypot(x-70,z)<=28||(x>=26&&x<=44&&Math.abs(z)<=2))return 0;return null;}
  if(r>45)return null;
  let y=0;if(z>0&&r>=12&&r<=24)y=3;if(r<=8)y=6;
  for(const deg of [30,150]){const a=deg*Math.PI/180,ax=Math.cos(a)*30,az=Math.sin(a)*30,bx=Math.cos(a)*24,bz=Math.sin(a)*24,dx=bx-ax,dz=bz-az,len2=dx*dx+dz*dz,t=clamp(((x-ax)*dx+(z-az)*dz)/len2,0,1),px=ax+t*dx,pz=az+t*dz;if(Math.hypot(x-px,z-pz)<=1.5&&t>=0&&t<=1)y=Math.max(y,t*3);}
  return y;
}
function validNight2Ground(x,z){return currentTerrain(2,x,z)!==null;}
function nearestUnlit(g){return g.lanterns.filter(l=>!l.lit).sort((a,b)=>dist2(g.player.pos,a.pos)-dist2(g.player.pos,b.pos))[0];}
function doHit(g,by){const p=g.player;if(p.invulnTicks>0)return;const lost=Math.min(1,p.flames);p.flames=Math.max(0,p.flames-1);p.invulnTicks=Math.round(TUNING.invuln_s*60)+1;const dropped=Math.min(p.carried,Math.floor(p.carried*TUNING.hit_drop_ratio));p.carried-=dropped;for(let i=0;i<dropped;i++){const a=(i*137.5+g.tick)%360,at=[p.pos[0]+Math.cos(a*Math.PI/180),0,p.pos[2]+Math.sin(a*Math.PI/180)];g.motes.push({id:`M${g._nextMoteId++}`,pos:at,kind:'dropped',ttlTicks:DROPPED_TTL_TICKS});}emit(g,'player_hit',{by,flames:p.flames,dropped,lost});if(by==='fall'){p.pos=startingPosition(g.night);p.vel=[0,0,0];p.vy=0;p.grounded=true;p.dashTicks=0;p.dashVel=[0,0];p.padFlightTicks=0;p.fallCounted=false;}}
function startingPosition(n){return n===3?[0,0,-30]:[0,0,0];}
function sortedShadePoints(g){return shadePoints(g.night).map((p,i)=>({pos:p,i}));}
function spawnShade(g){const max=g.night===1?6:g.night===2?8:10;if(g.shades.length>=max)return;const choices=sortedShadePoints(g).filter(x=>dist2(x.pos,g.player.pos)>=15);const pick=choices.length?choices[Math.floor(g._random()*choices.length)]:sortedShadePoints(g)[0];if(!pick)return;const id=`S${++g._spawnShadeIndex}`;g.shades.push({id,pos:[...pick.pos],state:'spawning',stateTicksLeft:SHADE_WARNING_TICKS,stunUntil:0});emit(g,'shade_spawned',{id});}
function spawnDrifter(g){if(g.drifters.length>=2)return;const ring=shadePoints(g.night),a=Math.floor(g._random()*ring.length),id=`D${++g._spawnDrifterIndex}`;g.drifters.push({id,pos:[...ring[a]],state:'idle',stateTicksLeft:0,stolen:0,stolenAt:[],stoleOnce:false});}
function updateCharms(g){for(const c of g.charms){if(!c.available&&g.sim_tick>=c.respawnTick){c.available=true;c.respawnTick=0;}}}
function scheduleSpawns(g){if(!g.randomShades)return;const t=g.sim_tick;if(g.night===1){if(t>=300&&(t-300)%480===0){spawnShade(g);if(t===300)spawnShade(g);}}else if(g.night===2&&t>0&&t%(7*60)===0)spawnShade(g);else if(g.night===3&&t>0&&t%(6*60)===0)spawnShade(g);}
function spawnMotesAtPositions(g,positions){for(const pos of positions)g.motes.push({id:`M${g._nextMoteId++}`,pos:[...pos],kind:'random',ttlTicks:null});}
function scheduleDrifters(g){if(g.randomDrifters&&g.night>=2&&g.sim_tick>0&&g.sim_tick%1200===0)spawnDrifter(g);}
function updateWind(g){if(g.night!==3||!g.windEnabled){g.wind.active=false;return;}const cycle=g.sim_tick%1800;if(cycle===1680){g.wind.dir_deg=Math.floor(g._random()*360);g.wind.active=false;g._windWarning=true;}if(cycle===0&&g.sim_tick>0){g.wind.active=true;g._windWarning=false;}if(cycle===300){g.wind.active=false;g._windWarning=false;}}
function movePlayer(g,frame,pressed){const p=g.player;
  const [mx0,mz0]=frame.move||[0,0],mag=Math.hypot(mx0,mz0),mx=mag>1?mx0/mag:mx0,mz=mag>1?mz0/mag:mz0,yaw=(frame.cam_yaw_deg||0)*Math.PI/180;
  const wx=mx*Math.cos(yaw)+mz*Math.sin(yaw),wz=-mx*Math.sin(yaw)+mz*Math.cos(yaw),moving=Math.hypot(wx,wz)>1e-6;
  if(moving)p.facing=[wx,wz];
  if(pressed('dash')&&p.dashCdTicks<=0&&p.dashTicks<=0){const dir=moving?[wx,wz]:p.facing;p.dashVel=[dir[0]*TUNING.dash_speed,dir[1]*TUNING.dash_speed];p.dashTicks=Math.round(TUNING.dash_duration_s*60);if(p.charmTicks<=0)p.dashCdTicks=Math.round(TUNING.dash_cooldown_s*60);emit(g,'dash',{});}
  if(pressed('jump')&&p.grounded){p.vy=7.2;p.grounded=false;}
  if(p.grounded){
    if(p.dashTicks>0){p.pos[0]+=p.dashVel[0]*DT;p.pos[2]+=p.dashVel[1]*DT;p.vel=[...p.dashVel];}
    else if(moving){const speed=p.charmTicks>0?7.2:TUNING.player_speed,tx=p.pos[0]+wx*speed*DT,tz=p.pos[2]+wz*speed*DT,ty=currentTerrain(g.night,tx,tz);
      const towerBlocked=g.night===3&&Math.hypot(tx,tz)<2.5;
      if(!towerBlocked&&ty!==null&&ty<=p.pos[1]+.35){p.pos[0]=tx;p.pos[2]=tz;p.vel=[wx*speed,wz*speed];if(ty<p.pos[1]-.05){p.grounded=false;p.vy=0;}else p.pos[1]=ty;}
      else if(!towerBlocked&&ty===null){p.pos[0]=tx;p.pos[2]=tz;p.vel=[wx*speed,wz*speed];p.grounded=false;p.vy=0;}
      else p.vel=[0,0];
    }else p.vel=[0,0];
  }else{
    const padFlight=p.padFlightTicks>0;if(!padFlight&&moving)p.vel=[wx*3.2,wz*3.2];
    p.pos[0]+=(p.vel[0]+(p.dashTicks>0?p.dashVel[0]:0))*DT;p.pos[2]+=(p.vel[1]+(p.dashTicks>0?p.dashVel[1]:0))*DT;
    p.vy-=GRAVITY*DT;p.pos[1]+=p.vy*DT;const floor=currentTerrain(g.night,p.pos[0],p.pos[2]);
    if(floor!==null&&p.vy<=0&&p.pos[1]<=floor){p.pos[1]=floor;p.vy=0;p.grounded=true;p.vel=[0,0];p.padFlightTicks=0;p.fallCounted=false;}
    else if(p.pos[1]<-2&&!p.fallCounted)doHit(g,'fall');
  }
  if(p.dashTicks>0){p.dashTicks--;if(p.dashTicks===0)p.dashVel=[0,0];}
  if(p.grounded){const x=p.pos[0],z=p.pos[2],pads=g.night===2?[[20,0,18,70,0,0],[50,0,-18,0,0,0]]:g.night===3?[[0,3,13,0,0,0]]:[];for(const [px,py,pz,tx,ty,tz]of pads){if(Math.hypot(x-px,z-pz)<=1&&Math.abs(p.pos[1]-py)<=.2){if(g.night===2){const dx=tx-px,dz=tz-pz,d=Math.hypot(dx,dz)||1;p.vel=[dx/d*24,dz/d*24];p.vy=14;}else{p.vel=[0,-8];p.vy=12;}p.pos[1]=py;p.grounded=false;p.padFlightTicks=90;break;}}}
  if(g.wind.active){const a=g.wind.dir_deg*Math.PI/180;p.pos[0]+=Math.cos(a)*2*DT;p.pos[2]+=Math.sin(a)*2*DT;}
}
function collectMotesAndCharms(g){const p=g.player;for(let i=g.motes.length-1;i>=0;i--){const m=g.motes[i];if(dist2(p.pos,m.pos)<=TUNING.pickup_radius){if(p.carried<TUNING.carry_capacity){g.motes.splice(i,1);p.carried++;g.score+=TUNING.score.per_mote;emit(g,'mote_picked',{carried:p.carried});}}}
  for(const c of g.charms){if(c.available&&dist2(p.pos,c.pos)<=TUNING.pickup_radius){c.available=false;c.respawnTick=g.sim_tick+Math.round(TUNING.charm_respawn_s*60);p.charmTicks=Math.round(TUNING.charm_duration_s*60);p.dashCdTicks=0;emit(g,'charm_picked',{charm_id:c.id,charm_ticks:p.charmTicks});}}
}
function interact(g,pressed){if(!pressed('interact'))return;const p=g.player,l=g.lanterns.filter(x=>!x.lit&&dist2(p.pos,x.pos)<=TUNING.interact_radius).sort((a,b)=>dist2(p.pos,a.pos)-dist2(p.pos,b.pos))[0];if(!l||p.carried===0)return;const amount=Math.min(p.carried,TUNING.lantern_cost-l.deposited);if(amount<=0)return;l.deposited+=amount;p.carried-=amount;emit(g,'deposit',{lantern_id:l.id,amount,deposited:l.deposited});if(l.deposited>=TUNING.lantern_cost){l.lit=true;g.score+=TUNING.score.per_lantern;emit(g,'lantern_lit',{lantern_id:l.id});}}
function safeFromLitLamp(g,s){for(const l of g.lanterns){if(!l.lit)continue;const d=dist2(s.pos,l.pos);if(d<TUNING.safe_radius){let dx=s.pos[0]-l.pos[0],dz=s.pos[2]-l.pos[2];if(d<1e-9){dx=1;dz=0;}const k=TUNING.safe_radius/(Math.hypot(dx,dz)||1);s.pos[0]=l.pos[0]+dx*k;s.pos[2]=l.pos[2]+dz*k;return true;}}return false;}
function applyPulse(g,pressed){const p=g.player;if(!pressed('pulse')||p.flames<TUNING.pulse_cost||p.pulseCdTicks>0)return;p.flames-=TUNING.pulse_cost;p.pulseCdTicks=Math.round(TUNING.pulse_cooldown_s*60);const stunned=[];
  for(const s of [...g.shades].sort(shadeIdCompare)){if(dist2(p.pos,s.pos)<=TUNING.pulse_radius){s.state='stunned';s.stateTicksLeft=Math.round(TUNING.pulse_stun_s*60);let dx=s.pos[0]-p.pos[0],dz=s.pos[2]-p.pos[2],d=Math.hypot(dx,dz)||1;s.pos[0]+=dx/d*TUNING.pulse_push_m;s.pos[2]+=dz/d*TUNING.pulse_push_m;stunned.push(s.id);g.score+=TUNING.score.per_pulse_hit;}}
  for(const d of g.drifters){if(dist2(p.pos,d.pos)>TUNING.pulse_radius)continue;if(d.state==='chase'){d.state='flee';d.stateTicksLeft=240;d.fleeFromPulse=true;}else if(d.state==='flee'&&d.stolen>0){for(let i=0;i<d.stolen;i++)g.motes.push({id:`M${g._nextMoteId++}`,pos:[d.pos[0],d.pos[1],d.pos[2]],kind:'dropped',ttlTicks:DROPPED_TTL_TICKS});emit(g,'drifter_drop',{drifter_id:d.id,amount:d.stolen});d.stolen=0;d.stolenAt=[];d.state='removed';d.stateTicksLeft=120;}}
  emit(g,'pulse',{stunned_ids:stunned});
}
function moveShades(g){const p=g.player;for(const s of [...g.shades].sort(shadeIdCompare)){
    if(s.state==='spawning'){if(s.stateTicksLeft<=0){s.state='wander';s.stateTicksLeft=0;}continue;}
    if(s.state==='stunned'){if(s.stateTicksLeft<=0){s.state='recoil';s.stateTicksLeft=18;}continue;}
    if(s.state==='recoil'){if(s.stateTicksLeft<=0){s.state='chase';s.stateTicksLeft=0;}continue;}
    if(s.state==='removed')continue;
    const d=dist2(p.pos,s.pos);if(s.state==='wander'&&d<=24)s.state='chase';else if(s.state==='chase'&&d>32)s.state='wander';
    if(safeFromLitLamp(g,s))continue;
    const dx=p.pos[0]-s.pos[0],dz=p.pos[2]-s.pos[2],len=Math.hypot(dx,dz)||1,spd=s.state==='chase'?TUNING.shade_speed:1.1;s.pos[0]+=dx/len*spd*DT;s.pos[2]+=dz/len*spd*DT;
  }
  g.shades=g.shades.filter(s=>s.state!=='removed');
}
function moveDrifters(g){const p=g.player;for(const d of g.drifters){if(d.state==='removed'){if(d.stateTicksLeft<=0)d._remove=true;continue;}
    if(d.state==='idle'){if(p.carried>=5&&dist2(p.pos,d.pos)<=15&&!d.stoleOnce)d.state='chase';else{const a=(g.sim_tick/45+(Number(d.id.slice(1))||1)*2.4),r=1.1*DT;d.pos[0]+=Math.cos(a)*r;d.pos[2]+=Math.sin(a)*r;}}
    if(d.state==='chase'){const dx=p.pos[0]-d.pos[0],dz=p.pos[2]-d.pos[2],len=Math.hypot(dx,dz)||1;d.pos[0]+=dx/len*TUNING.drifter_speed*DT;d.pos[2]+=dz/len*TUNING.drifter_speed*DT;if(p.carried<5||dist2(p.pos,d.pos)>17)d.state='idle';}
    if(d.state==='flee'){const dx=d.pos[0]-p.pos[0],dz=d.pos[2]-p.pos[2],len=Math.hypot(dx,dz)||1;d.pos[0]+=dx/len*TUNING.drifter_speed*DT;d.pos[2]+=dz/len*TUNING.drifter_speed*DT;if(--d.stateTicksLeft<=0){d.state='removed';d.stateTicksLeft=0;}}
  }g.drifters=g.drifters.filter(d=>!d._remove);
}
function resolveContacts(g){const p=g.player;for(const d of g.drifters){if(d.state==='chase'&&!d.stoleOnce&&dist2(p.pos,d.pos)<=1.2){const amount=Math.min(3,p.carried);if(amount>0){p.carried-=amount;d.stolen=amount;d.stolenAt=Array.from({length:amount},(_,i)=>[p.pos[0]+(i-1.5)*.25,p.pos[1],p.pos[2]]);d.stoleOnce=true;d.state='flee';d.stateTicksLeft=240;emit(g,'drifter_steal',{drifter_id:d.id,amount,carried:p.carried});}}}
  if(p.invulnTicks===0){for(const s of [...g.shades].sort(shadeIdCompare)){if(s.state!=='spawning'&&s.state!=='stunned'&&s.state!=='removed'&&dist2(p.pos,s.pos)<=TUNING.shade_hit_radius){doHit(g,'shade');break;}}}}
function expireMotes(g){for(let i=g.motes.length-1;i>=0;i--){const m=g.motes[i];if(m.ttlTicks===null)continue;if(--m.ttlTicks<=0)g.motes.splice(i,1);}}
function finishGame(g){if(g.lanterns.every(l=>l.lit)){g.state='won';g.wonScore=Math.floor(g.time_left_s)*TUNING.score.per_second_left+g.player.flames*TUNING.score.per_flame_left;g.score+=g.wonScore;g.totalScore+=g.score;emit(g,'game_over',{result:'won',reason:'all_lit'});}else if(g.player.flames<=0){g.state='lost';emit(g,'game_over',{result:'lost',reason:'no_flames'});}else if(g.time_left_s<=0){g.state='lost';emit(g,'game_over',{result:'lost',reason:'dawn'});}}
export function step(g,input={}){
  g.tick++;
  const frame={...g._input,...input},pressed=k=>!!frame[k]&&!g._prev[k];g._input=frame;
  if(pressed('pause')){g.paused=!g.paused;emit(g,g.paused?'paused':'resumed',{});g._prev={...g._prev,pause:!!frame.pause};return g;}
  if(g.paused){g._prev={...g._prev,pause:!!frame.pause};return g;}
  if(g.state!=='playing'){g._prev={jump:!!frame.jump,interact:!!frame.interact,pulse:!!frame.pulse,dash:!!frame.dash,pause:!!frame.pause};return g;}
  g.sim_tick++;
  // 1-2. Advance the fixed step and decrement active timers before gameplay.
  g.time_left_s=Math.max(0,(g.time_left_s??nightDuration(g.night))-DT);
  const p=g.player;for(const k of ['invulnTicks','dashCdTicks','pulseCdTicks','charmTicks'])if(p[k]>0)p[k]--;if(p.charmTicks>0)p.dashCdTicks=0;
  for(const s of g.shades)if(s.stateTicksLeft>0)s.stateTicksLeft--;
  if(g.player.padFlightTicks>0)g.player.padFlightTicks--;
  for(const d of g.drifters)if(d.state==='removed'&&d.stateTicksLeft>0)d.stateTicksLeft--;
  updateCharms(g);updateWind(g);
  // 3-5. Move/jump/pad, pick up, then interact.
  movePlayer(g,frame,pressed);collectMotesAndCharms(g);interact(g,pressed);
  // 6-9. Safety, pulse, pursuers, then ordered contacts.
  applyPulse(g,pressed);moveShades(g);moveDrifters(g);resolveContacts(g);
  // 10. Scheduled entities become active no earlier than the following tick.
  scheduleSpawns(g);scheduleDrifters(g);expireMotes(g);
  // 11. Resolve victory and defeat last.
  finishGame(g);
  g._prev={jump:!!frame.jump,interact:!!frame.interact,pulse:!!frame.pulse,dash:!!frame.dash,pause:!!frame.pause};return g;
}
export function snapshot(g){const p=g.player;return {type:'snapshot',tick:g.tick,sim_tick:g.sim_tick,night:g.night,state:g.paused?'paused':g.state,time_left_s:round(g.time_left_s),score:g.score,total_score:g.totalScore,
  wind:{active:g.wind.active,dir_deg:round(g.wind.dir_deg)},player:{pos:p.pos.map(round),vel:[round(p.vel[0]+(p.dashTicks?p.dashVel[0]:0)),round(p.vy),round(p.vel[1]+(p.dashTicks?p.dashVel[1]:0))],grounded:p.grounded,flames:p.flames,carried:p.carried,invuln:p.invulnTicks>0,dash_cd_s:round(p.dashCdTicks/60),pulse_cd_s:round(p.pulseCdTicks/60),charm_s:round(p.charmTicks/60)},
  lanterns:g.lanterns.map(l=>({id:l.id,pos:l.pos.map(round),lit:l.lit,deposited:l.deposited})),shades:g.shades.map(s=>({id:s.id,pos:s.pos.map(round),state:s.state})),
  motes_active:g.motes.length,motes:g.motes.map(m=>({id:m.id,pos:m.pos.map(round),kind:m.kind,ttl_s:m.ttlTicks===null?null:round(m.ttlTicks/60)})),
  drifters:g.drifters.map(d=>({id:d.id,pos:d.pos.map(round),state:d.state,stolen:d.stolen})),charms:g.charms.map(c=>({id:c.id,pos:c.pos.map(round),available:c.available,respawn_s:c.available?0:round(Math.max(0,c.respawnTick-g.sim_tick)/60)}))};}
