var express = require('express');
var router = express.Router();
var db = require("../services/db");

const expenseSchema = require("../schemas/expanses");

router.get('/', async function (req, res, next) {

    let conn;
    try {
        conn = await db.getConnection();
        const query2 = "SELECT * FROM expenses";
    
        const stmt2 = await conn.prepare(query2);
        const result2 = await stmt2.execute();

        res.render("expenses/expense", { items: result2 });
    } catch (error) { 
        console.log(error);
        res.render("expenses/expense", { error_database: true });
    } finally {
        conn.release();
    }
});

router.get('/add', function (req, res, next) {
    res.render('expenses/expensesAdd');
});

router.get('/expense', function (req, res, next) {
    res.render('expenses/expense');
});

router.get('/', async function (req, res, next) {
    let conn;
    try {
        conn = await db.getConnection();

        const query = "SELECT * FROM expenses";

        const result = await conn.query(query);

        res.render('expenses/expenses', { expenses: result });
    } catch (error) {
        // Ako dođe do greške, ispiši grešku
        console.error("Greška prilikom učitavanja troškova:", error);
        res.render('expenses/expenses', { error_database: true });
    } finally {
        if (conn) conn.release();
    }
});

router.post("/addExpense", async function (req, res, next) {
    const result = expenseSchema.validate(req.body);
    

    if (result.error) {
        res.render("expenses/expensesAdd", { error_validation: true });
        return;
    }

    let conn;
    try {
        conn = await db.getConnection();
        const query = "INSERT INTO expenses (name, amount, date, category) VALUES (?,?,?,?) RETURNING *";
        const values = [req.body.name, req.body.amount, req.body.date, req.body.category];

        await conn.query(query, values);
        res.render("expenses/expensesAdd", { success: true });
    } catch (error) {
        res.render("expenses/expensesAdd", { error_database: true });
    } finally {
        if (conn) conn.release();
    }
});

router.post("/delete/:id", async function (req, res, next) {
console.log("test");


    const expenseId = req.params.id;

    let conn;
    try {
        conn = await db.getConnection();
        const query = "DELETE FROM expenses WHERE id = ?"; 
        await conn.query(query, [expenseId]);

        res.redirect('/expenses');
    } catch (error) {
        console.error("Greška prilikom brisanja troška:", error);
        res.render('expense/expenses', { error_database: true });
    } finally {
        if (conn) conn.release();
    }
});


module.exports = router;