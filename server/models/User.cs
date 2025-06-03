namespace apijstream.models;

public class User
{
  public int iduser { set; get; }
  public DateTime creation_timestamp { set; get; }
  public byte[] password { set; get; }
  public string username { set; get; }

  public User()
  {
    this.iduser = 0;
    this.creation_timestamp = new DateTime();
    this.password = [];
    this.username = "";
  }

  public User(int? iduser, DateTime? creation_timestamp, byte[]? password, string? username)
  {
    this.iduser = iduser ?? 0;
    this.creation_timestamp = creation_timestamp ?? new DateTime();
    this.password = password ?? [];
    this.username = username ?? "";
  }
}