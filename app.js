const express=require("express")
const app=express()
const mongoose=require("mongoose")
const { v4: uuidv4 } = require('uuid');
const PORT=8000

const mongourl=("mongodb+srv://vibitha:vibithabalamurali@cluster0.dajbe.mongodb.net/practice")
mongoose
.connect(mongourl)
.then(() => {
    console.log("Db connected")
    app.listen(PORT,() => {
        console.log("my server is running")
    })
})


const expenseSchema = new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:String,required:true},
});


const expenseModel = mongoose.model("expense-tracker",expenseSchema);

app.use(express.json())
app.post("/api/expenses",async (req,res)=>{
    const{title,amount}=req.body;
    const newExpense = new expenseModel({
        id:uuidv4(),
        title:title,
        amount:amount,
    });
    const savedExpense = await newExpense.save();
    res.status(200).json(savedExpense);

});

app.get("/api/expenses",async(req,res)=>
    {
        const resul=await expenseModel.find({})
        res.json(resul)
    });
    app.get("/api/expensesById/:id",async(req,res)=>{
        const{id}=req.params;
        const expenses=await expenseModel.findOne({id});
        res.json(expenses);
       })

       app.put("/api/expenses/:id",async(req,res) => {
        const {id} = req.params;
        const{title,amount} = req.body;
        const updatedExpenses = await expenseModel.findOneAndUpdate(
            {
                id:id
            },
            {
                title:title,
                amount:amount,
            }
        )
        res.status(200).json(updatedExpenses);
    })
app.delete("/api/expenses/:id", async (req, res) => {  
    const { id } = req.params;  
    try {  
        const deletedExpense = await expenseModel.findOneAndDelete({ id });  
        
        if (!deletedExpense) {  
            return res.status(404).json({ message: "Expense not found" });  
        }  
        
        res.status(200).json({ message: "Expense deleted successfully", deletedExpense });  
    } catch (error) {  
        res.status(500).json({ message: "Error deleting expense", error });  
    }  
});