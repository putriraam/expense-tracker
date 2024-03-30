import { Router } from "express";
import { deleteExpense, editExpense, getExpense, getExpenseId, postExpense } from "../controllers/expense.controller";

const expenseRouter = Router();

expenseRouter.get("/", getExpense);
expenseRouter.post("/", postExpense)
expenseRouter.get("/:id", getExpenseId)
expenseRouter.delete("/:id", deleteExpense)
expenseRouter.patch("/:id", editExpense)

export { expenseRouter };