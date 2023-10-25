const convertTokens = async (n) => {
  b = new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
  return b;
};
const expectedBlockTime = 1000;

const getCoOrdinator = async (web3, coordinator) => {
  const data = await $.getJSON("./contracts/co-ordinator.json");
  const netId = await web3.eth.net.getId();
  const instance = new web3.eth.Contract(data, coordinator);
  return instance;
};

function decimalToHex(decimalNumber, expectedLength = 64) {
  // Convert to hexadecimal and pad with zeros
  const hexValue = Math.abs(decimalNumber).toString(16).toUpperCase();
  console.log("hexValue::::", hexValue);
  return "0x" + "0".repeat(expectedLength - hexValue.length) + hexValue;
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getTxnStatus = async (txHash) => {
  let transactionReceipt = null;
  while (transactionReceipt == null) {
    // Waiting expectedBlockTime until the transaction is mined
    transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    await sleep(expectedBlockTime);
  }
  console.log(
    "Got the transaction receipt: ",
    transactionReceipt,
    transactionReceipt.status
  );
  if (transactionReceipt.status) {
    return [txHash, true];
  } else {
    return [txHash, false];
  }
};

const approveInternalContractToTransfer = (tokencontract, accounts) => {
  let _tokens;
  let _caddr;
  $("#approveAmount").on("change", (e) => {
    _tokens = e.target.value;
    console.log("approveval", _tokens);
  });
  $("#caddrAppr").on("change", (e) => {
    _caddr = e.target.value;
    console.log("_caddr", _caddr);
  });
  $("#approvePLI").on("click", async (e) => {
    console.log("approveInternalContractToTransfer:::::", _caddr, _tokens);
    e.preventDefault();
    const tokens = await convertTokens(_tokens);
    console.log("tokkens are ", tokens);
    await tokencontract.methods
      .approve(_caddr, tokens)
      .send({ from: accounts[0] })
      .on("transactionHash", async function (transactionHash) {
        const [txhash, status] = await getTxnStatus(transactionHash);
        console.log("txhashshshs", txhash, status);
      });
  });
};

const transferPLI = (tokencontract, accounts) => {
  let _amount;
  $("#depositAmount").on("change", (e) => {
    _amount = e.target.value;
    console.log("PLIAmountToDeposit", _amount);
  });
  let _caddr;
  $("#caddrDep").on("change", (e) => {
    _caddr = e.target.value;
    console.log("_caddr", _caddr);
  });
  let _subscriptionid;
  $("#subscriptionid").on("change", (e) => {
    _subscriptionid = e.target.value;
    console.log("_subscriptionid", _subscriptionid);
  });
  $("#depositPLI").on("click", async (e) => {
    console.log("depositPLIIntoInternalContract", accounts[0]);
    e.preventDefault();
    const tokens = await convertTokens(_amount);
    console.log("tokkens are ", tokens);

    // Convert the string to bytes
    var stringValueBytes = decimalToHex(_subscriptionid);
    console.log("stringValueBytes", stringValueBytes);

    await tokencontract.methods
      .transferAndCall(_caddr, tokens, stringValueBytes)
      .send({ from: accounts[0], gas: 21000000 })
      .on("transactionHash", async function (transactionHash) {
        const [txhash, status] = await getTxnStatus(transactionHash);
        console.log("txhashshshs", txhash, status);
      });
  });
};

const getSubscriptionBalance = (web3, accounts) => {
  let _caddr;
  $("#caddrSub").on("change", (e) => {
    _caddr = e.target.value;
    console.log("_caddr", _caddr);
  });
  let _subscriptionid;
  $("#subscriptionid1").on("change", (e) => {
    _subscriptionid = e.target.value;
    console.log("_subscriptionid", _subscriptionid);
  });
  $("#fetchBalance").on("click", async (e) => {
    console.log("getSubscriptionBalance", accounts[0]);
    e.preventDefault();
    const contractinstance = await getCoOrdinator(web3, _caddr);
    // Convert the string to bytes
    var stringValueBytes = decimalToHex(_subscriptionid);
    console.log("stringValueBytes", stringValueBytes);
    let result = await contractinstance.methods
      .getSubscription(stringValueBytes)
      .call();
    console.log("result value is ::::", result);
  });
};

async function nodeOperatorApp() {
  const web3 = await loadWeb3();
  console.log("Web3", web3);
  const accounts = await web3.eth.getAccounts();
  console.log("accounts", accounts);
  const tokencontract = await getTokenContract(web3); //token Contract
  console.log("tokencontract", tokencontract);
  approveInternalContractToTransfer(tokencontract, accounts);
  transferPLI(tokencontract, accounts);
  getSubscriptionBalance(web3,accounts);
}

nodeOperatorApp();
