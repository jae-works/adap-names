import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected readonly name: string;

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

    public getNoComponents(): number {
        if (this.name.length === 0) return 1;
        return this.decode().length;
    }

    protected doGetComponent(i: number): string {
        if (this.name.length === 0) {
            return i === 0 ? "" : undefined as any;
        }
        return this.decode()[i];
    }
}
