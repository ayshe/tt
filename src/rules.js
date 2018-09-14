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
    if (diff <= 12) return 8;
    if (diff <= 37) return 7;
    if (diff <= 62) return 6;
    if (diff <= 87) return 5;
    if (diff <= 112) return 4;
    if (diff <= 137) return 3;
    if (diff <= 162) return 2;
    if (diff <= 187) return 2;
    if (diff <= 212) return 1;
    if (diff <= 237) return 1;
    return 0;
};

const upsetPoints = (diff) => {
    if (diff <= 12) return 8;
    if (diff <= 37) return 10;
    if (diff <= 62) return 13;
    if (diff <= 87) return 16;
    if (diff <= 112) return 20;
    if (diff <= 137) return 25;
    if (diff <= 162) return 30;
    if (diff <= 187) return 35;
    if (diff <= 212) return 40;
    if (diff <= 237) return 45;
    return 50;
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