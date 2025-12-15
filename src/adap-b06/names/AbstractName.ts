import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    protected assertValidIndexPre(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());
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

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
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
        if (other === null || other === undefined) return false;
        if (this === other) return true;
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

    public getComponent(i: number): string {
        this.assertValidIndexPre(i);
        return this.doGetComponent(i);
    }

    protected abstract doGetComponent(i: number): string;

    public abstract getNoComponents(): number;
}
