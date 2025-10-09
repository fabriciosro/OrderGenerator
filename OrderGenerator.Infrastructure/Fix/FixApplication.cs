using QuickFix;
using QuickFix.Fields;
using QuickFix.FIX44;
using OrderGenerator.Domain.Interfaces;
using OrderGenerator.Domain.Entities;
using Microsoft.Extensions.Logging;
using Message = QuickFix.Message;

namespace OrderGenerator.Infrastructure.Fix;

public class FixApplication : MessageCracker, IApplication, IFixMessageService
{
    private readonly Dictionary<string, TaskCompletionSource<string>> _pendingOrders = new();
    private readonly ILogger<FixApplication> _logger;

    public FixApplication(ILogger<FixApplication> logger)
    {
        _logger = logger;
    }

    #region IApplication Implementation
    public void FromAdmin(Message message, SessionID sessionID)
    {
        _logger.LogDebug("Admin message received: {MessageType}", message.GetType().Name);
    }

    public void ToAdmin(Message message, SessionID sessionID)
    {
        _logger.LogDebug("Sending admin message: {MessageType}", message.GetType().Name);
    }

    public void FromApp(Message message, SessionID sessionID)
    {
        Crack(message, sessionID);
    }

    public void ToApp(Message message, SessionID sessionID)
    {
        _logger.LogDebug("Sending app message: {MessageType}", message.GetType().Name);
    }

    public void OnCreate(SessionID sessionID)
    {
        _logger.LogInformation("FIX Session created: {SessionID}", sessionID);
    }

    public void OnLogout(SessionID sessionID)
    {
        _logger.LogInformation("FIX Session logout: {SessionID}", sessionID);
    }

    public void OnLogon(SessionID sessionID)
    {
        _logger.LogInformation("FIX Session logon: {SessionID}", sessionID);
    }
    #endregion

    #region MessageCracker Methods
    public void OnMessage(ExecutionReport message, SessionID sessionID)
    {
        try
        {
            var clOrdID = message.ClOrdID.getValue();
            var execType = message.ExecType.getValue();
            var symbol = message.Symbol.getValue();
            var side = message.Side.getValue();
            var quantity = message.OrderQty.getValue();
            var price = message.Price.getValue();

            string sideDescription = side == '1' ? "Compra" : (side == '2' ? "Venda" : "Unknown");

            var result = new
            {
                ClOrdID = clOrdID,
                ExecType = execType.ToString(),
                Symbol = symbol,
                Side = sideDescription,
                Quantity = quantity,
                Price = price,
                Status = execType == '0' ? "New" : execType == '8' ? "Rejected" : "Unknown",
                Message = execType == '0' ? "Ordem aceita" : execType == '8' ? "Ordem rejeitada" : "Unknown"
            };

            var resultJson = System.Text.Json.JsonSerializer.Serialize(result);

            if (_pendingOrders.TryGetValue(clOrdID, out var tcs))
            {
                tcs.TrySetResult(resultJson);
                _logger.LogInformation("Order {OrderId} processed with status: {Status}", clOrdID, result.Status);
            }
            else
            {
                _logger.LogWarning("Received response for unknown order: {OrderId}", clOrdID);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing ExecutionReport");
        }
    }
    #endregion

    #region IFixMessageService Implementation
    public async Task<string> SendNewOrderSingleAsync(Order order)
    {
        var sessionID = Session.LookupSession(new SessionID("FIX.4.4", "ORDERGEN", "ORDERACC"));
        if (sessionID == null)
        {
            throw new ApplicationException("FIX session not available");
        }

        var clOrdID = order.ClOrdID.ToString();
        var tcs = new TaskCompletionSource<string>();
        _pendingOrders[clOrdID] = tcs;

        try
        {
            var newOrder = CreateNewOrderSingle(order);
            sessionID.Send(newOrder);

            _logger.LogInformation("Order {OrderId} sent via FIX - Symbol: {Symbol}, Side: {Side}, Qty: {Quantity}, Price: {Price}",
                clOrdID, order.Symbol, order.Side, order.Quantity, order.Price);

            // Wait for response with timeout
            var timeoutTask = Task.Delay(TimeSpan.FromSeconds(10));
            var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

            if (completedTask == timeoutTask)
            {
                throw new TimeoutException("Timeout waiting for FIX response");
            }

            return await tcs.Task;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending FIX order");
            throw;
        }
        finally
        {
            _pendingOrders.Remove(clOrdID);
        }
    }
    #endregion

    #region Private Methods
    private NewOrderSingle CreateNewOrderSingle(Order order)
    {
        var newOrder = new NewOrderSingle(
            new ClOrdID(order.ClOrdID.ToString()),
            new Symbol(order.Symbol),
            new Side((OrderSide)order.Side == OrderSide.Buy ? '1' : '2'),
            new TransactTime(DateTime.UtcNow),
            new OrdType(OrdType.LIMIT));

        newOrder.Set(new OrderQty(order.Quantity));
        newOrder.Set(new Price(order.Price));
        newOrder.Set(new TimeInForce(TimeInForce.DAY));

        return newOrder;
    }
    #endregion
}