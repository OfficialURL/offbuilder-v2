import * as math from "../classes/math.js";

const neg = x => -x;

export const tetswirl = function(n) {
    const coords = [];

    for(let k = 0; k < n; k++) {
        const cos1 = math.cos(k, 2 * n),
            sin1 = math.sin(k, 2 * n);

        const c = [0, 0, sin1, cos1];
        coords.push(c, c.map(neg));
        
        const k1 = Math.sqrt(6) / 3, k2 = Math.sqrt(3) / 3;
        for(let i = 0; i < 3; i++) {
            const cos2 = math.cos(3 * k + i * 2 * n, 6 * n),
                sin2 = math.sin(3 * k + i * 2 * n, 6 * n);

            const c = [k1 * cos2, k1 * sin2, k2 * cos1, k2 * sin1];
            coords.push(c, c.map(neg));
        }
    }

    return coords;
}
globalThis.tetswirl = tetswirl;

export const cubeswirl = function(n) {
    const coords = [];
    const k1 = Math.sqrt(3 + Math.sqrt(3)),
        k2 = Math.sqrt(3 - Math.sqrt(3));

    for(let k = 0; k < 2 * n; k++) {
        const cos1 = math.cos(k, 4 * n),
            sin1 = math.sin(k, 4 * n),
            cos2 = math.cos(2 * k + n, 8 * n),
            sin2 = math.sin(2 * k + n, 8 * n);

        for(let i = 0; i < 4; i++) {
            const cos1_ = math.cos(k + i * n, 4 * n),
                sin1_ = math.sin(k + i * n, 4 * n),
                cos2_ = math.cos(2 * k + (2 * i + 1) * n, 8 * n),
                sin2_ = math.sin(2 * k + (2 * i + 1) * n, 8 * n);

            const c1 = [cos1_ / k1, sin1_ / k1, cos1 / k2, sin1 / k2];
            coords.push(c1, c1.map(neg));

            const c2 = [cos2_ / k2, sin2_ / k2, cos2 / k1, sin2 / k1];
            coords.push(c2, c2.map(neg));
        }
    }

    return coords;
}
globalThis.cubeswirl = cubeswirl;

export const octswirl = function(n) {
    const coords = [];
    const k1 = Math.SQRT2;

    for(let k = 0; k < 2 * n; k++) {
        const cos = math.cos(k, 4 * n),
            sin = math.sin(k, 4 * n),
            cos1 = math.cos(2 * k + n, 8 * n),
            sin1 = math.sin(2 * k + n, 8 * n);

        const c1 = [cos, sin, 0, 0];
            coords.push(c1, c1.map(neg));
            
        const c2 = [0, 0, cos, sin];
            coords.push(c2, c2.map(neg));

        for(let i = 0; i < 4; i++) {
            const cos2 = math.cos(2 * k + (2 * i + 1) * n, 8 * n),
                sin2 = math.sin(2 * k + (2 * i + 1) * n, 8 * n);

            const c1 = [cos2 / k1, sin2 / k1, cos1 / k1, sin1 / k1];
            coords.push(c1, c1.map(neg));
        }
    }

    return coords;
}
globalThis.octswirl = octswirl;

export const prismswirl = function(m, n, a, b) {
    a ||= 1; b ||= 1;
    
    const coords = [];

    for(let k = 0; k < m * n; k++) {
        const cos = math.cos(k, m * n),
            sin = math.sin(k, m * n);

        for(let i = 0; i < m; i++) {
            const cos_ = math.cos(k + i * n, m * n),
                sin_ = math.sin(k + i * n, m * n);

            coords.push([a * cos_, a * sin_, b * cos, b * sin]);
            coords.push([b * cos_, b * sin_, a * cos, a * sin]);
        }
    }

    return coords;
}
globalThis.prismswirl = prismswirl;

export const antiprismswirl = function(m, n, a, b) {
    a ||= 1; b ||= 1;
    
    const coords = [];

    for(let k = 0; k < m * n; k++) {
        const cos = math.cos(k, m * n),
            sin = math.sin(k, m * n);

        for(let i = 0; i < m; i++) {
            const cos1 = math.cos(k + i * n, m * n),
                sin1 = math.sin(k + i * n, m * n),
                cos2 = math.cos(2 * k + (2 * i + 1) * n, 2 * m * n),
                sin2 = math.sin(2 * k + (2 * i + 1) * n, 2 * m * n);

            coords.push([a * cos1, a * sin1, b * cos, b * sin]);
            coords.push([b * cos2, b * sin2, a * cos, a * sin]);
        }
    }

    return coords;
}
globalThis.antiprismswirl = antiprismswirl;