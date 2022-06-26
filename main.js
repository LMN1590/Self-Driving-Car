var timer=5000;
if(localStorage.getItem("timer")){
    timer=JSON.parse(localStorage.getItem("timer"));
}
console.log(timer);
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=400;

const laneCount=3;
const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");
const road=new Road(carCanvas.width/2,carCanvas.width*0.9,laneCount);

const traffic=[]
for(let i=0;i<laneCount;i++){
    traffic.push(new Car(road.getMiddleLane(i),Math.random()*300-300,30,50,"DUMMY",Math.random()*5+5))
}
const cars=generateCars(1000);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
            NeuralNetworks.mutate(cars[i].brain,Math.random());
        }
    }
}
setTimeout("reset(timer);", timer);
setTimeout("addTraffic(bestCar);", 4000);
animate()

function save(){
    localStorage.setItem(
        "bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("timer");
    timer=5000;
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getMiddleLane(1),100,30,50,"AI",15));
    }
    return cars;
}

function animate(time){
    //Update all cars
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.border,traffic);
    }
    bestCar=cars.find(
        c=> c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.border,[]);
    }
    //Setting up Canvas
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.8);

    //Drawing all cars
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"brown");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"turquoise",true);
    //Resetting
    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;

    //Drawing network
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
function reset(timer){
    timer+=100;
    if(timer>15000) timer=15000;
    localStorage.setItem(
        "timer",
        JSON.stringify(timer)
    );
    if(localStorage.getItem("bestBrain")){
        bestCar.brain=NeuralNetworks.merge(
            JSON.parse(localStorage.getItem("bestBrain")),
            bestCar.brain
        );
    }
    save();
    location.reload(true);
}
function addTraffic(bestCarLocal){
    for(let i=0;i<laneCount;i++){
        traffic.push(new Car(road.getMiddleLane(i),Math.random()*300-1000+bestCarLocal.y,30,50,"DUMMY",Math.random()*5+5))
    }
    setTimeout("addTraffic(bestCar);", 2000);
}