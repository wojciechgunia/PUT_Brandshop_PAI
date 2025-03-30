package pl.put.brandshop.order.exceptions;

public class UknowPaymentTypException extends RuntimeException
{
    public UknowPaymentTypException()
    {
    }

    public UknowPaymentTypException(String message)
    {
        super(message);
    }

    public UknowPaymentTypException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public UknowPaymentTypException(Throwable cause)
    {
        super(cause);
    }
}
