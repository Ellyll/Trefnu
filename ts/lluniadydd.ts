namespace Trefnu {
    export class Lluniadydd {
        private _context : CanvasRenderingContext2D;

        constructor(context: CanvasRenderingContext2D) {
            this._context = context;
        }

        lliniadu(trefniadau : Trefniad[]) {
            const ctx = this._context;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            const niferArDaws = Math.min(2, trefniadau.length);
            const niferLawr = Math.ceil(trefniadau.length / niferArDaws);

            const lled = Math.floor(ctx.canvas.width/niferArDaws);
            const uchder = Math.floor(ctx.canvas.height/niferLawr);
            const maint = Math.floor(Math.min(lled/trefniadau[0].data[0].length, uchder/trefniadau[0].data.length));
            const lledTrefn = maint*trefniadau[0].data[0].length;
            const uchderTrefn = maint*trefniadau[0].data.length;
            const xCychwyn = Math.floor((lled - lledTrefn)/2.0);
            const yCychwyn = Math.floor((uchder - uchderTrefn)/2.0);


            ctx.font = `${Math.floor(maint*2)}px sans-serif`;           

            for (let arDraws = 0; arDraws<niferArDaws ; arDraws++) {
                for (let lawr = 0; lawr<niferLawr ; lawr++) {
                    const i = (arDraws*niferLawr) + lawr;
                    if (i >= trefniadau.length)
                        break;
                    const data = trefniadau[i].data;                   

                    for (let llinell=0; llinell < data.length ; llinell++) {
                        for (let colofn = 0 ; colofn < data[llinell].length ; colofn++) {
                            const lliw = data[llinell][colofn];
                            ctx.fillStyle = lliw.felRGBA();
                            const x = Math.floor(colofn*maint)+(arDraws*lled);
                            const y = Math.floor(llinell*maint)+(lawr*uchder);
                            ctx.fillRect(x+xCychwyn, y+yCychwyn, Math.ceil(maint), Math.ceil(maint));
                        }
                    }

                    const enw = trefniadau[i].mathTrefniad;
                    const lledTestun = ctx.measureText(enw + ' ').width;
                    ctx.fillStyle = '#000';
                    ctx.fillText(enw, (arDraws*lled) + xCychwyn + lledTrefn - lledTestun, (lawr*uchder) + yCychwyn + (maint*2));
                }
            }

        }
    }
}