import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b04/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("Name contract tests (B04)", () => {

  describe("Invariant checks", () => {
    it("invalid delimiter must throw InvalidStateException", () => {
      expect(() => new StringName("abc", "")).toThrow(InvalidStateException);
      expect(() => new StringName("abc", "..")).toThrow(InvalidStateException);
    });

    it("invariant holds after construction", () => {
      const n = new StringName("a.b", ".");
      expect(n.getNoComponents()).toBe(2);
    });
  });

  describe("Preconditions (IllegalArgumentException)", () => {
    it("getComponent: invalid index", () => {
      const n = new StringName("a.b");
      expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
      expect(() => n.getComponent(10)).toThrow(IllegalArgumentException);
    });

    it("setComponent: invalid index", () => {
      const n = new StringArrayName(["a", "b"]);
      expect(() => n.setComponent(5, "x")).toThrow(IllegalArgumentException);
    });

    it("insert: invalid index", () => {
      const n = new StringArrayName(["a", "b"]);
      expect(() => n.insert(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => n.insert(3, "x")).toThrow(IllegalArgumentException);
    });

    it("remove: invalid index", () => {
      const n = new StringArrayName(["a", "b"]);
      expect(() => n.remove(2)).toThrow(IllegalArgumentException);
    });

    it("concat: null/undefined", () => {
      const n = new StringName("a.b");
      // @ts-ignore
      expect(() => n.concat(null)).toThrow(IllegalArgumentException);
      // @ts-ignore
      expect(() => n.concat(undefined)).toThrow(IllegalArgumentException);
    });
  });

  describe("Postconditions (MethodFailedException)", () => {
    it("insert increases component count", () => {
      const n = new StringArrayName(["a", "b"]);
      n.insert(1, "x");
      expect(n.getNoComponents()).toBe(3);
      expect(n.getComponent(1)).toBe("x");
    });

    it("append places element at end", () => {
      const n = new StringName("a.b");
      n.append("c");
      expect(n.getComponent(n.getNoComponents() - 1)).toBe("c");
    });

    it("remove decreases component count", () => {
      const n = new StringArrayName(["a", "b", "c"]);
      n.remove(1);
      expect(n.getNoComponents()).toBe(2);
      expect(n.getComponent(1)).toBe("c");
    });
  });

  describe("concat tests", () => {
    it("concat appends components of other name", () => {
      const a = new StringArrayName(["a", "b"]);
      const b = new StringName("c.d");
      a.concat(b);
      expect(a.getNoComponents()).toBe(4);
      expect(a.getComponent(2)).toBe("c");
      expect(a.getComponent(3)).toBe("d");
    });
  });

});
