var Trefnu;
(function (Trefnu) {
    const intArHap = (isaf, uchaf) => {
        const min = Math.ceil(isaf);
        const max = Math.floor(uchaf);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    };
    function cymysgu(array) {
        const newydd = array.map(x => x);
        for (let i = newydd.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = newydd[j];
            newydd[j] = newydd[i];
            newydd[i] = tmp;
        }
        return newydd;
    }
    class App {
        cychwyn() {
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext("2d");
            const lluniadydd = new Trefnu.Lluniadydd(context);
            // Gosod y canvas i'r maint mwyaf bosib
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            // Creu data
            const niferColofnau = 50;
            const niferLlinellau = 25;
            const enfys = Trefnu.Enfys.creu(niferColofnau);
            const dataBubblesort = [[]];
            for (let llinell = 0; llinell < niferLlinellau; llinell++) {
                dataBubblesort[llinell] = cymysgu(enfys);
            }
            const dataQuicksort = dataBubblesort.map((llinell) => llinell.map(lliw => lliw));
            const dataHeapsort = dataBubblesort.map((llinell) => llinell.map(lliw => lliw));
            const dataSelectionsort = dataBubblesort.map((llinell) => llinell.map(lliw => lliw));
            const trefniadau = [
                new Trefnu.Trefniad('bubblesort', dataBubblesort),
                new Trefnu.Trefniad('quicksort', dataQuicksort),
                new Trefnu.Trefniad('heapsort', dataHeapsort),
                new Trefnu.Trefniad('selectionsort', dataSelectionsort)
            ];
            lluniadydd.lliniadu(trefniadau);
            const prosesuCyfnewidiau = (i) => {
                let oeddNewid = false;
                trefniadau.forEach(trefn => {
                    const data = trefn.data;
                    const cyfnewidiadau = trefn.cyfnewidiadau;
                    for (let llinell = 0; llinell < cyfnewidiadau.length; llinell++) {
                        const c = cyfnewidiadau[llinell];
                        if (i < c.length) {
                            oeddNewid = true;
                            let [a, b] = c[i];
                            const tmp = data[llinell][a];
                            data[llinell][a] = data[llinell][b];
                            data[llinell][b] = tmp;
                        }
                    }
                });
                lluniadydd.lliniadu(trefniadau);
                if (oeddNewid) {
                    window.requestAnimationFrame(() => prosesuCyfnewidiau(i + 1));
                }
            };
            const handleReceiveMessage = (evt) => {
                if (evt.data.type === 'cwblhawydLlinell') {
                    const trefn = trefniadau.find(t => t.mathTrefniad === evt.data.data.mathTrefniad);
                    if (typeof (trefn) === 'undefined') {
                        console.log('methu darganfod trefniad', evt);
                        return;
                    }
                    const i = evt.data.data.rhifLlinell;
                    trefn.cwblhawyd[i] = true;
                    trefn.cyfnewidiadau[i] = evt.data.data.cyfnewidiadau;
                    if (trefniadau.every(t => t.cwblhawyd.every(x => x))) {
                        // wedi cwblhau bob llinell
                        prosesuCyfnewidiau(0);
                    }
                }
                else {
                    console.log('derbyniwyd neges annisgwyl gan gweithiwr', evt);
                }
            };
            const workerQueue = new Trefnu.WorkerQueue('js/worker.js', 10);
            workerQueue.addEventListener('message', handleReceiveMessage);
            trefniadau.forEach(trefn => {
                for (let i = 0; i < trefn.data.length; i++) {
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
    Trefnu.App = App;
})(Trefnu || (Trefnu = {}));
var Trefnu;
(function (Trefnu) {
    var Enfys;
    (function (Enfys) {
        function creu(nifer) {
            // o https://stackoverflow.com/a/25510241
            const nolLliw = (numOfSteps, step) => {
                let r = 0.0;
                let g = 0.0;
                let b = 0.0;
                let h = step / numOfSteps;
                let i = Math.floor(h * 6);
                let f = h * 6.0 - i;
                let q = 1 - f;
                switch (i % 6) {
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
                return Trefnu.Lliw.oRGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
            };
            const lliwiau = [];
            for (let cam = 0; cam < nifer; cam++) {
                lliwiau.push(nolLliw(nifer, cam));
            }
            return lliwiau;
        }
        Enfys.creu = creu;
    })(Enfys = Trefnu.Enfys || (Trefnu.Enfys = {}));
})(Trefnu || (Trefnu = {}));
var Trefnu;
(function (Trefnu) {
    class Lliw {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            if (!Lliw.ynDilys(r))
                throw Error(`Cydran r annilys: ${r}`);
            if (!Lliw.ynDilys(g))
                throw Error(`Cydran g annilys: ${g}`);
            if (!Lliw.ynDilys(b))
                throw Error(`Cydran b annilys: ${b}`);
            if (!Lliw.ynDilys(a))
                throw Error(`Cydran a annilys: ${a}`);
            const hsl = Lliw.rgbToHsl([r, g, b]);
            this.h = hsl[0];
            this.s = hsl[1];
            this.l = hsl[2];
        }
        static ynDilys(cydran) {
            return cydran >= 0 && cydran <= 255;
        }
        static oRGBA(r, g, b, a) {
            return new Lliw(r, g, b, a);
        }
        static oRGB(r, g, b) {
            return new Lliw(r, g, b, 255);
        }
        static oHex(hex) {
            const str = hex.startsWith("#") ? hex.substr(1) : hex;
            const hyd = str.length;
            // RGB, RGBA, RRGGBB, RRGGBBAA
            let step;
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
            const c = []; // cydrannau
            for (let i = 0; i < hyd; i += step) {
                c.push(parseInt(str.substr(i, step), 16));
            }
            if (c.length < 4)
                c.push(255);
            return new Lliw(c[0], c[1], c[2], c[3]);
        }
        felRGBA() {
            return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        }
        felHex() {
            const hex = d => {
                let str = Number(d).toString(16).toUpperCase();
                return str.length === 1 ? '0' + str : str;
            };
            return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex(this.a)}`;
        }
        // O https://stackoverflow.com/questions/11923659/javascript-sort-rgb-values#11936162
        static rgbToHsl(c) {
            const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return new Array(h * 360, s * 100, l * 100);
        }
    }
    Trefnu.Lliw = Lliw;
})(Trefnu || (Trefnu = {}));
var Trefnu;
(function (Trefnu) {
    class Lluniadydd {
        constructor(context) {
            this._context = context;
        }
        lliniadu(trefniadau) {
            const ctx = this._context;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const niferArDaws = Math.min(2, trefniadau.length);
            const niferLawr = Math.ceil(trefniadau.length / niferArDaws);
            const lled = Math.floor(ctx.canvas.width / niferArDaws);
            const uchder = Math.floor(ctx.canvas.height / niferLawr);
            const maint = Math.floor(Math.min(lled / trefniadau[0].data[0].length, uchder / trefniadau[0].data.length));
            const lledTrefn = maint * trefniadau[0].data[0].length;
            const uchderTrefn = maint * trefniadau[0].data.length;
            const xCychwyn = Math.floor((lled - lledTrefn) / 2.0);
            const yCychwyn = Math.floor((uchder - uchderTrefn) / 2.0);
            ctx.font = `${Math.floor(maint * 2)}px sans-serif`;
            for (let arDraws = 0; arDraws < niferArDaws; arDraws++) {
                for (let lawr = 0; lawr < niferLawr; lawr++) {
                    const i = (arDraws * niferLawr) + lawr;
                    if (i >= trefniadau.length)
                        break;
                    const data = trefniadau[i].data;
                    for (let llinell = 0; llinell < data.length; llinell++) {
                        for (let colofn = 0; colofn < data[llinell].length; colofn++) {
                            const lliw = data[llinell][colofn];
                            ctx.fillStyle = lliw.felRGBA();
                            const x = Math.floor(colofn * maint) + (arDraws * lled);
                            const y = Math.floor(llinell * maint) + (lawr * uchder);
                            ctx.fillRect(x + xCychwyn, y + yCychwyn, Math.ceil(maint), Math.ceil(maint));
                        }
                    }
                    const enw = trefniadau[i].mathTrefniad;
                    const lledTestun = ctx.measureText(enw + ' ').width;
                    ctx.fillStyle = '#000';
                    ctx.fillText(enw, (arDraws * lled) + xCychwyn + lledTrefn - lledTestun, (lawr * uchder) + yCychwyn + (maint * 2));
                }
            }
        }
    }
    Trefnu.Lluniadydd = Lluniadydd;
})(Trefnu || (Trefnu = {}));
var Trefnu;
(function (Trefnu) {
    class Trefniad {
        constructor(mathTrefniad, data) {
            this.cwblhawyd = [];
            this.cyfnewidiadau = [];
            this.mathTrefniad = mathTrefniad;
            this.data = data;
        }
    }
    Trefnu.Trefniad = Trefniad;
})(Trefnu || (Trefnu = {}));
var Trefnu;
(function (Trefnu) {
    class WorkerQueue {
        constructor(path, numberOfWorkers = 3) {
            const _numberOfWorkers = numberOfWorkers;
            this._workers = [];
            for (let i = 0; i < _numberOfWorkers; i++) {
                const worker = new Worker(path);
                worker.onmessage = this._handleMessageEvent.bind(this);
                this._workers.push(worker);
            }
            this.nextMessageId = 1;
            this.nextWorkerIndex = 0;
            this._messageListeners = [];
        }
        get numberOfWorkers() {
            return this._workers.length;
        }
        postMessage(type, data, extraData) {
            const id = this.nextMessageId++;
            const workerId = this.nextWorkerIndex++;
            if (this.nextWorkerIndex >= this._workers.length)
                this.nextWorkerIndex = 0;
            const message = { id, type, data, workerId, extraData };
            this._workers[workerId].postMessage(message);
            return id;
        }
        _handleMessageEvent(evt) {
            this._messageListeners.forEach(listener => listener(evt));
        }
        addEventListener(type, listener) {
            if (type != 'message')
                throw Error(`Unknown event type: ${type}`);
            if (this._messageListeners.indexOf(listener) === -1) {
                this._messageListeners.push(listener);
            }
        }
        removeEventListener(type, listener) {
            if (type != 'message')
                throw Error(`Unknown event type: ${type}`);
            const index = this._messageListeners.indexOf(listener);
            if (index !== -1) {
                this._messageListeners.splice(index, 1);
            }
        }
    }
    Trefnu.WorkerQueue = WorkerQueue;
})(Trefnu || (Trefnu = {}));
//# sourceMappingURL=app.js.map