class Road{
    constructor(x,width,numLane=3){
        const inf=1000000;

        this.x=x;
        this.width=width;
        this.laneCount=numLane;

        this.left=this.x-this.width/2;
        this.right=this.x+this.width/2;
        this.top=inf;
        this.bottom=-inf;
    }
    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for (let i=0; i<this.laneCount+1; i++){
            let x= lerp(this.left,this.right,i/this.laneCount);
            ctx.beginPath();
            if(i>0 && i<this.laneCount){
                ctx.setLineDash([20,20]);
            }
            else{
                ctx.setLineDash([])
            }
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }
    }
}