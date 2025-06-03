import Media from "./media.model";

describe('Media', () => {
  it('should create an instance', () => {
    expect(new Media(0, '', '', '', '', true, new Date(), '', 'serie')).toBeTruthy();
  });

  it('should assign and get description through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date, '', 'serie');

    auxMedia.setBackground('test_background.png');

    expect(auxMedia.getBackground()).toContain('test_background.png');
  });

  it('should assign and get cover through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setCover('test_cover.png');

    expect(auxMedia.getCover()).toContain('test_cover.png');
  });

  it('should assign and get description through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setDescription('test_description');

    expect(auxMedia.getDescription()).toBe('test_description');
  });

  it('should assign and get genre through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setGenre('comedy');

    expect(auxMedia.getGenre()).toBe('comedy');
  });

  it('should assign and get isTendency through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setIsTendency(false);

    expect(auxMedia.getIsTendency()).toBeFalse();
  });

  it('should assign and get release date through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setRelease(new Date(2004, 0));

    expect(auxMedia.getRelease().getFullYear()).toBe(2004);
  });

  it('should assign and get title through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setTitle('test_title');

    expect(auxMedia.getTitle()).toBe('test_title');
  });

  it('should assign and get type through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, new Date(), '', 'serie');

    auxMedia.setType('movie');

    expect(auxMedia.getType()).toBe('movie');
  });
});
