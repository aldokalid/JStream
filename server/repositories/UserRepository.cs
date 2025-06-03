using apijstream.data;
using apijstream.interfaces;
using apijstream.models;

namespace apijstream.repositories;

public class UserRepository : IEntity<User, string>
{
  private readonly JStreamDbContext _dbContext;

  public UserRepository(JStreamDbContext dbContext)
  {
    _dbContext = dbContext;
  }
  public async Task<User> CreateAsync(User entity)
  {
    // @deprecated Debe usar el procedimiento.
    var auxEntity = await _dbContext.Users.AddAsync(entity);
    await _dbContext.SaveChangesAsync();

    return auxEntity.Entity;
  }

  public Task<IEnumerable<User>> GetAllAsync()
  {
    throw new NotImplementedException(">ERR:FORBIDDEN; user massive retrieval is forbidden");
  }

  public Task<User?> GetByIdAsync(string id)
  {
    throw new NotImplementedException();
  }

  public Task<bool> RemoveAsync(User entity)
  {
    throw new NotImplementedException(">ERR:FORBIDDEN; user removal is forbidden");
  }

  public Task<bool> UpdateAsync(User entity)
  {
    throw new NotImplementedException();
  }
}
