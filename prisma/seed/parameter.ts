import type { Parameter } from "@prisma/client";
import { ParameterType } from "@prisma/client";

const data: Omit<Parameter, "id">[] = [
  {
    key: "dollarAssetId",
    value: "1",
    type: ParameterType.NUMBER,
  },
  {
    key: "initialDollar",
    value: "100000",
    type: ParameterType.NUMBER,
  },
];

export default data;
