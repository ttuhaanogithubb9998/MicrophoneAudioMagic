function main() {
    const snail = document.getElementById('snail');
    const widthCanvas = window.innerWidth;
    const heightCanvas = window.innerHeight;
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    console.log(heightCanvas)
    canvas.width = 1000;
    canvas.height = 500;
    snail.style.transform = `scale(0.58, 0.58) translate(-${canvas.width / 2*0.1}px, -${canvas.height / 2*0.3}px)  `
    

    class Bar {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput, i) {
            const sound = micInput * (100 + i);
            if (sound > this.height) {
                this.height = sound;
            } else {
                this.height -= this.height * 0.08;
            }

        }
        draw(context, volume) {
            context.strokeStyle = this.color;
            context.save();
            context.lineWidth = 0.4

            context.rotate(this.index * 0.03);

            context.scale(1 + volume * 0.3, 1 + volume * 0.3);


            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.y, this.y * 0.2);
            context.stroke();

            context.lineWidth = 1
            context.strokeRect(this.x, this.y, this.y / fftSize * 15, 1)
            context.lineWidth = 1
            context.strokeRect(this.y, this.y * 0.2, this.height + this.y * 2 / fftSize * 2 * 20, this.y / fftSize * 2 * 5)
            context.fill();

            context.beginPath();
            context.fillStyle = this.color
            context.lineWidth = 0;
            context.arc(this.y + this.height + this.y * 2 / fftSize * 2 * 40, this.y * 0.2 + this.y / fftSize * 2 * 5 * 2 - 5, this.y / fftSize * 2 * 5 / 2, 0, Math.PI * 2)
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
            let color = `hsl(${i * 360 / (fftSize / 2) + 180},100%,50%)`
            bars.push(new Bar(0, i, 10, 50, color, i))
        }
    }
    createBars();
    let a = 0;
    function animate() {
        if (microphone.initialized) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            const volume = microphone.getVolume();
            a += 0.0008;
            ctx.save();


            // ctx.translate(canvas.width / 2 * 0.9, canvas.height / 2 * 1.138);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(0.58, 0.58)
            ctx.rotate(10);
            bars.forEach((bar, i) => {
                bar.update(samples[i], i);
                bar.draw(ctx, volume);
            })
            ctx.restore();
        }

        requestAnimationFrame(animate);
    }
    animate();
}