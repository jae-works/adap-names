import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    // @methodtype initialization-method
    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.components = source.slice();
    }

    // @methodtype factory-method
    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    // The next two methods are inherited from AbstractName.
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
        return this.components.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.components[i];
    }

    // @methodtype update-method
    public setComponent(i: number, c: string): void {
        if (i >= 0 && i < this.components.length) {
            this.components[i] = c;
        }
    }

    // @methodtype update-method
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    // @methodtype update-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype update-method
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    /*
    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }
    */
}