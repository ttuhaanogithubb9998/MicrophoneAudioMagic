function main() {
    const widthCanvas = window.innerWidth;
    const heightCanvas = window.innerHeight;
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    console.dir(canvas);
    canvas.width = widthCanvas;
    canvas.height = heightCanvas;



    class Bar {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput) {
            const sound = micInput * 200;
            if (sound > this.height) {
                this.height = sound;
            } else {
                this.height -= this.height * 0.03;
            }
        }
        draw(context, volume) {
            // var r = (100 + volume*50 )
            // var a = this.y/(fftSize/2) *r;
            // var b = Math.sqrt(r*r - a*a)
            // var c = a + this.height * a * 0.03;
            // var d = b + this.height * b * 0.03
            context.strokeStyle = this.color;
            context.save();
            context.lineWidth =0.2

            // context.rotate(this.index*0.0152/4);
            context.rotate(this.index*0.035);

            context.scale(1+volume*0.2,1+volume*0.2);

            // context.beginPath();
            // context.moveTo(0, 0);
            // context.lineTo(d, c);
            // context.stroke();

            context.beginPath();
            context.moveTo(this.x,this.y);
            context.lineTo(this.y,this.y*0.5);
            context.stroke();
            context.lineWidth=1
            context.strokeRect(this.y,this.y*0.5,this.height+this.y/fftSize*2*20,this.y/fftSize*2*5)
            context.fill();

            context.beginPath();
            context.fillStyle =this.color
            context.lineWidth=0
            context.arc(this.y+this.height+this.y/fftSize*2*40,this.y*0.5+this.y/fftSize*2*5*2-5,this.y/fftSize*2*5/2,0,Math.PI*2)
            context.fill();
            context.stroke();
            
            
            context.restore();
        }
    }
    const fftSize = 512;
    const microphone = new Microphone(fftSize);

    bars = [];
    function createBars() {
        for (let i = 0; i < (fftSize / 2); i++) {
            let color = `hsl(${i * 360 / (fftSize / 2)},100%,50%)`
            bars.push(new Bar(0, i, 10, 50, color, i))
        }
    }
    createBars();
    let a = 0;
    function animate() {
        if (microphone.initialized) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            const volume =microphone.getVolume();
            a += 0.0008;
            ctx.save();


            ctx.translate(canvas.width/2 , canvas.height / 2);
            ctx.scale(0.8,0.8)
            // ctx.rotate(volume*0.02+a);
            ctx.rotate(5);
            // ctx.rotate(6.283161128176487/2);
            bars.forEach((bar, i) => {
                bar.update(samples[i]);
                bar.draw(ctx, volume);
            })
            // ctx.fillStyle = 'gold'
            // ctx.beginPath();
            // ctx.arc(0, 0, 100 + volume * 50, 0, Math.PI * 2);
            // ctx.fill();
            // ctx.stroke();
            ctx.restore();
        }

        requestAnimationFrame(animate);
    }
    animate();
}