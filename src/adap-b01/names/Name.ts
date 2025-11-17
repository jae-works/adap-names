export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
        this.components = other.slice();
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        var result = "";

        for (var i = 0; i < this.components.length; i++) {
            var c = this.components[i];
            var unmasked = "";

            for (var j = 0; j < c.length; j++) {
                var ch = c.charAt(j);
                if (ch === ESCAPE_CHARACTER && j + 1 < c.length) {
                    var next = c.charAt(j + 1);
                    if (next === DEFAULT_DELIMITER || next === ESCAPE_CHARACTER) {
                        unmasked = unmasked + next;
                        j++; // skip next char
                        continue;
                    }
                }
                unmasked = unmasked + ch;
            }

            result = result + unmasked;
            if (i < this.components.length - 1) {
                result = result + delimiter;
            }
        }

        return result;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
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
                result += this.delimiter;   // use instance delimiter
            }
        }

        return result;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (i >= 0 && i < this.components.length) {
            this.components[i] = c;
        }
    }

    /** Returns number of components in Name instance */
    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i >= 0 && i <= this.components.length) {
            this.components.splice(i, 0, c);
        }
    }

    /** Expects that new Name component c is properly masked */
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

}