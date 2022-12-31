import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import TransactionLockHint from "../../components/TransactionLockHint";

const Buy: NextPage = () => {
  const [buyAmount, setBuyAmount] = useState("0.01");

  // get asset
  const router = useRouter();
  const { assetSymbol } = router.query;
  const { data: asset } = trpc.assetEntity.getBySymbol.useQuery(
    assetSymbol as string,
    {
      enabled: assetSymbol !== undefined,
    }
  );

  // is transaction possible
  const { data: transactionPossibility } =
    trpc.transaction.isTransactionPossible.useQuery(
      {
        assetEntityId: asset?.id as number,
        transactionType: "BUY",
      },
      {
        enabled: asset?.id !== undefined,
      }
    );

  const isTransactionPossible = transactionPossibility?.isPossible;

  // get user balance
  const { data: sessionData } = useSession();
  const { data: balanceRes } = trpc.userAsset.getBalance.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });
  const balance = balanceRes?.balance;

  // buy
  const utils = trpc.useContext();

  const buy = trpc.transaction.buy.useMutation({
    onSuccess(data) {
      utils.userAsset.getAll.invalidate();
      setBuyAmount("0.01");
      toast.success("Buy success");

      const transactionId = data.transaction.id;
      setTimeout(() => {
        router.push(`/transaction/${transactionId}`);
      }, 1000);
    },
    onError(err) {
      // todo: handle error in a better way
      toast.error(err.message);
    },
  });

  const handleBuy = async () => {
    if (!asset) {
      toast.error("Please wait for asset info loaded");
      return;
    }

    const quantity = parseFloat(buyAmount);

    if (quantity < 0.0001) {
      toast.error("Minimum amount is 0.0001");
      return;
    }

    buy.mutate({
      quantity,
      assetEntityId: asset.id,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== undefined) {
      setBuyAmount(e.target.value);
    } else {
      setBuyAmount("");
    }
  };

  const costRaw = asset ? asset.price * parseFloat(buyAmount) : 0;
  const cost = Math.round(costRaw * 100) / 100;

  return (
    <div>
      <h1>Buy {assetSymbol}</h1>
      <div className="flex gap-4">
        <div>Price</div>
        {asset && <div>${asset.price}</div>}
      </div>

      <div className="flex gap-4">
        <div>Your balance</div>
        {balance && <div>${balance}</div>}
      </div>

      <div className="flex items-center gap-4">
        <div>Buy Amount</div>
        <input
          disabled={!isTransactionPossible}
          className="rounded border border-blue-300 py-1 px-2"
          type="number"
          min="0.01"
          value={buyAmount}
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex gap-4">
        <div>Cost</div>
        {asset && <div>${cost}</div>}
      </div>

      <div>
        note: your dealing price could be slightly different from what you see
        here. Here is why. (todo: link to a notion page)
      </div>

      {isTransactionPossible || (
        <TransactionLockHint
          transactionType="BUY"
          assetSymbol={assetSymbol as string}
          availableInMins={transactionPossibility?.availableInMins as number}
        />
      )}

      <button
        disabled={!isTransactionPossible}
        className="btn-primary"
        onClick={handleBuy}
      >
        Confirm
      </button>
    </div>
  );
};

export default Buy;
