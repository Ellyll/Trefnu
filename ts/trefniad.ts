namespace Trefnu {

    export class Trefniad {
        mathTrefniad : string;
        data : Lliw[][];
        cwblhawyd : boolean[] = [];
        cyfnewidiadau : number[][][] = [];
        constructor(mathTrefniad : string, data : Lliw[][]) {
            this.mathTrefniad = mathTrefniad;
            this.data = data;
        }
    }

}