namespace Trefnu {
    export class Lliw {

        public readonly h : number;
        public readonly s : number;
        public readonly l : number; 

        private constructor(readonly r: number, readonly g: number, readonly b: number, readonly a: number) {
            if (!Lliw.ynDilys(r)) throw Error(`Cydran r annilys: ${r}`);
            if (!Lliw.ynDilys(g)) throw Error(`Cydran g annilys: ${g}`);
            if (!Lliw.ynDilys(b)) throw Error(`Cydran b annilys: ${b}`);
            if (!Lliw.ynDilys(a)) throw Error(`Cydran a annilys: ${a}`);

            const hsl = Lliw.rgbToHsl([r,g,b]);
            this.h = hsl[0];
            this.s = hsl[1];
            this.l = hsl[2];
        }

        private static ynDilys(cydran: number) : boolean {
            return cydran >= 0 && cydran <=255;
        }

        static oRGBA(r: number, g: number, b: number, a: number) : Lliw {            
            return new Lliw(r, g, b, a);
        }

        static oRGB(r: number, g: number, b: number) : Lliw {            
            return new Lliw(r, g, b, 255);
        }

        static oHex(hex: string) : Lliw {
            const str = hex.startsWith("#") ? hex.substr(1) : hex;
            const hyd = str.length;

            // RGB, RGBA, RRGGBB, RRGGBBAA
            let step : number;
            switch (hyd) {
                case 3:
                case 4:
                    step = 1;
                    break;
                case 6:
                case 8:
                    step = 2;
                    break;
                default:
                    throw Error(`Fformat lliw anhywir: ${hex}`);
            }

            const c : number[] = []; // cydrannau
            for (let i=0; i<hyd ; i += step) {
                c.push(parseInt(str.substr(i,step), 16));
            }
            if (c.length < 4) c.push(255);

            return new Lliw(c[0], c[1], c[2], c[3]);
        }

        felRGBA() : string {
            return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        }

        felHex() : string {
            const hex = d => {
                let str = Number(d).toString(16).toUpperCase();
                return str.length === 1 ? '0' + str : str;
            };
            return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex(this.a)}`;
        }

        // O https://stackoverflow.com/questions/11923659/javascript-sort-rgb-values#11936162
        private static rgbToHsl(c) {
            const r = c[0]/255, g = c[1]/255, b = c[2]/255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
          
            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
              h /= 6;
            }
            return new Array(h * 360, s * 100, l * 100);
        }
    }
}