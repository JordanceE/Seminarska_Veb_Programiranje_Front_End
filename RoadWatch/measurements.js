import { SCALE_REAL } from "./car.js"

export function createMeasurements(state) {
    function draw() {
        const {ctx}=state; ctx.strokeStyle=ctx.fillStyle="yellow"
        state.measurements.forEach(m=>{ if(m.x2==null)return; ctx.beginPath();ctx.moveTo(m.x1,m.y1);ctx.lineTo(m.x2,m.y2);ctx.stroke(); const d=Math.hypot(m.x2-m.x1,m.y2-m.y1)/SCALE_REAL;if(!m.manual)m.len=d;ctx.fillText(`${m.len.toFixed(2)} m`,(m.x1+m.x2)/2,(m.y1+m.y2)/2) })
    }
    function drawVehicleDistances() {
        if(state.selectedCar)return; const {ctx}=state;ctx.strokeStyle=ctx.fillStyle="#00ffff";let changed=false
        for(let i=0;i<state.cars.length;i++)for(let j=i+1;j<state.cars.length;j++){const a=state.cars[i],b=state.cars[j],key=`${a.vehicleData.name}_${b.vehicleData.name}`;if(state.vehicleDistances[key]==null){state.vehicleDistances[key]=Math.hypot(a.x-b.x,a.y-b.y)/SCALE_REAL;changed=true}ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillText(`${state.vehicleDistances[key].toFixed(2)} m`,(a.x+b.x)/2,(a.y+b.y)/2)}
        if(changed)updateList()
    }
    function updateList() {
        const list=document.getElementById("measureList");list.innerHTML=""
        const add=(label,value,set,color)=>{const row=document.createElement("div");row.style.cssText="display:flex;align-items:center;gap:6px";const span=document.createElement("span");span.style.color=color;span.textContent=label;const input=document.createElement("input");input.type="number";input.step="0.01";input.value=value.toFixed(2);input.style.width="60px";input.oninput=()=>set(parseFloat(input.value));row.append(span,input," m");list.append(row)}
        state.measurements.forEach(m=>{if(m.len!=null){const label=m.fromVehicleName||m.from;add(label?`🟡 ${label} → point: `:"🟡 ",m.len,v=>{m.len=v;m.manual=true},"yellow")}})
        Object.entries(state.vehicleDistances).forEach(([k,v])=>add(`🔵 ${k.split("_").join(" ↔ ")}: `,v,n=>state.vehicleDistances[k]=n,"#00ffff"))
    }
    return {draw,drawVehicleDistances,updateList}
}
