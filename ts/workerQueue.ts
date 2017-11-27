namespace Trefnu {
    export class WorkerQueue {
    
        private _workers : Worker[];
        private _messageListeners : any[];
        public nextMessageId : number;
        public nextWorkerIndex : number;

        public constructor(path, numberOfWorkers = 3) {
            const _numberOfWorkers = numberOfWorkers;
            this._workers = [];
            for (let i=0 ; i<_numberOfWorkers ; i++) {
                const worker = new Worker(path);
                worker.onmessage = this._handleMessageEvent.bind(this);
                this._workers.push(worker);
            }
            this.nextMessageId = 1;
            this.nextWorkerIndex = 0;
            this._messageListeners = [];
        }
    
        public get numberOfWorkers() {
            return this._workers.length;
        }
    
        public postMessage(type, data, extraData) {
            const id = this.nextMessageId++;
            const workerId = this.nextWorkerIndex++;
            if (this.nextWorkerIndex >= this._workers.length) this.nextWorkerIndex = 0;
            const message = { id, type, data, workerId, extraData };
            this._workers[workerId].postMessage(message);
            return id;
        }
    
        private _handleMessageEvent(evt) {
            this._messageListeners.forEach(listener => listener(evt));
        }
    
        public addEventListener(type, listener) {
            if (type != 'message') throw Error(`Unknown event type: ${type}`);
            if (this._messageListeners.indexOf(listener) === -1) {
                this._messageListeners.push(listener);
            }
        }
    
        public removeEventListener(type, listener) {
            if (type != 'message') throw Error(`Unknown event type: ${type}`);
                const index = this._messageListeners.indexOf(listener)
                if (index !== -1) {
                this._messageListeners.splice(index, 1);
            }
        }
    
    }
}