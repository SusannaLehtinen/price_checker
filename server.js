const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const orderRoutes = require('./src/routes/orderRoutes');
app.use('/orders', orderRoutes);
