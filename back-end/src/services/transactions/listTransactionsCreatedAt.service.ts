import { AppDataSource } from '../../data-source'
import { Account } from '../../entities/accounts'


const listTransactionsCreatedAtService = async (id: string, date: string) => {

    const accountRepository = AppDataSource.getRepository(Account)

    const account = await accountRepository.findOneBy({ id })

    const cashIn = account!.creditedTransaction.filter(transaction => {

        const day = String(transaction.createdAt.getDate() - 1).padStart(2, '0')

        const month = String(transaction.createdAt.getMonth() + 1).padStart(2, '0')

        const year = transaction.createdAt.getFullYear()

        const formattedDate = `${ year }-${ month }-${ day }`

        return formattedDate == date
    })

    const cashOut = account!.debitedTransaction.filter(transaction => {

        const day = String(transaction.createdAt.getDate() - 1).padStart(2, '0')

        const month = String(transaction.createdAt.getMonth() + 1).padStart(2, '0')

        const year = transaction.createdAt.getFullYear()

        const formattedDate = `${ year }-${ month }-${ day }`

        return formattedDate == date
    })

    return [ ...cashIn, ...cashOut ]
}

export { listTransactionsCreatedAtService }
