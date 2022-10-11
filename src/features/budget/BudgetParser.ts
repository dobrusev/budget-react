import { Transaction } from './budgetSlice'

const LINE_START_DEFAULT = 1

export const Categories = [
    ['Хранителни Покупки', 'Alex Trade', 'BILLA', 'METRO', 'LIDL', 'KAUFLAND', 'ALEX TRADE', 'STOP4ETO', '#DM', 'Metro Cash & Carry', 'BAHARICA', 'T-MARKET', 'LILLY', 'EBAG.BG'],
    ['Гориво', 'GAZPROM', 'OMV', 'SCHELL', 'PETROL', 'SHELL', 'INSAOIL', 'VAS OIL', 'LUKOIL', 'GAS STATIONS EKO'],
    ['За колата', 'MOTION SERVICE', 'API BG TOLL', 'СКОРПИОН ИНС ООД', 'ITS VINETKI SOF'],
    ['Ресторанти', 'JAGERHOF', 'HAPPY BAR & GRILL', 'JAPONICA', 'Q BAR', 'HAPPY BAR&GRILL', 'JEGERHOF', 'PLPLAZ', 'DOMINOS', 'WEST COFFE PLAZA', 'GaleriaStara', 'GRAFIT', 'VIKTORIA'],
    ['Банки', 'Теглене ПОС', 'FIB_ATM', 'UNICREDIT', 'ALLIANZ', 'Теглене ПОС BUL VASIL APRILOV'],
    ['За работа', 'AY STAYL'],
    ['Ежемесечни', 'МАТЕЙ', 'REGIONAL BUSINESS', 'Бистра', 'EPAY A1 MOBILE', 'ИЗИПЕЙ', 'ATHLETIC FITNESS'],
    ['АВАНСОВО ДОД', 'АВАНСОВО ДОД'],
    ['ДЗПО', 'ДЗПО'],
    ['ДОО', 'ДОО'],
    ['ЗОВ', 'ЗОВ'],
    ['Пазаруване', 'HITA', 'PEPCO', 'PHARMACY DARA 5 PLO', 'STUDIO MODERNA SOF', 'SPEEDY', 'TECHNOPOLIS', 'answear.bg', 'SOPHARMAC', 'HUMANA', 'SPORT VISION', 'JUMBO', 'TOM TAILOR', 'FRAMAR'],
    ['Хоби', 'PRAKTIKER', 'BRICOLAGE', 'WEEKEND WOODWORKER', 'BAUMAX', 'HOMEMAX', 'OZONE.BG', 'DECATLON'],
    ['Кредит', 'Период.плащ.Нар.кред.превод', 'Такса за периодично плащане', 'Погасяване главница кредит', 'Погасяване редовна лихва кредит'],
    ['Чужбина', 'Плащане чрез ПОС чужбина'],
    ['UNDEFINED']
]

export const parse = (fileContent: string) => {
    const result: Transaction[] = []
    fileContent.split(/\r?\n/)
        .forEach((line, lineIndex) => {
            if (lineIndex < LINE_START_DEFAULT)
                return

            const lineArr = line.split('|')
            const date = lineArr[0]
            // Remove empty line
            if (!date)
                return
            const amount = parseFloat(lineArr[2]?.replace(/,/g, ''))
            const type = lineArr[3] === 'D' ? 'debit' : 'credit'
            const document = lineArr[4]?.trim()
            const contragent = lineArr[5]?.trim()
            const reason = lineArr[6]?.trim()
            const info = lineArr[7]?.trim()
            const category = getTransactionCategory(contragent, document, reason, info)

            result.push({ date, amount, type, document, contragent, reason, info, category })
        })
    return result
}

const match = (str: string, pattern: string) => str.indexOf(pattern) !== -1

const getTransactionCategory = (contragent: string, document: string, reason: string, info: string) => {
    let result = 'UNDEFINED'
    Categories.forEach((category) => {
        category.forEach((pattern, pIndex) => {
            if (pIndex === 0)
                return
            if (match(contragent, pattern) || match(document, pattern) || match(info, pattern) || match(reason, pattern))
                result = category[0]
        })
    })
    return result

    // Categories.forEach((value) => {
    //     const title = value[0]
    //     const amount = getCategoryAmount(title, results)
    //     const details = getCategoryDetails(title, results)
    //     const percentage = Math.round((amount / spend) * 100)
    //     table.push({ title, amount, details, percentage })
    // })
}

export const getCategoryTransactions = (category: string, transactions: Transaction[]) =>
    transactions.filter((item) => item.category === category)

export const getCategoryAmount = (transactions: Transaction[], type: 'credit' | 'debit') =>
    transactions.reduce((prev, curr) => prev + (curr.type === type ? curr.amount : 0), 0)
