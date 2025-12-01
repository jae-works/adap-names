import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.name = source;
        this.assertInvariant();
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
                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) escaped += ESCAPE_CHARACTER;
                escaped += ch;
            }
            s += escaped;
            if (i < components.length - 1) s += this.delimiter;
        }
        return s;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        if (this.name.length === 0) return 1;
        return this.decode().length;
    }

    public doGetComponent(i: number): string {
        if (this.name.length === 0) {
            return i === 0 ? "" : undefined as any;
        }
        return this.decode()[i];
    }

    protected doSetComponent(i: number, c: string): void {
        const comp = this.decode();
        comp[i] = c;
        this.name = this.encode(comp);
    }

    protected doInsert(i: number, c: string): void {
        const comp = this.decode();
        comp.splice(i, 0, c);
        this.name = this.encode(comp);
    }

    protected doAppend(c: string): void {
        const comp = this.decode();
        comp.push(c);
        this.name = this.encode(comp);
    }

    protected doRemove(i: number): void {
        const comp = this.decode();
        comp.splice(i, 1);
        this.name = this.encode(comp);
    }
}