import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// Funciones simuladas del repositorio
const mockGetById = jest.fn();
const mockUpdate = jest.fn();
const mockGetUserById = jest.fn();

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

jest.unstable_mockModule(
    "../src/persistence/mongodb/repositories/user.repository.js",
    () => ({
        default: class {
            getById(...args) {
                return mockGetUserById(...args);
            }
        }
    })
);

// Este repositorio no interviene

jest.unstable_mockModule(
    "../src/persistence/mongodb/repositories/auditLog.repository.js",
    () => ({
        default: class { }
    })
);

// Importamos el Service después de registrar los mocks
const { confirmOrder, cancelOrder } = await import("../src/services/orders.service.js");

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

describe("cancelOrder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debería permitir que el dueño cancele su orden pendiente", async () => {
        const orderId = "123456";
        const userId = "user123";

        const order = {
            _id: orderId,
            userId,
            status: "pending",
            deletedAt: null
        };

        const user = { role: "user" };

        const updatedOrder = {
            ...order,
            status: "cancelled"
        };

        mockGetById.mockResolvedValue(order);
        mockGetUserById.mockResolvedValue(user);
        mockUpdate.mockResolvedValue(updatedOrder);

        const result = await cancelOrder(orderId, userId);

        expect(result.status).toBe("cancelled");
        expect(mockGetById).toHaveBeenCalledWith(orderId);
        expect(mockGetUserById).toHaveBeenCalledWith(userId);
        expect(mockUpdate).toHaveBeenCalledWith(
            orderId,
            { status: "cancelled" }
        );
    });

    test("debería permitir que un administrador cancele la orden de otro usuario", async () => {
        const orderId = "123456";
        const userId = "admin123";

        const order = {
            _id: orderId,
            userId: "otherUser",
            status: "pending",
            deletedAt: null
        };

        mockGetById.mockResolvedValue(order);
        mockGetUserById.mockResolvedValue({ role: "admin" });
        mockUpdate.mockResolvedValue({
            ...order,
            status: "cancelled"
        });

        const result = await cancelOrder(orderId, userId);

        expect(result.status).toBe("cancelled");
        expect(mockUpdate).toHaveBeenCalled();
    });

    test("no debería permitir que un usuario cancele la orden de otro", async () => {
        const orderId = "123456";
        const userId = "user123";

        const order = {
            _id: orderId,
            userId: "otherUser",
            status: "pending",
            deletedAt: null
        };

        mockGetById.mockResolvedValue(order);
        mockGetUserById.mockResolvedValue({ role: "user" });

        const result = await cancelOrder(orderId, userId);

        expect(result).toBeNull();
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("debería devolver null si la orden no existe", async () => {
        mockGetById.mockResolvedValue(null);

        const result = await cancelOrder("123456", "user123");

        expect(result).toBeNull();
        expect(mockGetUserById).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("debería devolver la orden si ya está cancelada", async () => {
        const order = {
            _id: "123456",
            userId: "user123",
            status: "cancelled",
            deletedAt: null
        };

        mockGetById.mockResolvedValue(order);
        mockGetUserById.mockResolvedValue({ role: "user" });

        const result = await cancelOrder("123456", "user123");

        expect(result).toEqual(order);
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("debería generar un error si la orden está confirmada", async () => {
        const order = {
            _id: "123456",
            userId: "user123",
            status: "confirmed",
            deletedAt: null
        };

        mockGetById.mockResolvedValue(order);
        mockGetUserById.mockResolvedValue({ role: "user" });

        await expect(cancelOrder("123456", "user123"))
            .rejects
            .toThrow("Solo se pueden cancelar órdenes pendientes");

        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("debería devolver null si la orden fue eliminada", async () => {
        const order = {
            _id: "123456",
            userId: "user123",
            status: "pending",
            deletedAt: new Date()
        };

        mockGetById.mockResolvedValue(order);

        const result = await cancelOrder("123456", "user123");

        expect(result).toBeNull();
        expect(mockGetUserById).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    });
});