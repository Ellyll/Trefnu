var Trefnu;
(function (Trefnu) {
    var Worker;
    (function (Worker) {
        // Quicksort (o enghraifft "Lomuto partition scheme" yn Wicipedia https://en.wikipedia.org/wiki/Quicksort)
        function partition(A, comparer, lo, hi, onswap) {
            const pivot = A[hi];
            let i = lo - 1;
            for (let j = lo; j <= hi - 1; j++) {
                if (comparer(A[j], pivot) < 0) {
                    i++;
                    // const tmp = A[i];
                    // A[i] = A[j];
                    // A[j] = tmp;
                    swap(A, i, j, onswap);
                }
            }
            if (comparer(A[hi], A[i + 1]) < 0) {
                // const tmp = A[hi];
                // A[hi] = A[i+1];
                // A[i+1] = tmp;
                swap(A, hi, i + 1, onswap);
            }
            return i + 1;
        }
        function qs(A, comparer, lo, hi, onswap, onfinish) {
            if (lo < hi) {
                const p = partition(A, comparer, lo, hi, onswap);
                qs(A, comparer, lo, p - 1, onswap, onfinish);
                qs(A, comparer, p + 1, hi, onswap, onfinish);
            }
        }
        function quicksort(array, comparer, onswap, onfinish) {
            qs(array, comparer, 0, array.length - 1, onswap, onfinish);
            onfinish();
        }
        // Bubblesort
        function bubblesort(array, comparer, onswap, onfinish) {
            // Dim angen trefnu
            if (array.length <= 1) {
                onfinish();
                return;
            }
            let max = array.length - 1;
            while (max > 1) {
                let newidiadau = 0;
                for (let i = 1; i <= max; i++) {
                    if (comparer(array[i - 1], array[i]) > 0) {
                        // const tmp = array[i-1];
                        // array[i-1] = array[i];
                        // array[i] = tmp;
                        swap(array, i - 1, i, onswap);
                        newidiadau++;
                    }
                }
                if (newidiadau === 0)
                    break;
                max--;
            }
            onfinish();
        }
        function swap(a, i, j, onswap) {
            if (i >= a.length)
                throw `index out of range: i=${i}, max: ${a.length - 1}`;
            if (j >= a.length)
                throw `index out of range: j=${j}, max: ${a.length - 1}`;
            const tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
            onswap(i, j);
        }
        // Heapsort
        function iParent(i) {
            return Math.floor((i - 1) / 2); //where floor functions map a real number to the smallest leading integer.
        }
        function iLeftChild(i) { return 2 * i + 1; }
        function iRightChild(i) { return 2 * i + 2; }
        function heapify(a, count, comparer, onswap) {
            // (start is assigned the index in 'a' of the last parent node)
            // (the last element in a 0-based array is at index count-1; find the parent of that element)
            let start = iParent(count - 1);
            while (start >= 0) {
                // (sift down the node at index 'start' to the proper place such that all nodes below
                // the start index are in heap order)
                siftDown(a, start, count - 1, comparer, onswap);
                //(go to the next parent node)
                start = start - 1;
            }
            // (after sifting down the root all nodes/elements are in heap order)
        }
        // (Repair the heap whose root element is at index 'start', assuming the heaps rooted at its children are valid)
        function siftDown(a, start, end, comparer, onswap) {
            let root = start;
            while (iLeftChild(root) <= end) {
                let child = iLeftChild(root); // (Left child of root)
                let swp = root; // (Keeps track of child to swap with)
                if (comparer(a[swp], a[child]) < 0)
                    swp = child;
                //(If there is a right child and that child is greater)
                if (child + 1 <= end && comparer(a[swp], a[child + 1]) < 0)
                    swp = child + 1;
                if (swp == root)
                    // (The root holds the largest element. Since we assume the heaps rooted at the
                    // children are valid, this means that we are done.)
                    return;
                else {
                    swap(a, root, swp, onswap);
                    root = swp; //            (repeat to continue sifting down the child now)
                }
            }
        }
        function heapsort(a, comparer, onswap, onfinish) {
            // input: an unordered array a of length count
            const count = a.length;
            // (Build the heap in array a so that largest value is at the root)
            heapify(a, count, comparer, onswap);
            // (The following loop maintains the invariants that a[0:end] is a heap and every element
            //  beyond end is greater than everything before it (so a[end:count] is in sorted order))
            let end = count - 1;
            while (end > 0) {
                // (a[0] is the root and largest value. The swap moves it in front of the sorted elements.)
                swap(a, end, 0, onswap);
                //(the heap size is reduced by one)
                end = end - 1;
                // (the swap ruined the heap property, so restore it)
                siftDown(a, 0, end, comparer, onswap);
            }
            onfinish();
        }
        function selectionsort(a, comparer, onswap, onfinish) {
            /* a[0] to a[n-1] is the array to sort */
            const n = a.length;
            /* advance the position through the entire array */
            /*   (could do j < n-1 because single element is also min element) */
            for (let j = 0; j < n - 1; j++) {
                /* find the min element in the unsorted a[j .. n-1] */
                /* assume the min is the first element */
                let iMin = j;
                /* test against elements after j to find the smallest */
                for (let i = j + 1; i < n; i++) {
                    /* if this element is less, then it is the new minimum */
                    if (comparer(a[i], a[iMin]) < 0) {
                        /* found new minimum; remember its index */
                        iMin = i;
                    }
                }
                if (iMin != j) {
                    swap(a, j, iMin, onswap);
                }
            }
            onfinish();
        }
        addEventListener('message', evt => {
            if (evt.data.type === 'trefnu') {
                const mathTrefniad = evt.data.data.mathTrefniad;
                const rhifLlinell = evt.data.data.rhifLlinell;
                const dataLlinell = evt.data.data.dataLlinell;
                const cyfnewidiadau = [];
                const arCyfnewid = (a, b) => {
                    cyfnewidiadau.push([a, b]);
                };
                const arCwblhau = () => {
                    postMessage({
                        type: 'cwblhawydLlinell',
                        data: {
                            mathTrefniad: mathTrefniad,
                            rhifLlinell: rhifLlinell,
                            cyfnewidiadau: cyfnewidiadau
                        }
                    }, undefined);
                };
                const cymharydd = (a, b) => Math.sign(a.h - b.h);
                switch (mathTrefniad) {
                    case "quicksort":
                        quicksort(dataLlinell, cymharydd, arCyfnewid, arCwblhau);
                        break;
                    case "bubblesort":
                        bubblesort(dataLlinell, cymharydd, arCyfnewid, arCwblhau);
                        break;
                    case "heapsort":
                        heapsort(dataLlinell, cymharydd, arCyfnewid, arCwblhau);
                        break;
                    case "selectionsort":
                        selectionsort(dataLlinell, cymharydd, arCyfnewid, arCwblhau);
                        break;
                    default:
                        console.log('worker wedi derbyn neges trefnu gyda mathTrefnu annisgwyl', evt);
                }
            }
            else {
                console.log('worker wedi derbyn neges annisgwyl', evt);
            }
        });
    })(Worker = Trefnu.Worker || (Trefnu.Worker = {}));
})(Trefnu || (Trefnu = {}));
//# sourceMappingURL=worker.js.map