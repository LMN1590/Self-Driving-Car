class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLength=250;
        this.raySpread=Math.PI/4;
        this.rays=[];
        this.readings=[];
    }
    update(roadBorder){
        this.#castRays();
        this.readings=[];
        for(let i=0;i<this.rayCount;i++){
            //The closest intersection or null if no intersection
            this.readings.push(this.#getReading(this.rays[i],roadBorder));
        }
    }
    #getReading(ray,roadBorder){
        let touches=[];
        for(let i=0;i<roadBorder.length;i++){
            const touch=getIntersection(
                ray[0],
                ray[1],
                roadBorder[i][0],
                roadBorder[i][1]
            );
            //Return {x,y,offset} or null if no intersection
            if(touch){
                touches.push(touch);
            }
        }
        if(touches.length==0){
            return null;
        }
        else{
            //Create a new array from offsets
            const offsets=touches.map(e=>e.offset);
            //Find min of every element in offsets
            const minOffset=Math.min(...offsets);
            //Find the one that has minOffset
            return touches.find(e=>e.offset==minOffset);
        }
    }
    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const angle=lerp(-this.raySpread/2,this.raySpread/2,this.rayCount==1?0.5:i/(this.rayCount-1))+this.car.angle;
            const start={x:this.car.x,y:this.car.y};
            const end={x:this.car.x-Math.sin(angle)*this.rayLength,
                y:this.car.y-Math.cos(angle)*this.rayLength};
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="orange";
            ctx.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();
        }
    }
}