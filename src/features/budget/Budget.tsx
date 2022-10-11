import { useState } from 'react';
import DatePicker from "react-datepicker";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { decrement, processFile, selectTransactions, selectSpend, selectReceived } from './budgetSlice';
import styles from './Budget.module.css';
import { useFilePicker } from 'use-file-picker';

import "react-datepicker/dist/react-datepicker.css";
import { TransactionTable } from './TransactionTable';
import { Categories, getCategoryAmount, getCategoryTransactions } from './BudgetParser';

export function Budget() {

  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const transactions = useAppSelector(selectTransactions)
  const spend = useAppSelector(selectSpend)
  const received = useAppSelector(selectReceived)

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    readAs: "Text",
    accept: [".txt"]
  });

  if (loading)
    return (<div>Loading ...</div>)
  if (filesContent[0]?.content && !transactions)
    dispatch(processFile(filesContent[0]?.content))

  return (
    <div>
      <div className={styles.headline}>
        <h2> Движения по сметка </h2>
        Движения по сметка от датата на регистрацията в е-банката.<br />
        Наредените преводи се печатат от Преводи/Наредени документи.<br />
      </div>
      <div className={styles.divider}></div>
      <div className={styles.dataPicket}>
        {/* <label >От дата</label>
        <div className="field-quarter">
          <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date)} />
        </div>
        <label>До дата</label>
        <div className="field-quarter-right">
          <DatePicker selected={endDate} onChange={(date: any) => setEndDate(date)} />
        </div> */}
        <button onClick={() => dispatch(decrement())}> Покажи </button>
        <button onClick={() => openFileSelector()}> Избери Файл </button>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.divider}></div>
      {transactions && Categories.map((category, index) => {
        const categoryTransactions = getCategoryTransactions(category[0], transactions)
        const categorySpend = getCategoryAmount(categoryTransactions, 'debit')
        console.log(categoryTransactions, categorySpend)
        return <TransactionTable
          key={index}
          title={category[0]}
          transactions={categoryTransactions}
          spend={categorySpend}
          received={getCategoryAmount(categoryTransactions, 'credit')}
          percentage={Math.round((categorySpend / spend!) * 100)}
        />
      })}
    </div >
  );
}
