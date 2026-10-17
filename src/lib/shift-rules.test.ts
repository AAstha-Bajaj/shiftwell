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
});
