const carCanvas=document.getElementById("carCanvas");
carCanvas.width=400;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=400;

const laneCount=3;
const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");
const road=new Road(carCanvas.width/2,carCanvas.width*0.9,laneCount);

const traffic=[]
for(let i=0;i<laneCount;i++){
    traffic.push(new Car(road.getMiddleLane(i),Math.random()*200-400,30,50,"DUMMY",Math.random()*5))
}
const car=new Car(road.getMiddleLane(Math.floor(laneCount/2)),0,30,50,"AI",7);
animate()

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getMiddleLane(1),100,30,50,"AI",7));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.border,[]);
        if(Math.abs(traffic[i].y-car.y)>800) {
            traffic.splice(i,1);
            traffic.splice(i,0,new Car(road.getMiddleLane(i),Math.random()*200-800+car.y,30,50,"DUMMY",Math.random()*5))
        }

    }
    car.update(road.border,traffic);
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.8);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"brown");
    }
    car.draw(carCtx,"blue");
    
    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,car.brain);
    requestAnimationFrame(animate);
}