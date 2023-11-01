const ConnectPlugWallet = async () => {
  if (!window.ic) {
    return {
      success: false,
      msg: 'Install Plug Wallet',
      alreadyConnected: false,
    };
  }
  const connected = await window.ic.plug.isConnected();
  if (connected) {
    return { success: true, msg: 'Already Connected', alreadyConnected: true };
  } else {
    const whitelist = [process.env.NEXT_PUBLIC_ENTRY_CANISTER_ID];

    const onConnectionUpdate = async () => {};
    try {
      const publicKey = await window.ic.plug.requestConnect({
        whitelist,
        host: process.env.NEXT_PUBLIC_IC_HOST,
        onConnectionUpdate,
        timeout: 50000,
      });

      return {
        success: true,
        msg: 'Connected Successfully',
        alreadyConnected: false,
      };
    } catch {
      return {
        success: false,
        msg: 'Failed to Connect Plug Wallet',
        alreadyConnected: false,
      };
    }
  }
};
export { ConnectPlugWallet };
