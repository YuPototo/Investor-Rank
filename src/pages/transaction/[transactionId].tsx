import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Transaction: NextPage = () => {
  const router = useRouter();
  const { transactionId } = router.query;

  const { data } = trpc.transaction.getOne.useQuery(transactionId as string, {
    enabled: transactionId !== undefined,
  });

  const transaction = data?.transaction;

  return (
    <div>
      <h1>Transaction {transactionId}</h1>
      <div className="flex gap-4">
        <div>type</div>
        <div>{transaction?.type}</div>
      </div>
      <div className="flex gap-4">
        <div>asset</div>
        <div>{transaction?.assetEntity}</div>
      </div>
      <div className="flex gap-4">
        <div>price</div>
        {transaction && <div>{`$${transaction?.price}`}</div>}
      </div>
      <div className="flex gap-4">
        <div>quantity</div>
        <div>{transaction?.quantity}</div>
      </div>
      <div className="flex gap-4">
        {transaction && (
          <div>{transaction.type === "BUY" ? "cost" : "revenue"}</div>
        )}
        {transaction && <div>${transaction.quantity * transaction.price}</div>}
      </div>
      <div className="flex gap-4">
        <div>timestamp</div>
        {transaction && <div>{JSON.stringify(transaction.timestamp)}</div>}
      </div>

      <Link className="btn-primary" href="/portfolio">
        To your portfolio
      </Link>
    </div>
  );
};

export default Transaction;
