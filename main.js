const canvas=document.getElementById("myCanvas");
const laneCount=3;
canvas.width=500;

const ctx=canvas.getContext("2d")
const road=new Road(canvas.width/2,canvas.width*0.9,laneCount);
const car=new Car(road.getMiddleLane(Math.floor(laneCount/2)),0,30,50)
car.draw(ctx)

animate()

function animate(){
    car.update();
    canvas.height=window.innerHeight
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.8);
    
    road.draw(ctx);
    car.draw(ctx);
    
    ctx.restore();
    
    requestAnimationFrame(animate);
}