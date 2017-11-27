namespace Trefnu.Enfys {
    export function creu(nifer : number) : Lliw[] {
        // o https://stackoverflow.com/a/25510241
        const nolLliw = (numOfSteps : number, step : number) : Lliw => {
            let r = 0.0;
            let g = 0.0;
            let b = 0.0;
            let h = step / numOfSteps;
            let i = Math.floor(h * 6);
            let f = h * 6.0 - i;
            let q = 1 - f;

            switch (i % 6)
            {
                case 0:
                    r = 1;
                    g = f;
                    b = 0;
                    break;
                case 1:
                    r = q;
                    g = 1;
                    b = 0;
                    break;
                case 2:
                    r = 0;
                    g = 1;
                    b = f;
                    break;
                case 3:
                    r = 0;
                    g = q;
                    b = 1;
                    break;
                case 4:
                    r = f;
                    g = 0;
                    b = 1;
                    break;
                case 5:
                    r = 1;
                    g = 0;
                    b = q;
                    break;
            }
            return Lliw.oRGB(Math.round(r*255), Math.round(g*255), Math.round(b*255));
        };

        const lliwiau : Lliw[] = [];
        for (let cam=0 ; cam<nifer ; cam++) {
            lliwiau.push(nolLliw(nifer, cam));
        }
        return lliwiau;
    }
}