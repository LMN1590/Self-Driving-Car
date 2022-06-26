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
    traffic.push(new Car(road.getMiddleLane(i),100-400,30,50,"DUMMY",5))
}
const cars=generateCars(100);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    bestCar.brain=JSON.parse(
        localStorage.getItem("bestBrain")
    );
}
animate()

function save(){
    localStorage.setItem(
        "bestBrain",
        JSON.stringify(bestCar.brain)
    );
    console.log("saved");
    console.log(localStorage.getItem("bestBrain"));
}

function discard(){
    localStorage.removeItem("bestBrain");
    console.log(localStorage.getItem("bestBrain"));
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getMiddleLane(1),100,30,50,"AI",7));
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
        if(Math.abs(traffic[i].y-bestCar.y)>800) {
            traffic.splice(i,1);
            traffic.splice(i,0,new Car(road.getMiddleLane(i),100-800+bestCar.y,30,50,"DUMMY",5));
        }

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