const canvas=document.getElementById("myCanvas");
const laneCount=7;
canvas.width=750;

const ctx=canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9,laneCount);

const traffic=[]
for(let i=0;i<laneCount;i++){
    traffic.push(new Car(road.getMiddleLane(i),Math.random()*200-400,30,50,"DUMMY",Math.random()*5))
}
const car=new Car(road.getMiddleLane(Math.floor(laneCount/2)),0,30,50,"KEY",10)
animate()

function animate(){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.border,[]);
    }
    car.update(road.border,traffic);
    canvas.height=window.innerHeight
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.8);

    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx,"brown");
    }
    car.draw(ctx,"blue");
    
    ctx.restore();
    
    requestAnimationFrame(animate);
}