using System.Collections;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;

        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if(_repositories == null)
                _repositories = new Hashtable();

            // get the name of the entity
            var type = typeof(TEntity).Name;

            if(!_repositories.ContainsKey(type))
            {
                var respositoryType = typeof(GenericRepository<>);
                var respositoryInstance = Activator
                        .CreateInstance(respositoryType.MakeGenericType(typeof(TEntity)), _context);
                
                _repositories.Add(type, respositoryInstance);
            }

            return (IGenericRepository<TEntity>) _repositories[type];
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}