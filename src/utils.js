exports.sumArray = (array) => {
    return array.reduce((a, b) => a + b, 0);
}

exports.dropLowestNInArray = (array, n) => {
    for (let i = 0; i < n; i++)  {
        const lowest = array.reduce((a, b) => Math.min(a, b), array[0]);
        array.splice(array.indexOf(lowest, 1));
    }
    return array;
}