using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQeury,
                                                 ISpecification<TEntity> spec)
        {
            var query = inputQeury;

            // there is a criteria (where)
            if(spec.Criteria != null) 
            {
                query = query.Where(spec.Criteria);
            }

            // there is an orderBy
            if(spec.OrderBy != null) 
            {
                query = query.OrderBy(spec.OrderBy);
            }
            
            // there is an orderByDesc
            if(spec.OrderByDescending != null) 
            {
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            if(spec.IsPagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            // aggregate includes
            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}