import * as anchor from "@project-serum/anchor";
import { SolanaPdAs } from "../target/types/solana_pd_as";
import { Context } from "./utils/context";

async function main() {
    const context: Context = new Context();

    async function derivePda(color: string, pubkey: anchor.web3.PublicKey) {
        let [pda, _] = await anchor.web3.PublicKey.findProgramAddress(
            [
                pubkey.toBuffer(),
                Buffer.from("_"),
                Buffer.from(color),
            ],
            context.program.programId
        );
        return pda;
    }

    async function createLedgerAccount(
        color: string,
        pda: anchor.web3.PublicKey,
        wallet: anchor.web3.Keypair
    ) {
        await context.program.methods.createLedger(color)
            .accounts({
                ledgerAccount: pda,
                wallet: wallet.publicKey,
            })
            .signers([wallet])
            .rpc();
    }

    async function modifyLedger(
        color: string,
        newBalance: number,
        wallet: anchor.web3.Keypair,
    ) {

        console.log("--------------------------------------------------");
        let data;
        let pda = await derivePda(color, wallet.publicKey);

        console.log(`Checking if account ${pda} exists for color: ${color}...`);
        try {

            data = await context.program.account.ledger.fetch(pda);
            console.log("It does.");

        } catch (e) {

            console.log("It does NOT. Creating...");
            await createLedgerAccount(color, pda, wallet);
            data = await context.program.account.ledger.fetch(pda);
        };

        console.log("Success.");
        console.log("Data:")
        console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
        console.log(`Modifying balance of ${data.color} from ${data.balance} to ${newBalance}`);

        await context.program.methods.modifyLedger(newBalance)
            .accounts({
                ledgerAccount: pda,
                wallet: wallet.publicKey,
            })
            .signers([wallet])
            .rpc();

        data = await context.program.account.ledger.fetch(pda);
        console.log("New Data:")
        console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
        console.log("Success.");
    }

    const testKeypair1 = await context.generateKeypair();
    await modifyLedger("red", 2, testKeypair1);
    await modifyLedger("red", 4, testKeypair1);
    await modifyLedger("blue", 2, testKeypair1);

    const testKeypair2 = await context.generateKeypair();
    await modifyLedger("red", 3, testKeypair2);
    await modifyLedger("green", 3, testKeypair2);
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);