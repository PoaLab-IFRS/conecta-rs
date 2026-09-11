import { Prisma } from "@prisma/client";

Object.defineProperty(BigInt.prototype, "toJSON", {
  configurable: true,
  writable: true,
  value() {
    return this.toString();
  },
});

Object.defineProperty(Prisma.Decimal.prototype, "toJSON", {
  configurable: true,
  writable: true,
  value() {
    return this.toString();
  },
});
