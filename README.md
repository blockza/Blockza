# ICP Mirror

## Running Replica-fe

### Install dfx

sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

### Running replica-fe

dfx deploy
dfx start --background
npm run dev
