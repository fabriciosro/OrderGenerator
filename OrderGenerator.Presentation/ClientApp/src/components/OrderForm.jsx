import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { orderService } from '../services/orderService'

const OrderForm = () => {
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm()

    const onSubmit = async (data) => {
        setLoading(true)
        setResult(null)

        try {
            const response = await orderService.createOrder(data)
            setResult(response)
        } catch (error) {
            setResult({
                Status: 'Error',
                Message: error.message || 'Erro ao enviar ordem'
            })
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const calculateTotal = () => {
        const quantity = parseFloat(watch('quantidade') || 0)
        const price = parseFloat(watch('preco') || 0)
        return quantity * price
    }

    return (
        <div className="order-form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="order-form">
                <div className="form-section">
                    <h2>Dados da Ordem</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="simbolo">Símbolo *</label>
                            <select
                                id="simbolo"
                                {...register('simbolo', { required: 'Símbolo é obrigatório' })}
                                className={errors.simbolo ? 'error' : ''}
                            >
                                <option value="">Selecione um símbolo</option>
                                <option value="PETR4">PETR4 - Petróleo Brasileiro</option>
                                <option value="VALE3">VALE3 - Vale SA</option>
                                <option value="VIIA4">VIIA4 - Via SA</option>
                            </select>
                            {errors.simbolo && (
                                <span className="error-message">{errors.simbolo.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lado">Lado *</label>
                            <select
                                id="lado"
                                {...register('lado', { required: 'Lado é obrigatório' })}
                                className={errors.lado ? 'error' : ''}
                            >
                                <option value="">Selecione o lado</option>
                                <option value="COMPRA">Compra</option>
                                <option value="VENDA">Venda</option>
                            </select>
                            {errors.lado && (
                                <span className="error-message">{errors.lado.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="quantidade">Quantidade *</label>
                            <input
                                id="quantidade"
                                type="number"
                                step="1"
                                min="1"
                                max="99999"
                                {...register('quantidade', {
                                    required: 'Quantidade é obrigatória',
                                    min: { value: 1, message: 'Quantidade mínima é 1' },
                                    max: { value: 99999, message: 'Quantidade máxima é 99.999' },
                                    valueAsNumber: true
                                })}
                                className={errors.quantidade ? 'error' : ''}
                                placeholder="Ex: 100"
                            />
                            {errors.quantidade && (
                                <span className="error-message">{errors.quantidade.message}</span>
                            )}
                            <small>Valor positivo inteiro menor que 100.000</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="preco">Preço *</label>
                            <input
                                id="preco"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="999.99"
                                {...register('preco', {
                                    required: 'Preço é obrigatório',
                                    min: { value: 0.01, message: 'Preço mínimo é 0.01' },
                                    max: { value: 999.99, message: 'Preço máximo é 999.99' },
                                    validate: {
                                        multipleOf001: value =>
                                            (value * 100) % 1 === 0 || 'Preço deve ser múltiplo de 0.01'
                                    },
                                    valueAsNumber: true
                                })}
                                className={errors.preco ? 'error' : ''}
                                placeholder="Ex: 25.50"
                            />
                            {errors.preco && (
                                <span className="error-message">{errors.preco.message}</span>
                            )}
                            <small>Valor positivo decimal múltiplo de 0.01</small>
                        </div>
                    </div>

                    <div className="calculation-section">
                        <div className="calculation-row">
                            <span>Total da Ordem:</span>
                            <strong>{formatCurrency(calculateTotal())}</strong>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Limpar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Enviando...
                            </>
                        ) : (
                            'Enviar Ordem'
                        )}
                    </button>
                </div>
            </form>

            {result && (
                <div className={`result-container ${result.Status?.toLowerCase()}`}>
                    <h3>Resultado da Ordem</h3>
                    <div className="result-details">
                        <div className="result-row">
                            <span>Status:</span>
                            <strong className={`status-${result.Status?.toLowerCase()}`}>
                                {result.Status}
                            </strong>
                        </div>
                        <div className="result-row">
                            <span>Order ID:</span>
                            <span>{result.OrderId}</span>
                        </div>
                        <div className="result-row">
                            <span>Símbolo:</span>
                            <span>{result.Symbol}</span>
                        </div>
                        <div className="result-row">
                            <span>Lado:</span>
                            <span>{result.Side}</span>
                        </div>
                        <div className="result-row">
                            <span>Quantidade:</span>
                            <span>{result.Quantity}</span>
                        </div>
                        <div className="result-row">
                            <span>Preço:</span>
                            <span>{result.Price && formatCurrency(result.Price)}</span>
                        </div>
                        <div className="result-row">
                            <span>Mensagem:</span>
                            <span>{result.Message}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderForm