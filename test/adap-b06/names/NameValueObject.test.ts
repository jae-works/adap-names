import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

describe("Name value object tests (B06)", () => {

  describe("Construction and invariants", () => {

    it("constructs StringName with default delimiter", () => {
      const n = new StringName("a.b.c");
      expect(n.getNoComponents()).toBe(3);
      expect(n.getComponent(0)).toBe("a");
      expect(n.getComponent(1)).toBe("b");
      expect(n.getComponent(2)).toBe("c");
    });

    it("constructs StringArrayName", () => {
      const n = new StringArrayName(["a", "b", "c"]);
      expect(n.getNoComponents()).toBe(3);
      expect(n.getComponent(1)).toBe("b");
    });

    it("invalid delimiter violates invariant", () => {
      expect(() => new StringName("a.b", "")).toThrow(InvalidStateException);
      expect(() => new StringArrayName(["a"], "..")).toThrow(InvalidStateException);
    });
  });

  describe("Value equality across implementations", () => {

    it("StringName equals StringArrayName with same components", () => {
      const a = new StringName("a.b.c");
      const b = new StringArrayName(["a", "b", "c"]);

      expect(a.isEqual(b)).toBe(true);
      expect(b.isEqual(a)).toBe(true);
    });

    it("different values are not equal", () => {
      const a = new StringName("a.b");
      const b = new StringName("a.c");

      expect(a.isEqual(b)).toBe(false);
      expect(b.isEqual(a)).toBe(false);
    });
  });

  describe("Equality contract", () => {

    it("reflexive", () => {
      const n = new StringName("a.b");
      expect(n.isEqual(n)).toBe(true);
    });

    it("symmetric", () => {
      const a = new StringName("a.b");
      const b = new StringArrayName(["a", "b"]);

      expect(a.isEqual(b)).toBe(true);
      expect(b.isEqual(a)).toBe(true);
    });

    it("transitive", () => {
      const a = new StringName("a.b");
      const b = new StringArrayName(["a", "b"]);
      const c = new StringName("a.b");

      expect(a.isEqual(b)).toBe(true);
      expect(b.isEqual(c)).toBe(true);
      expect(a.isEqual(c)).toBe(true);
    });

    it("null safety", () => {
      const a = new StringName("a.b");
      // @ts-ignore
      expect(a.isEqual(null)).toBe(false);
      // @ts-ignore
      expect(a.isEqual(undefined)).toBe(false);
    });
  });

  describe("Hash code consistency", () => {

    it("equal values have same hash code", () => {
      const a = new StringName("a.b.c");
      const b = new StringArrayName(["a", "b", "c"]);

      expect(a.getHashCode()).toBe(b.getHashCode());
    });
  });

  describe("Printing and escaping", () => {

    it("toString produces data string", () => {
      const n = new StringName("a.b.c");
      expect(n.toString()).toBe("a.b.c");
    });

    it("asString produces unescaped string", () => {
      const n = new StringName("a\\.b.c");
      expect(n.asString()).toBe("a.b.c");
    });

    it("escaping delimiter in components works", () => {
      const n = new StringArrayName(["a.b", "c"]);
      expect(n.asDataString()).toBe("a\\.b.c");
      expect(n.asString()).toBe("a.b.c");
    });
  });

  describe("Immutability", () => {

    it("StringArrayName is defensively copied", () => {
      const src = ["a", "b"];
      const n = new StringArrayName(src);
      src[0] = "x";

      expect(n.getComponent(0)).toBe("a");
    });
  });
});
