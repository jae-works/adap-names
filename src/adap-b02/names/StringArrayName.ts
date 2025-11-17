// import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
// import { Name } from "./Name";
import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

/*
export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation or deletion");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getNoComponents(): number {
        throw new Error("needs implementation or deletion");
    }

    public getComponent(i: number): string {
        throw new Error("needs implementation or deletion");
    }

    public setComponent(i: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public insert(i: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public append(c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public remove(i: number): void {
        throw new Error("needs implementation or deletion");
    }

    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }
}
*/

export class StringArrayName implements Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
        this.components = other.slice();
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        let result = "";

        for (let i = 0; i < this.components.length; i++) {
            const c = this.components[i];
            let unmasked = "";

            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);

                if (ch === ESCAPE_CHARACTER && j + 1 < c.length) {
                    const next = c.charAt(j + 1);
                    if (next === DEFAULT_DELIMITER || next === ESCAPE_CHARACTER) {
                        unmasked += next;
                        j++;
                        continue;
                    }
                }

                unmasked += ch;
            }

            result += unmasked;

            if (i < this.components.length - 1) {
                result += delimiter;
            }
        }

        return result;
    }

    // @methodtype conversion-method
    public asDataString(): string {
        let result = "";

        for (let i = 0; i < this.components.length; i++) {
            const c = this.components[i];
            let escaped = "";

            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);

                // Escape ONLY escape character + THIS INSTANCE'S delimiter
                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                    escaped += ESCAPE_CHARACTER;
                }
                escaped += ch;
            }

            result += escaped;

            if (i < this.components.length - 1) {
                result += this.delimiter;
            }
        }

        return result;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype get-method
    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (i >= 0 && i < this.components.length) {
            this.components[i] = c;
        }
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i >= 0 && i <= this.components.length) {
            this.components.splice(i, 0, c);
        }
    }

    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        if (i >= 0 && i < this.components.length) {
            this.components.splice(i, 1);
        }
    }

    // @methodtype command-method
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }
}
