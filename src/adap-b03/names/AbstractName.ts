import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    // @methodtype initialization-method
    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    // @methodtype factory-method
    public abstract clone(): Name;

    // @methodtype conversion-method
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

            if (i < this.getNoComponents() - 1) {
                result += delimiter;
            }
        }

        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    // @methodtype conversion-method
    public asDataString(): string {
        let result = "";

        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.getComponent(i);
            let escaped = "";

            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);

                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                    escaped += ESCAPE_CHARACTER;
                }
                escaped += ch;
            }

            result += escaped;

            if (i < this.getNoComponents() - 1) {
                result += this.delimiter;
            }
        }

        return result;
    }

    // @methodtype predicate-method
    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }

        return true;
    }

    // @methodtype compute-method
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

    // @methodtype predicate-method
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    // @methodtype update-method
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}