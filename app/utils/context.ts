import * as anchor from "@project-serum/anchor";
import { SolanaPdAs } from "../../target/types/solana_pd_as";

export class Context {
    provider: anchor.AnchorProvider;
    program: anchor.Program<SolanaPdAs>;

    constructor() {
        this.provider = anchor.AnchorProvider.env();
        anchor.setProvider(this.provider);
        this.program = anchor.workspace.SolanaPdAs as anchor.Program<SolanaPdAs>;
    }

    async generateKeypair() {
        const keypair = anchor.web3.Keypair.generate();
        await this.provider.connection.requestAirdrop(
            keypair.publicKey,
            2 * anchor.web3.LAMPORTS_PER_SOL
        );
        await new Promise(resolve => setTimeout(resolve, 3 * 1000)); // Sleep 3s
        return keypair;
    }
}