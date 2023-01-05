import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import TransactionLockHint from "../../components/TransactionLockHint";

const Buy: NextPage = () => {
  const [sellAmount, setSellAmount] = useState("0.01");

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
        transactionType: "SELL",
      },
      {
        enabled: asset?.id !== undefined,
      }
    );

  const isTransactionPossible = transactionPossibility?.isPossible;

  // get user asset number
  const { data: sessionData } = useSession();
  const { data: userAsset } = trpc.userAsset.getOneById.useQuery(
    asset?.id as number,
    {
      enabled: asset !== undefined && sessionData !== undefined,
    }
  );

  // buy
  const utils = trpc.useContext();

  const sell = trpc.transaction.sell.useMutation({
    onSuccess(data) {
      utils.userAsset.getAll.invalidate();
      setSellAmount("0.01");
      toast.success("Sell success");

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

  const handleSell = async () => {
    if (!asset) {
      toast.error("Please wait for asset info loaded");
      return;
    }

    const quantity = parseFloat(sellAmount);

    if (quantity < 0.0001) {
      toast.error("Minimum amount is 0.0001");
      return;
    }

    sell.mutate({
      quantity,
      assetEntityId: asset.id,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== undefined) {
      setSellAmount(e.target.value);
    } else {
      setSellAmount("");
    }
  };

  return (
    <div className="mx-5 sm:mx-auto sm:w-2/3 md:w-1/2 lg:w-1/3">
      <h1 className="mb-6 mt-6 text-center text-2xl">Sell {assetSymbol}</h1>

      {isTransactionPossible || (
        <TransactionLockHint
          transactionType="SELL"
          assetSymbol={assetSymbol as string}
          availableInMins={transactionPossibility?.availableInMins as number}
        />
      )}

      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">Price</div>
        {asset && <div>${asset.price}</div>}
      </div>

      <div className="flex gap-4">
        <div className="text-gray-700">Holding</div>
        {userAsset && <div>{userAsset.quantity}</div>}
      </div>

      <div className="mt-6 mb-2  flex items-center gap-4">
        <label htmlFor="sellAmount" className=" text-gray-700">
          Sell Amount
        </label>
        <input
          className="flex-grow rounded border border-indigo-600 py-2 px-3"
          disabled={!isTransactionPossible}
          type="number"
          min="0.0001"
          id="sellAmount"
          value={sellAmount}
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex gap-4">
        <div className="text-gray-700">Revenue</div>
        {asset && <div>${asset.price * parseFloat(sellAmount)}</div>}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          disabled={!isTransactionPossible}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleSell}
        >
          Confirm
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        Note: your dealing price could be slightly different from what you see
        here. Here is why. (todo: link to a notion page)
      </div>
    </div>
  );
};

export default Buy;
