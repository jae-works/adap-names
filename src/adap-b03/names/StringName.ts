import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    // Not used anymore.
    // protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.name = source;
    }

    private decode(): string[] {
        const result: string[] = [];
        let current = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name.charAt(i);

            if (ch === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                const next = this.name.charAt(i + 1);
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

    private encode(components: string[]): string {
        let s = "";

        for (let i = 0; i < components.length; i++) {
            const c = components[i];
            let escaped = "";

            for (let j = 0; j < c.length; j++) {
                const ch = c.charAt(j);
                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                    escaped += ESCAPE_CHARACTER;
                }
                escaped += ch;
            }

            s += escaped;
            if (i < components.length - 1) s += this.delimiter;
        }

        return s;
    }

    // @methodtype factory-method
    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    // Not needed anymore. Already implemented.
    /*
    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    public isEqual(other: Name): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getHashCode(): number {
        throw new Error("needs implementation or deletion");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation or deletion");
    }
    */

    // @methodtype get-method
    public getNoComponents(): number {
        if (this.name.length === 0) return 1;
        return this.decode().length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        if (this.name.length === 0) {
            return i === 0 ? "" : undefined as any;
        }
        return this.decode()[i];
    }

    // @methodtype update-method
    public setComponent(i: number, c: string): void {
        const comp = this.decode();
        if (i >= 0 && i < comp.length) {
            comp[i] = c;
            this.name = this.encode(comp);
        }
    }

    // @methodtype update-method
    public insert(i: number, c: string): void {
        const comp = this.decode();
        comp.splice(i, 0, c);
        this.name = this.encode(comp);
    }

    // @methodtype update-method
    public append(c: string): void {
        const comp = this.decode();
        comp.push(c);
        this.name = this.encode(comp);
    }

    // @methodtype update-method
    public remove(i: number): void {
        const comp = this.decode();
        comp.splice(i, 1);
        this.name = this.encode(comp);
    }

    // Not needed anymore. Already implemented.
    /*
    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }
    */
}