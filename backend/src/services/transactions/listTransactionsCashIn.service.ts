import { accountRepository } from "../../repositories/accountRepository";
import { Transaction } from "../../entities/transactions.entity";

const listTransactionsCashInService = async (
  id: string
): Promise<Transaction[]> => {
  const account = await accountRepository.findOneBy({ id });

  return account!.creditedTransaction;
};

export { listTransactionsCashInService };
