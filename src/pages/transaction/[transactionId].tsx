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

  const totalValueRaw = transaction
    ? transaction.quantity * transaction.price
    : 0;
  const totalValue = totalValueRaw.toFixed(2);

  return (
    <div className="mx-5 sm:mx-auto sm:w-2/3 md:w-1/2 lg:w-1/3">
      <h1 className="mb-6 mt-6 text-center text-2xl">Transaction</h1>
      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">id</div>
        <div> {transactionId}</div>
      </div>
      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">type</div>
        <div>{transaction?.type}</div>
      </div>
      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">asset</div>
        <div>{transaction?.assetEntity}</div>
      </div>
      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">price</div>
        {transaction && <div>{`$${transaction?.price}`}</div>}
      </div>
      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">quantity</div>
        <div>{transaction?.quantity}</div>
      </div>
      <div className="mb-2 flex gap-4">
        {transaction && (
          <div className="text-gray-700">
            {transaction.type === "BUY" ? "cost" : "revenue"}
          </div>
        )}
        {transaction && <div>${totalValue}</div>}
      </div>
      <div className="mb-2 flex gap-4">
        <div className="text-gray-700">timestamp</div>
        {transaction && <div>{transaction.timestamp.toLocaleString()}</div>}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          href="/profile"
        >
          To your profile
        </Link>
      </div>
    </div>
  );
};

export default Transaction;
