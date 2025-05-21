namespace apijstream.models;

public class Media
{
  public int? idmedia { set; get; }
  public string? background_img { set; get; }
  public string? cover_img { set; get; }
  public string? description { set; get; }
  public byte? genre { set; get; }
  public bool is_tendency { set; get; }
  public DateTime? release { set; get; }
  public string? title { set; get; }
  public byte? type { set; get; }

  public Media() { }

  public Media(int? idmedia, string? background_img, string? cover_img, string? description, byte? genre, bool? is_tendency, DateTime? release, string? title, byte? type)
  {
    this.idmedia = idmedia;
    this.background_img = background_img;
    this.cover_img = cover_img;
    this.description = description;
    this.genre = genre;
    this.is_tendency = is_tendency ?? false;
    this.release = release;
    this.title = title;
    this.type = type;
  }
}