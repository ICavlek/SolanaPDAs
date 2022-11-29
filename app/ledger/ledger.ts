import * as anchor from "@project-serum/anchor";
import { Context } from "../utils/context";

export class Ledger {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    async modifyLedger(
        color: string,
        newBalance: number,
        wallet: anchor.web3.Keypair,
    ) {

        console.log("--------------------------------------------------");
        let data;
        let pda = await this.derivePda(color, wallet.publicKey);

        console.log(`Checking if account ${pda} exists for color: ${color}...`);
        try {

            data = await this.context.program.account.ledger.fetch(pda);
            console.log("It does.");

        } catch (e) {

            console.log("It does NOT. Creating...");
            await this.createLedgerAccount(color, pda, wallet);
            data = await this.context.program.account.ledger.fetch(pda);
        };

        console.log("Success.");
        console.log("Data:")
        console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
        console.log(`Modifying balance of ${data.color} from ${data.balance} to ${newBalance}`);

        await this.context.program.methods.modifyLedger(newBalance)
            .accounts({
                ledgerAccount: pda,
                wallet: wallet.publicKey,
            })
            .signers([wallet])
            .rpc();

        data = await this.context.program.account.ledger.fetch(pda);
        console.log("New Data:")
        console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
        console.log("Success.");
    }

    private async derivePda(color: string, pubkey: anchor.web3.PublicKey) {
        let [pda, _] = await anchor.web3.PublicKey.findProgramAddress(
            [
                pubkey.toBuffer(),
                Buffer.from("_"),
                Buffer.from(color),
            ],
            this.context.program.programId
        );
        return pda;
    }

    private async createLedgerAccount(
        color: string,
        pda: anchor.web3.PublicKey,
        wallet: anchor.web3.Keypair
    ) {
        await this.context.program.methods.createLedger(color)
            .accounts({
                ledgerAccount: pda,
                wallet: wallet.publicKey,
            })
            .signers([wallet])
            .rpc();
    }
}