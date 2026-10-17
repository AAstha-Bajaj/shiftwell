import { describe, it, expect } from "vitest";
import { evaluate, type CheckInput } from "./shift-rules";

const base: CheckInput = { scenario: "combined", requiresCert: true, certStatus: "valid", existingHours: "40", proposedHours: "8" };

describe("shift rules", () => {
  it("blocks expired certificate", () => {
    expect(evaluate({ ...base, certStatus: "expired" }).status).toBe("blocked");
  });
  it("exactly 48 hours does not need approval", () => {
    expect(evaluate(base).status).toBe("passed");
  });
  it("over 48 hours needs regional approval", () => {
    const r = evaluate({ ...base, proposedHours: "9" });
    expect(r.status).toBe("approval");
    expect(r.projected).toBe(49);
  });
  it("expired certificate stays blocked even over 48", () => {
    expect(evaluate({ ...base, certStatus: "expired", proposedHours: "12" }).status).toBe("blocked");
  });
  it("retail scenario ignores certificate", () => {
    expect(evaluate({ ...base, scenario: "retail", certStatus: "expired" }).status).toBe("passed");
  });
  it("clinic scenario ignores overtime", () => {
    expect(evaluate({ ...base, scenario: "clinic", proposedHours: "12" }).status).toBe("passed");
  });
  it("missing hours is invalid", () => {
    expect(evaluate({ ...base, proposedHours: "" }).status).toBe("invalid");
  });
  it("clinic blocks an expired required certificate at 44 projected hours", () => {
    const r = evaluate({ ...base, scenario: "clinic", certStatus: "expired", existingHours: "36", proposedHours: "8" });
    expect(r.status).toBe("blocked");
    expect(r.projected).toBe(44);
  });
  it("retail requires regional approval for 44 plus 6 hours", () => {
    const r = evaluate({ ...base, scenario: "retail", existingHours: "44", proposedHours: "6" });
    expect(r.status).toBe("approval");
    expect(r.projected).toBe(50);
  });
  it("retail passes for 42 plus 6 hours", () => {
    const r = evaluate({ ...base, scenario: "retail", existingHours: "42", proposedHours: "6" });
    expect(r.status).toBe("passed");
    expect(r.projected).toBe(48);
  });
  it("combined blocks an expired required certificate at 50 hours", () => {
    const r = evaluate({ ...base, certStatus: "expired", existingHours: "44", proposedHours: "6" });
    expect(r.status).toBe("blocked");
    expect(r.projected).toBe(50);
  });
  it("combined requires regional approval with a valid certificate at 50 hours", () => {
    const r = evaluate({ ...base, existingHours: "44", proposedHours: "6" });
    expect(r.status).toBe("approval");
    expect(r.projected).toBe(50);
  });
  it("clinic still blocks an expired certificate when irrelevant hours are missing", () => {
    const r = evaluate({ ...base, scenario: "clinic", certStatus: "expired", existingHours: "", proposedHours: "" });
    expect(r.status).toBe("blocked");
    expect(r.errors).toEqual([]);
    expect(r.projected).toBeNull();
  });
  it("clinic passes a valid certificate when irrelevant hours are invalid", () => {
    expect(evaluate({ ...base, scenario: "clinic", existingHours: "-1", proposedHours: "25" }).status).toBe("passed");
  });
  it("clinic passes when no certificate is required", () => {
    expect(evaluate({ ...base, scenario: "clinic", requiresCert: false, certStatus: "expired" }).status).toBe("passed");
  });
});
