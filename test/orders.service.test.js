import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// Funciones simuladas del repositorio
const mockGetById = jest.fn();
const mockUpdate = jest.fn();

// Reemplazamos OrderRepository
jest.unstable_mockModule(
    "../src/persistence/mongodb/repositories/order.repository.js",
    () => ({
        default: class {
            getById(...args) {
                return mockGetById(...args);
            }

            update(...args) {
                return mockUpdate(...args);
            }
        }
    })
);

// Los otros repositorios no intervienen en confirmOrder
jest.unstable_mockModule(
    "../src/persistence/mongodb/repositories/user.repository.js",
    () => ({
        default: class { }
    })
);

jest.unstable_mockModule(
    "../src/persistence/mongodb/repositories/auditLog.repository.js",
    () => ({
        default: class { }
    })
);

// Importamos el Service después de registrar los mocks
const { confirmOrder } = await import("../src/services/orders.service.js");

describe("confirmOrder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debería confirmar una orden pendiente", async () => {
        const orderId = "123456";

        const order = {
            _id: orderId,
            status: "pending",
            deletedAt: null
        };

        const updatedOrder = {
            ...order,
            status: "confirmed"
        };

        mockGetById.mockResolvedValue(order);
        mockUpdate.mockResolvedValue(updatedOrder);

        const result = await confirmOrder(orderId);

        expect(result.status).toBe("confirmed");

        expect(mockGetById).toHaveBeenCalledWith(orderId);

        expect(mockUpdate).toHaveBeenCalledWith(
            orderId,
            { status: "confirmed" }
        );
    });

    test("debería devolver la orden si ya está confirmada", async () => {
        const orderId = "123456";

        const order = {
            _id: orderId,
            status: "confirmed",
            deletedAt: null
        };

        mockGetById.mockResolvedValue(order);

        const result = await confirmOrder(orderId);

        expect(result).toEqual(order);
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("debería devolver null si la orden no existe", async () => {
        mockGetById.mockResolvedValue(null);

        const result = await confirmOrder("123456");

        expect(result).toBeNull();
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("debería generar un error si la orden está cancelada", async () => {
        const order = {
            _id: "123456",
            status: "cancelled",
            deletedAt: null
        };

        mockGetById.mockResolvedValue(order);

        await expect(confirmOrder("123456"))
            .rejects
            .toThrow("Solo se pueden confirmar órdenes pendientes");

        expect(mockUpdate).not.toHaveBeenCalled();
    });
});
