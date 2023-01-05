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
    <div className="mt-2 mb-6 rounded bg-red-100 p-2">
      <div>
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
        to understand why
      </div>
    </div>
  );
};

export default TransactionLockHint;
