const EnterNameQandA: React.FC = () => {
  return (
    <div className="">
      <div className="mb-4">
        <div className="mb-2 font-bold">What will your name be used for?</div>
        <div>Your name is displayed in your profile and in leaderboard.</div>
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">Why real name?</div>
        <div>
          We need real name to create{" "}
          <a
            className="text-blue-600"
            href="https://www.amazon.com/Skin-Game-Hidden-Asymmetries-Daily/dp/042528462X"
          >
            skin in the game
          </a>
          . If you lose money, you lose your face. If you make money, you gain
          reputation.
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">
          How do we know you give the real name?
        </div>
        <div>{"We don't know. In the future we will have identity check."}</div>
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">
          Why do we delete account without name?
        </div>
        <div>
          Any account without name will be deleted after 7 days of its creation.
          The reason can be found{" "}
          <a
            className="text-blue-600"
            href="https://juicy-alibi-f68.notion.site/Why-do-we-delete-account-without-name-2ecc060250d14bd6930f6779747d0a57"
          >
            in this post
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default EnterNameQandA;
