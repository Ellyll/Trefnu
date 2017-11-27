namespace Trefnu {

    const intArHap = (isaf, uchaf) => {
        const min = Math.ceil(isaf);
        const max = Math.floor(uchaf);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    };

    function cymysgu<T>(array: T[]): T[] {
        const newydd = array.map(x => x);
    
        for (let i = newydd.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = newydd[j];
            newydd[j] = newydd[i];
            newydd[i] = tmp;
        }
        return newydd;
    }

    export class App {
        cychwyn() {
            const canvas = <HTMLCanvasElement>document.getElementById("canvas");
            const context = canvas.getContext("2d");
            const lluniadydd = new Lluniadydd(context);            

            // Gosod y canvas i'r maint mwyaf bosib
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;

            // Creu data
            const niferColofnau = 50;
            const niferLlinellau = 25;
            const enfys = Enfys.creu(niferColofnau);
            const dataBubblesort : [Lliw[]] = [ [] ];
            for (let llinell = 0 ; llinell < niferLlinellau; llinell++) {
                dataBubblesort[llinell] = cymysgu(enfys);
            }

            const dataQuicksort = dataBubblesort.map( (llinell) => llinell.map(lliw => lliw));
            const dataHeapsort = dataBubblesort.map( (llinell) => llinell.map(lliw => lliw));
            const dataSelectionsort = dataBubblesort.map( (llinell) => llinell.map(lliw => lliw));

            const trefniadau : Trefniad[] = [
                new Trefniad('bubblesort', dataBubblesort),
                new Trefniad('quicksort', dataQuicksort),
                new Trefniad('heapsort', dataHeapsort),
                new Trefniad('selectionsort', dataSelectionsort)
            ];


            lluniadydd.lliniadu(trefniadau);


            const prosesuCyfnewidiau = (i : number) => {
                let oeddNewid = false;

                trefniadau.forEach(trefn => {
                    const data = trefn.data;
                    const cyfnewidiadau = trefn.cyfnewidiadau;
                    for (let llinell = 0; llinell<cyfnewidiadau.length; llinell++) {
                        const c = cyfnewidiadau[llinell];
                        if (i < c.length) {
                            oeddNewid = true;
                            let [a,b] = c[i];
                            const tmp = data[llinell][a];
                            data[llinell][a] = data[llinell][b];
                            data[llinell][b] = tmp;
                        }
                    }    
                });
                
                lluniadydd.lliniadu(trefniadau);
                if (oeddNewid) {
                    window.requestAnimationFrame(() => prosesuCyfnewidiau(i+1));
                }
            };

            const handleReceiveMessage = (evt) => {
                if (evt.data.type === 'cwblhawydLlinell') {
                    const trefn = trefniadau.find(t => t.mathTrefniad === evt.data.data.mathTrefniad);
                    if (typeof(trefn) === 'undefined') {
                        console.log('methu darganfod trefniad', evt);
                        return;
                    }

                    const i = evt.data.data.rhifLlinell;
                    trefn.cwblhawyd[i] = true;
                    trefn.cyfnewidiadau[i] = evt.data.data.cyfnewidiadau;
                    if (trefniadau.every(t =>t.cwblhawyd.every(x => x))) {
                        // wedi cwblhau bob llinell
                        prosesuCyfnewidiau(0);
                    }
                } else {
                    console.log('derbyniwyd neges annisgwyl gan gweithiwr', evt);
                }
            };

            const workerQueue = new WorkerQueue('js/worker.js', 10);
            workerQueue.addEventListener('message', handleReceiveMessage);

            trefniadau.forEach(trefn => {
                for (let i=0; i<trefn.data.length; i++) {
                    trefn.cwblhawyd.push(false);
                    trefn.cyfnewidiadau.push([[]]);                    
                    workerQueue.postMessage('trefnu', {
                        mathTrefniad: trefn.mathTrefniad,
                        rhifLlinell: i,
                        dataLlinell: trefn.data[i]
                    }, undefined);
                }    
            });

        }
    }
}