const difference = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return (a[0] + a[1] - b[0] - b[1]) / 2;
    } else {
        return a - b;
    }
};

const isGreaterThan = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return (a[0] + a[1]) > (b[0] + b[1]);
    } else {
        return a > b;
    }
};

const winPoints = (diff) => {
    if (diff < 25) return 10;
    if (diff < 50) return 9;
    if (diff < 75) return 8;
    if (diff < 100) return 7;
    if (diff < 125) return 6;
    if (diff < 150) return 5;
    if (diff < 175) return 4;
    if (diff < 200) return 3;
    if (diff < 225) return 2;
    if (diff < 250) return 1;
    return 0;
};

const upsetPoints = (diff) => {
    if (diff < 25) return 10;
    if (diff < 50) return 12;
    if (diff < 75) return 14;
    if (diff < 100) return 16;
    if (diff < 125) return 19;
    if (diff < 150) return 22;
    if (diff < 175) return 26;
    if (diff < 200) return 31;
    if (diff < 225) return 37;
    if (diff < 250) return 44;
    return 52;
};

export const points = (a, b) => {
    let diff, win, upset;
    if (isGreaterThan(a, b)) {
        diff = difference(a, b);
        win = winPoints(diff);
        upset = upsetPoints(diff);
    } else {
        diff = difference(b, a);
        win = upsetPoints(diff);
        upset = winPoints(diff);
    }
    return {win, upset};
};