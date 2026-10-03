import app from "./src/app"


const PORT  = 4000 
app.listen(PORT , ()=>{
    console.log(`Http-Backend is listening on PORT ${PORT}`)
})