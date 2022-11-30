# SolanaPDAs
Program Derived Addresses on Solana Network.
All credits for idea to https://www.youtube.com/watch?v=JqINC16QrFM&list=PLUBKxx7QjtVnU3hkPc8GF1Jh4DE7cf4n1&index=10&ab_channel=Coding%26Crypto.

### Building and deploying program

```shell
anchor build && anchor deploy
```

After deploying, NECESSARY to replace created program id's with the ones inside Anchor.toml and lib.rs.
Rerun:

```shell
anchor build && anchor deploy
```

### Running

```shell
anchor run pdas
```


