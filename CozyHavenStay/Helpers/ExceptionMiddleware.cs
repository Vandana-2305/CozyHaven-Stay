using System.Net;
using System.Text.Json;

namespace CozyHavenStay.Helpers
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var statusCode = ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase)
                ? HttpStatusCode.NotFound
                : ex.Message.Contains("already registered", StringComparison.OrdinalIgnoreCase)
                ? HttpStatusCode.Conflict
                : ex.Message.Contains("Invalid email or password", StringComparison.OrdinalIgnoreCase)
                ? HttpStatusCode.Unauthorized
                : HttpStatusCode.InternalServerError;

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                status = (int)statusCode,
                message = ex.Message
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}