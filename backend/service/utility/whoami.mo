import Debug "mo:base/Debug";
actor {
  public query ({ caller }) func whoami() : async Principal {
    Debug.print(debug_show ("WHO THE HELL AM I ", caller));
    return caller;
  };
};
