var insertSorted = function(arr, obj) {
	var mid, val,
		insertIndice = 0,
		target = obj.depth,
		high = arr.length-1,
		low = 0;

	while (high >= low) {
		mid = Math.floor(0.5*(high+low));
		val = arr[mid].depth;
		insertIndice = mid;

		if (high === low) {
			if (target > val) {
				insertIndice = low + 1;
			}
			break;
		}
		
		if (target < val) {
			high = mid;
		} else if (val < target) {
			low = mid + 1;
		} else {
			break;
		}
	}

	arr.splice(insertIndice, 0, obj);
	return arr;
};

var m = function(n) {
	return {
		depth: n
	};
};

for (var i = 0; i < 20; i++) {
	var foo = [];
	for (var j = 0; j < 500; j++) {
		insertSorted(foo, m(Math.floor(Math.random()*1000)));
	}

	for (var k = 0; k < foo.length-1; k++) {
		if (foo[k] > foo[k+1]) {
			console.log('shit there is an error');
		}
	}
}