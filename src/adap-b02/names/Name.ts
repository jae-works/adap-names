// import { Printable } from "../common/Printable";

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

/*
export interface Name extends Printable {
    isEmpty(): boolean;
    getNoComponents(): number;
    getComponent(i: number): string;
    setComponent(i: number, c: string): void;
    insert(i: number, c: string): void;
    append(c: string): void;
    remove(i: number): void;
    concat(other: Name): void;
}
*/

export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER: string = '\\';


export interface Name {

    // @methodtype conversion-method
    asString(delimiter?: string): string;

    // @methodtype conversion-method
    asDataString(): string;

    // @methodtype get-method
    getDelimiterCharacter(): string;

    // @methodtype get-method
    isEmpty(): boolean;

    // @methodtype get-method
    getComponent(i: number): string;

    // @methodtype set-method
    setComponent(i: number, c: string): void;

    // @methodtype get-method
    getNoComponents(): number;

    // @methodtype command-method
    insert(i: number, c: string): void;

    // @methodtype command-method
    append(c: string): void;

    // @methodtype command-method
    remove(i: number): void;

    // @methodtype command-method
    concat(other: Name): void;
}
