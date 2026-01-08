import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn(() => ({
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve([{ insertId: 1 }])),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(() => Promise.resolve([])),
            })),
          })),
        })),
      })),
    })),
  })),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.create", () => {
  it("creates a lead with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      company: "Acme Corp",
      jobTitle: "VP of Procurement",
      companySize: "1000-5000",
      message: "Interested in your platform",
      source: "demo_request",
    });

    expect(result.success).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it("calculates higher score for executive titles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.create({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      company: "Tech Corp",
      jobTitle: "CEO",
    });

    expect(result.success).toBe(true);
    // CEO should get bonus points
    expect(result.score).toBeGreaterThanOrEqual(55);
  });

  it("rejects invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.create({
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });
});

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@example.com");
  });
});

describe("auth.logout", () => {
  it("clears session cookie on logout", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});
