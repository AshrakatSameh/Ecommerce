namespace Core.Interfaces
{
    public interface IResponseCasheService
    {
        Task CacheResponseAsync(string cacheKey, Object response, TimeSpan timeToLive);
        Task<string> GetCachedResponseAsync(string cacheKey);
    }
}