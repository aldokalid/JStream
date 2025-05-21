namespace apijstream.models;

public class User
{
  public int? iduser { set; get; }
  public DateTime? birthdate { set; get; }
  public byte[]? password { set; get; }
  public string? username { set; get; }

  public User() { }

  public User(int? iduser, DateTime? birthdate, byte[]? password, string? username)
  {
    this.iduser = iduser;
    this.birthdate = birthdate;
    this.password = password;
    this.username = username;
  }
}