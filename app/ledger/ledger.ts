import * as anchor from "@project-serum/anchor";
import { Context } from "../utils/context";

export class Ledger {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }
}