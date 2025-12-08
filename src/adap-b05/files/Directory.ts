import { Node } from "./Node";
import { InvalidStateException } from "../common/InvalidStateException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn);
    }

    public findNodes(bn: string): Set<Node> {
        const result = super.findNodes(bn);

        for (const child of this.childNodes) {
            InvalidStateException.assert(child.getBaseName() !== "");
            const childMatches = child.findNodes(bn);
            for (const n of childMatches) {
                result.add(n);
            }
        }

        return result;
    }

}
