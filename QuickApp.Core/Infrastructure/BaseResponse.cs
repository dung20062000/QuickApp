public class BaseResponse<T>
{
    /// <summary>
    ///     ResponseMessage
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    ///     Status of response
    /// </summary>
    public ResponseStatus Status { get; set; }
    public T? Data { get; set; }
}