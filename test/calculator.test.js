import { calculateTotal } from "../src/utils/calculator.js";

describe("calculateTotal", () => {
    test("debería multiplicar el precio por la cantidad", () => {
        expect(calculateTotal(1000, 2)).toBe(2000);
    });

    test("debería devolver cero cuando la cantidad es cero", () => {
        expect(calculateTotal(1000, 0)).toBe(0);
    });

    test("debería devolver el precio cuando la cantidad es uno", () => {
        expect(calculateTotal(1000, 1)).toBe(1000);
    });
});
