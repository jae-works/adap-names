import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.components = source.slice();
        this.assertInvariant();
    }


    public getNoComponents(): number {
        return this.components.length;
    }

    protected doGetComponent(i: number): string {
        return this.components[i];
    }
}
