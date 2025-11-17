// import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
// import { Name } from "./Name";

/*
export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
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

    public getComponent(x: number): string {
        throw new Error("needs implementation or deletion");
    }

    public setComponent(n: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public insert(n: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public append(c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public remove(n: number): void {
        throw new Error("needs implementation or deletion");
    }

    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }

}
*/

// Name representation with only a single string.
// Matches StringArrayName via encoder and decoder method.

import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private raw: string = "";

    // @methodtype initialization-method
    constructor(dataString: string, delimiter?: string) {
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        }
        this.raw = dataString;
    }

    //
    // Decode raw string into components.
    // "" => [""]  (cannot construct 0 components with constructor)
    //
    private decode(): string[] {
        const result: string[] = [];
        let current = "";

        for (let i = 0; i < this.raw.length; i++) {
            const ch = this.raw.charAt(i);

            if (ch === ESCAPE_CHARACTER && i + 1 < this.raw.length) {
                const next = this.raw.charAt(i + 1);
                if (next === this.delimiter || next === ESCAPE_CHARACTER) {
                    current += next;
                    i++;
                    continue;
                }
            }

            if (ch === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }

        result.push(current);
        return result;
    }

    //
    // Encode to data string using DEFAULT_DELIMITER and escaping.
    //
    private encode(components: string[]): string {
        let result = "";

        for (let i = 0; i < components.length; i++) {
            const c = components[i];
            let escaped = "";

            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);

                // Escape ONLY the current delimiter and the escape character
                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                    escaped += ESCAPE_CHARACTER;
                }
                escaped += ch;
            }

            result += escaped;

            if (i < components.length - 1) {
                result += this.delimiter;
            }
        }

        return result;
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.decode().join(delimiter);
    }

    // @methodtype conversion-method
    public asDataString(): string {
        const components = this.decode();
        return this.encode(components);
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype get-method
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.decode()[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        const components = this.decode();
        if (i >= 0 && i < components.length) {
            components[i] = c;
            this.raw = this.encode(components);
        }
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.decode().length;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        const components = this.decode();
        if (i >= 0 && i <= components.length) {
            components.splice(i, 0, c);
            this.raw = this.encode(components);
        }
    }

    // @methodtype command-method
    public append(c: string): void {
        const components = this.decode();
        components.push(c);
        this.raw = this.encode(components);
    }

    // @methodtype command-method
    public remove(i: number): void {
        const components = this.decode();
        if (i >= 0 && i < components.length) {
            components.splice(i, 1);
            this.raw = this.encode(components);
        }
    }

    // @methodtype command-method
    public concat(other: Name): void {
        const components = this.decode();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.raw = this.encode(components);
    }
}
