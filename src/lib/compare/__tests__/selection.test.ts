import { describe, expect, it } from "vitest";

import {
  MAX_COMPARE,
  MIN_COMPARE,
  addToSelection,
  canCompare,
  isAtCapacity,
  removeFromSelection,
} from "@/lib/compare/selection";

const known = new Set(["A", "B", "C", "D", "E"]);

describe("compare selection", () => {
  it("selects two sites", () => {
    const first = addToSelection([], "A", known);
    const second = addToSelection(first.selection, "B", known);
    expect(second.selection).toEqual(["A", "B"]);
    expect(second.rejected).toBeNull();
    expect(canCompare(second.selection)).toBe(true);
  });

  it("refuses a duplicate and says so", () => {
    const result = addToSelection(["A", "B"], "A", known);
    expect(result.selection).toEqual(["A", "B"]);
    expect(result.rejected).toBe("duplicate");
  });

  it("caps the selection at four", () => {
    const four = ["A", "B", "C", "D"];
    expect(isAtCapacity(four)).toBe(true);
    const result = addToSelection(four, "E", known);
    expect(result.selection).toEqual(four);
    expect(result.rejected).toBe("at_capacity");
    expect(result.selection).toHaveLength(MAX_COMPARE);
  });

  it("refuses an unknown record rather than adding a phantom column", () => {
    const result = addToSelection(["A"], "ZZZ", known);
    expect(result.rejected).toBe("not_found");
    expect(result.selection).toEqual(["A"]);
  });

  it("does not allow comparing fewer than the minimum", () => {
    expect(canCompare([])).toBe(false);
    expect(canCompare(["A"])).toBe(false);
    expect(MIN_COMPARE).toBe(2);
  });

  it("removes without disturbing the rest of the order", () => {
    expect(removeFromSelection(["A", "B", "C"], "B")).toEqual(["A", "C"]);
    expect(removeFromSelection(["A"], "ZZZ")).toEqual(["A"]);
  });

  it("never mutates the selection it is given", () => {
    const original = ["A", "B"];
    addToSelection(original, "C", known);
    removeFromSelection(original, "A");
    expect(original).toEqual(["A", "B"]);
  });
});
