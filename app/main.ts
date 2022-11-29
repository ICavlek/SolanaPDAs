import * as anchor from "@project-serum/anchor";
import { Context } from "./utils/context";
import { Ledger } from "./ledger/ledger";

async function main() {
    const context: Context = new Context();
    const ledger: Ledger = new Ledger(context);

    const john: anchor.web3.Keypair = await context.generateKeypair();
    await ledger.modifyLedger("red", 2, john);
    await ledger.modifyLedger("red", 4, john);
    await ledger.modifyLedger("blue", 2, john);

    const paul: anchor.web3.Keypair = await context.generateKeypair();
    await ledger.modifyLedger("red", 3, paul);
    await ledger.modifyLedger("green", 3, paul);
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);