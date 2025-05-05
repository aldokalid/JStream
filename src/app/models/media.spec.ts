import Media from "./media.model";

describe('Media', () => {
  it('should create an instance', () => {
    expect(new Media(0, '', '', '', '', true, 0, '', 'serie')).toBeTruthy();
  });

  it('should assign and get description through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setBackground('test_background.png');

    expect(auxMedia.getBackground()).toContain('test_background.png');
  });

  it('should assign and get cover through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setCover('test_cover.png');

    expect(auxMedia.getCover()).toContain('test_cover.png');
  });

  it('should assign and get description through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setDescription('test_description');

    expect(auxMedia.getDescription()).toBe('test_description');
  });

  it('should assign and get genre through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setGenre('comedy');

    expect(auxMedia.getGenre()).toBe('comedy');
  });

  it('should assign and get isTendency through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setIsTendency(false);

    expect(auxMedia.getIsTendency()).toBeFalse();
  });

  it('should assign and get release date through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setRelease(2004);

    expect(auxMedia.getRelease()).toBe(2004);
  });

  it('should assign and get title through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setTitle('test_title');

    expect(auxMedia.getTitle()).toBe('test_title');
  });

  it('should assign and get type through setter and getter', () => {
    const auxMedia = new Media(0, '', '', '', '', true, 0, '', 'serie');

    auxMedia.setType('movie');

    expect(auxMedia.getType()).toBe('movie');
  });
});
