import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import TransactionLockHint from "../../components/TransactionLockHint";
import PriceExplanation from "../../components/PriceExplanation";

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
    <div className="mx-5 sm:mx-auto sm:w-2/3 md:w-1/2 lg:w-1/3">
      <h1 className="mb-6 mt-6 text-center text-2xl">Buy {assetSymbol}</h1>

      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">Price</div>
        {asset && <div>${asset.price}</div>}
      </div>

      <div className="flex gap-4">
        <div className="text-gray-700">Balance</div>
        {balance && <div>${balance}</div>}
      </div>

      <div className="mt-6 mb-2 flex items-center gap-4">
        <label htmlFor="buyAmount" className=" text-gray-700">
          Buy Amount
        </label>
        <input
          disabled={!isTransactionPossible}
          className="flex-grow rounded border border-indigo-600 py-2 px-3"
          type="number"
          min="0.01"
          id="buyAmount"
          value={buyAmount}
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex gap-4">
        <div className="text-gray-700">Cost</div>
        {asset && <div>${cost}</div>}
      </div>

      {isTransactionPossible || (
        <TransactionLockHint
          transactionType="BUY"
          assetSymbol={assetSymbol as string}
          availableInMins={transactionPossibility?.availableInMins as number}
        />
      )}

      <div className="mt-6 flex justify-center">
        <button
          disabled={!isTransactionPossible}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleBuy}
        >
          Confirm
        </button>
      </div>

      <PriceExplanation />
    </div>
  );
};

export default Buy;
