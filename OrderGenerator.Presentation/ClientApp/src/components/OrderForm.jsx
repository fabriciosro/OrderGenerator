import React, { useState, useEffect } from 'react' // ⬅️ Adicione useEffect
import { useForm } from 'react-hook-form'
import { orderService } from '../services/orderService'
import { exposureService } from '../services/exposureService'

const OrderForm = () => {
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [exposures, setExposures] = useState([])
    const [loadingExposures, setLoadingExposures] = useState(false)
    const [resetting, setResetting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm()

    // Carregar exposições automaticamente quando o componente montar
    useEffect(() => {
        handleGetExposures();
    }, []); // ⬅️ Array vazio = executa apenas uma vez

    const onSubmit = async (data) => {
        setLoading(true)
        setResult(null)

        try {
            const apiData = {
                Symbol: data.simbolo,
                Side: data.lado === 'COMPRA' ? 1 : 2,
                Quantity: parseFloat(data.quantidade),
                Price: parseFloat(data.preco)
            }

            console.log("Enviando ordem:", apiData);

            // Chamar createOrder
            const response = await orderService.createOrder(apiData)
            console.log("Resposta recebida:", response);
            setResult(response)

            // Atualizar exposições após enviar ordem
            await handleGetExposures();

        } catch (error) {
            setResult({
                Status: 'Error',
                Message: error.message || 'Erro ao enviar ordem'
            })
        } finally {
            setLoading(false)
        }
    }

    // Nova função para buscar exposições
    const handleGetExposures = async () => {
        setLoadingExposures(true)
        try {
            const exposuresData = await exposureService.getExposures()
            console.log("Exposições recebidas:", exposuresData);

            if (Array.isArray(exposuresData)) {
                setExposures(exposuresData)
            } else {
                console.warn("Exposições não é um array:", exposuresData)
                setExposures([])
            }
        } catch (exposureError) {
            console.error("Erro ao buscar exposições:", exposureError)
            setExposures([])
        } finally {
            setLoadingExposures(false)
        }
    }

    const handleResetAccumulator = async () => {
        setResetting(true);
        try {
            const response = await exposureService.resetAccumulator();
            console.log("Reset response:", response);
            // Recarregar as exposições após o reset
            await handleGetExposures();
        } catch (error) {
            console.error("Erro no reset:", error);
            alert("Erro ao resetar: " + error.message);
        } finally {
            setResetting(false);
        }
    };

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

    // Função para determinar a classe CSS baseada no status
    const getStatusClass = (status) => {
        if (!status) return 'unknown';

        const statusLower = status.toLowerCase();
        if (statusLower === 'new') return 'new';
        if (statusLower === 'rejected') return 'rejected';
        if (statusLower === 'error') return 'error';
        return 'unknown';
    }

    // Função para formatar o lado para português
    const formatSide = (side) => {
        if (!side) return 'Desconhecido';

        const sideLower = side.toLowerCase();
        if (sideLower === 'compra' || sideLower === 'buy') return 'Compra';
        if (sideLower === 'venda' || sideLower === 'sell') return 'Venda';
        return side;
    }

    // Função para formatar o status para português
    const formatStatus = (status) => {
        if (!status) return 'Desconhecido';

        const statusLower = status.toLowerCase();
        if (statusLower === 'new') return 'Aceita';
        if (statusLower === 'rejected') return 'Rejeitada';
        if (statusLower === 'error') return 'Erro';
        return status;
    }

    // Função para formatar o exposure (positivo/negativo)
    const formatExposure = (exposure) => {
        return formatCurrency(Math.abs(exposure));
    }

    // Função para determinar a classe do exposure baseada no valor
    const getExposureClass = (exposure) => {
        if (exposure > 0) return 'exposure-positive';
        if (exposure < 0) return 'exposure-negative';
        return 'exposure-neutral';
    }

    // Função segura para renderizar exposições
    const renderExposures = () => {
        if (!Array.isArray(exposures) || exposures.length === 0) {
            return (
                <div className="exposures-container">
                    <div className="exposures-header">
                        <h3>Exposições Atuais</h3>
                    </div>
                    <div className="no-exposures">
                        <p>Nenhuma exposição encontrada</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="exposures-container">
                <div className="exposures-header">
                    <h3>Exposições Atuais</h3>
                </div>
                <div className="exposures-grid">
                    {exposures.map((exposure) => (
                        <div key={exposure.id} className={`exposure-item ${getExposureClass(exposure.currentExposure)}`}>
                            <div className="exposure-symbol">{exposure.symbol}</div>
                            <div className="exposure-value">
                                {exposure.currentExposure >= 0 ? '+' : '-'}{formatExposure(exposure.currentExposure)}
                            </div>
                            <div className="exposure-label">
                                {exposure.currentExposure >= 0 ? 'Exposição Positiva' : 'Exposição Negativa'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
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
                        type="button"
                        onClick={handleResetAccumulator}
                        className="btn-warning"
                        disabled={resetting}
                    >
                        {resetting ? (
                            <>
                                <span className="spinner"></span>
                                Resetando...
                            </>
                        ) : (
                            'Resetar Exposições'
                        )}
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
                <div className={`result-container ${getStatusClass(result.status || result.Status)}`}>
                    <h3>Resultado da Ordem</h3>
                    <div className="result-details">
                        <div className="result-row">
                            <div className="result-column">
                                <span className="label">Status:</span>
                                <strong className={`status-${getStatusClass(result.status || result.Status)}`}>
                                    {formatStatus(result.status || result.Status)}
                                </strong>
                            </div>
                            <div className="result-column">
                                <span className="label">Order ID:</span>
                                <span className="value">{result.OrderID || result.orderID || 'N/A'}</span>
                            </div>
                            <div className="result-column">
                                <span className="label">Símbolo:</span>
                                <span className="value">{result.symbol || result.Symbol}</span>
                            </div>
                            <div className="result-column">
                                <span className="label">Lado:</span>
                                <span className="value">{formatSide(result.side || result.Side)}</span>
                            </div>
                        </div>

                        <div className="result-row">
                            <div className="result-column">
                                <span className="label">Quantidade:</span>
                                <span className="value">{result.quantity || result.Quantity}</span>
                            </div>
                            <div className="result-column">
                                <span className="label">Preço:</span>
                                <span className="value">{formatCurrency(result.price || result.Price)}</span>
                            </div>
                            <div className="result-column">
                                <span className="label">Vl Total:</span>
                                <span className="value">{formatCurrency(calculateTotal())}</span>
                            </div>
                            <div className="result-column">
                                <span className="label">Mensagem:</span>
                                <span className="value">{result.message || result.Message}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {renderExposures()}
        </div>
    )
}

export default OrderForm