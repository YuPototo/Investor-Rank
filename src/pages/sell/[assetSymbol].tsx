import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";

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
    <div>
      <h1>Sell {assetSymbol}</h1>
      <div className="flex gap-4">
        <div>Price</div>
        {asset && <div>${asset.price}</div>}
      </div>

      <div className="flex gap-4">
        <div>Your Holding</div>
        {userAsset && <div>{userAsset.quantity}</div>}
      </div>

      <div className="flex items-center gap-4">
        <div>Sell Amount</div>
        <input
          className="rounded border border-blue-300 py-1 px-2"
          type="number"
          min="0.0001"
          value={sellAmount}
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex gap-4">
        <div>Revenue</div>
        {asset && <div>${asset.price * parseFloat(sellAmount)}</div>}
      </div>

      <div>
        note: your dealing price could be slightly different from what you see
        here. Here is why. (todo: link to a notion page)
      </div>

      <button className="btn-primary" onClick={handleSell}>
        Confirm
      </button>
    </div>
  );
};

export default Buy;
