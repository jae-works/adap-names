import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    protected assertValidIndexPre(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());
    }

    protected assertValidInsertIndexPre(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents());
    }

    protected assertValidComponentPre(c: string): void {
        IllegalArgumentException.assert(typeof c === "string");
    }

    protected assertPost(condition: boolean): void {
        MethodFailedException.assert(condition);
    }

    protected assertInvariant(): void {
        InvalidStateException.assert(this.delimiter.length === 1);
        const n = this.getNoComponents();
        InvalidStateException.assert(n >= 0);
        for (let i = 0; i < n; i++) {
            const c = this.doGetComponent(i);
            InvalidStateException.assert(typeof c === "string");
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.getComponent(i);
            let unmasked = "";
            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);
                if (ch === ESCAPE_CHARACTER && j + 1 < c.length) {
                    const next = c.charAt(j + 1);
                    if (next === this.delimiter || next === ESCAPE_CHARACTER) {
                        unmasked += next;
                        j++;
                        continue;
                    }
                }
                unmasked += ch;
            }
            result += unmasked;
            if (i < this.getNoComponents() - 1) result += delimiter;
        }
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.getComponent(i);
            let escaped = "";
            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);
                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) escaped += ESCAPE_CHARACTER;
                escaped += ch;
            }
            result += escaped;
            if (i < this.getNoComponents() - 1) result += this.delimiter;
        }
        return result;
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null && other !== undefined);

        const oldCount = this.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        this.assertPost(this.getNoComponents() === oldCount + other.getNoComponents());
        this.assertInvariant();
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndexPre(i);
        this.assertValidComponentPre(c);

        this.doSetComponent(i, c);

        this.assertPost(this.getComponent(i) === c);
        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertValidInsertIndexPre(i);
        this.assertValidComponentPre(c);

        const old = this.getNoComponents();

        this.doInsert(i, c);

        this.assertPost(this.getComponent(i) === c);
        this.assertPost(this.getNoComponents() === old + 1);
        this.assertInvariant();
    }

    public append(c: string): void {
        this.assertValidComponentPre(c);

        const old = this.getNoComponents();

        this.doAppend(c);

        this.assertPost(this.getComponent(this.getNoComponents() - 1) === c);
        this.assertPost(this.getNoComponents() === old + 1);
        this.assertInvariant();
    }

    public remove(i: number): void {
        this.assertValidIndexPre(i);

        const old = this.getNoComponents();

        this.doRemove(i);

        this.assertPost(this.getNoComponents() === old - 1);
        this.assertInvariant();
    }

    protected abstract doSetComponent(i: number, c: string): void;
    protected abstract doInsert(i: number, c: string): void;
    protected abstract doAppend(c: string): void;
    protected abstract doRemove(i: number): void;

    abstract getNoComponents(): number;

    public getComponent(i: number): string {
        this.assertValidIndexPre(i);
        return this.doGetComponent(i);
    }

    protected abstract doGetComponent(i: number): string;
}