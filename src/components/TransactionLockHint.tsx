type Props = {
  transactionType: "BUY" | "SELL";
  assetSymbol: string;
  availableInMins: number;
};

const TransactionLockHint: React.FC<Props> = ({
  transactionType,
  assetSymbol,
  availableInMins,
}) => {
  return (
    <div className="my-2 bg-yellow-50 p-2 text-sm">
      <div className="text-red-500">
        You cannot {transactionType.toLowerCase()} {assetSymbol} for{" "}
        {availableInMins} minutes.
      </div>
      <div>
        <a
          className="text-blue-600"
          href="https://juicy-alibi-f68.notion.site/Why-is-there-transaction-cooldown-6039bc12f871475b891aed0042c9f19b"
        >
          Check this post{" "}
        </a>
        to understand why there is this feature
      </div>
    </div>
  );
};

export default TransactionLockHint;
