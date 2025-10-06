import React from 'react'
import OrderForm from './components/OrderForm'

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Order Generator</h1>
                <p>Sistema de Geração de Ordens FIX</p>
            </header>
            <main>
                <OrderForm />
            </main>
        </div>
    )
}

export default App