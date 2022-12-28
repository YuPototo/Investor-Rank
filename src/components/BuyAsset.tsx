// todo: delete this file
import { trpc } from "../utils/trpc";

const BuyAsset: React.FC = () => {
  const utils = trpc.useContext();

  const buy = trpc.transaction.buy.useMutation({
    onSuccess() {
      utils.userAsset.getAll.invalidate();
    },
  });
  const sell = trpc.transaction.sell.useMutation({
    onSuccess() {
      utils.userAsset.getAll.invalidate();
    },
  });

  const handleBuy = () => {
    buy.mutate({
      quantity: 2,
      assetEntityId: 2,
    });
  };

  const handleSell = () => {
    sell.mutate({
      quantity: 3,
      assetEntityId: 2,
    });
  };

  return (
    <div>
      <button onClick={handleBuy}>buy 2 btc</button>
      <button onClick={handleSell}>sell 3 btc</button>
    </div>
  );
};

export default BuyAsset;
