import { Request, Response } from 'express'
import fs from 'fs'
import { IExpense } from '../lib/@type'

let data: IExpense[] = JSON.parse(fs.readFileSync('./src/lib/expense.json', 'utf-8'))

export const getExpense = (req: Request, res: Response) => {
    const startDate = req.query.start as string
    const endDate = req.query.end as string

    const varStartDate = new Date(startDate)
    const varEndDate = new Date(endDate)
    

    const expenseFilter = data.filter((item) => {
        let isValid=true
        for(const key in req.query){
            if(key=="category"){
                isValid=isValid&&item.category.toLowerCase().includes(req.query.kategori?.toString().toLowerCase() as string)
            }else if(key=="start"){
                isValid=isValid&&new Date(item.date)>=varStartDate
            }else if(key=="end"){
                isValid=isValid&&new Date(item.date)<=varEndDate
            }else{
                isValid=isValid&&item[key as keyof typeof item]==req.query[key]

            }
            
        }
        return isValid
    })
    const nominal = expenseFilter.map((item) => item.nominal).reduce((a, b) => a +b)
    res.status(200).send({
        status: "ok",
        data: expenseFilter,
        total: nominal
    })
}

export const getExpenseId = (req: Request, res: Response) => {
    const { id } = req.params
    const expense = data.find((item) => item.id == +id)
    if (expense) {
        res.status(200).send({
            status: "ok",
            data: expense
        })
    } else {
        res.status(400).send({
            status: "error",
            message: "User not found"
        })
    }
}

export const postExpense = (req:Request, res:Response) => {
    const id = Math.max(...data.map((expense => expense.id))) + 1
    const newExpense = {id, ...req.body}
    data.push(newExpense);
    console.log(data);

    fs.writeFileSync('./src/lib/expense.json', JSON.stringify(data), 'utf-8')
    
    res.status(200).send({
        status: 'ok',
        message: 'user register' 
    })
}

export const deleteExpense = (req: Request, res: Response) => {
    const expense = data.find((item) => item.id == +req.params.id)

    if (expense) {
        data = data.filter((item) => item.id !== +req.params.id)
        fs.writeFileSync('./src/lib/expense.json', JSON.stringify(data), 'utf-8')
        res.status(200).send({
            status: "ok",
            message: 'Data deleted'
        })
    } else {
        res.status(400).send({
            status: "error",
            message: "User not found"
        })
    }
}

export const editExpense = (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedExpenseData = req.body;
    const expenseIndex = data.findIndex((item) => item.id === +id);

    if (expenseIndex !== -1) {
        
        data[expenseIndex] = {
            ...data[expenseIndex], 
            ...updatedExpenseData 
        };

        fs.writeFileSync('./src/lib/expense.json', JSON.stringify(data), 'utf-8');

        res.status(200).send({
            status: 'ok',
            message: 'Expense updated successfully',
            data: data[expenseIndex]
        });
    } else {
        res.status(404).send({
            status: 'error',
            message: 'Expense not found'
        });
    }
}